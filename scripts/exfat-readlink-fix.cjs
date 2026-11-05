// Workaround for running Next.js from an exFAT drive on Windows.
//
// On exFAT, fs.readlink() on a regular file fails with EISDIR instead of EINVAL.
// Webpack/Next treat EINVAL as "not a symlink" but crash on EISDIR. This preload
// rewrites that one error code. It does nothing on NTFS or other systems, and can be
// deleted if the project moves to an NTFS drive.
//
// Loaded via `node -r` in package.json scripts; it also adds itself to NODE_OPTIONS
// so Next's worker processes get the same patch.
const fs = require("node:fs");
const path = require("node:path");

const fix = (err) => {
  if (err && err.code === "EISDIR" && err.syscall === "readlink") {
    err.code = "EINVAL";
    err.errno = -4071;
  }
  return err;
};

const origReadlink = fs.readlink;
fs.readlink = function (p, options, cb) {
  if (typeof options === "function") {
    cb = options;
    options = undefined;
  }
  return origReadlink.call(fs, p, options, (err, res) => cb(fix(err), res));
};

const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (p, options) {
  try {
    return origReadlinkSync.call(fs, p, options);
  } catch (err) {
    throw fix(err);
  }
};

const origPromise = fs.promises.readlink;
fs.promises.readlink = async function (p, options) {
  try {
    return await origPromise.call(fs.promises, p, options);
  } catch (err) {
    throw fix(err);
  }
};

// exFAT also drops file-change events, so `next dev` hot reload needs polling.
if (!process.env.WATCHPACK_POLLING) process.env.WATCHPACK_POLLING = "true";

// NODE_OPTIONS treats backslashes as escapes, so pass a forward-slash path.
const self = `--require "${path.resolve(__filename).replace(/\\/g, "/")}"`;
if (!(process.env.NODE_OPTIONS || "").includes(path.basename(__filename))) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} ${self}`.trim();
}

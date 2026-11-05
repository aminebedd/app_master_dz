import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  href: string;
  title: string;
  /** Cover image; when absent, `video` supplies the cover frame. */
  cover?: string;
  coverContain?: boolean;
  video?: string;
  /** 16:10 for sites, 9:16 for vertical videos. */
  shape?: "wide" | "tall";
  meta?: ReactNode;
  titleAs?: "h2" | "h3";
  sizes?: string;
  /** Play-button overlay; on by default for videos. */
  showPlay?: boolean;
};

// A picture and a name. The whole card is the link.
export function WorkCard({
  href,
  title,
  cover,
  coverContain,
  video,
  shape = "wide",
  meta,
  titleAs = "h3",
  sizes,
  showPlay = !!video,
}: Props) {
  const H = titleAs;
  return (
    <a href={href} className="group flex flex-col gap-4">
      <div
        className={`relative overflow-hidden rounded-lg border border-line bg-raised transition-transform duration-200 group-hover:-translate-y-1 ${
          shape === "tall" ? "aspect-[9/16]" : "aspect-[16/10]"
        }`}
      >
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes={sizes ?? "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"}
            className={coverContain ? "object-contain p-4" : "object-cover object-top"}
          />
        ) : video ? (
          // `#t=1` shows the frame at one second instead of a black first frame.
          <video src={`${video}#t=1`} muted playsInline preload="metadata" aria-hidden className="size-full object-cover" />
        ) : null}
        {showPlay && (
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center opacity-90 transition-opacity group-hover:opacity-100"
          >
            <span className="grid size-14 place-items-center rounded-full bg-inverse text-on-inverse">
              <svg viewBox="0 0 20 20" className="size-5 translate-x-px" fill="currentColor">
                <path d="M6 4l10 6-10 6z" />
              </svg>
            </span>
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <H className="text-h4 font-medium text-fg decoration-primary underline-offset-4 group-hover:underline">{title}</H>
        {meta}
      </div>
    </a>
  );
}

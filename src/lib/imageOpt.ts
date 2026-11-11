// URL helpers for Next's built-in image optimizer (`/_next/image`), which
// resizes an image to the requested width and re-encodes it as WebP (sharp),
// caching the result. The homepage used to ship the original uploads — e.g.
// four ~2 MB PNG hero backgrounds plus a 1.9 MB PNG fallback, ~21 MB per page
// view — which is what drove PageSpeed's 36 s LCP. Only same-origin media
// (`/api/media/file/...`, CMS uploads) and repo assets (`/assets/...`) go
// through it; anything else (empty, absolute URLs) is returned unchanged.
//
// `w` MUST be one of Next's allowed sizes (default deviceSizes [640, 750,
// 828, 1080, 1200, 1920, 2048, 3840] + imageSizes [16, 32, 48, 64, 96, 128,
// 256, 384]) or the optimizer answers 400 — keep every width below on that
// list. `q` must be one of images.qualities in next.config.mjs ([75, 85, 90]).
// Quality tiers (lossy WebP; higher = sharper + bigger): HERO 75 (soft
// backgrounds under a scrim), PHOTO 85 (brand photos), DETAIL 90 (faces and
// small text — doctor portraits, award certificates). At 75 portraits looked
// slightly smoothed when zoomed; 90 costs only ~10 KB more per portrait.
//
// public/js/main.js has a small copy of this logic (it builds the homepage
// cards in the browser) — keep the two in sync.
export const QUALITY = { hero: 75, photo: 85, detail: 90 } as const
export type OptQuality = (typeof QUALITY)[keyof typeof QUALITY]

export type OptWidth = 256 | 384 | 640 | 828 | 1080 | 1920

export function isOptimizable(src: string | null | undefined): src is string {
  return Boolean(src) && (src!.startsWith('/api/media/file/') || src!.startsWith('/assets/'))
}

export function optimizedSrc(src: string, width: OptWidth, quality: OptQuality = QUALITY.photo): string {
  if (!isOptimizable(src)) return src
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

export function optimizedSrcSet(src: string, widths: OptWidth[], quality: OptQuality = QUALITY.photo): string | undefined {
  if (!isOptimizable(src)) return undefined
  return widths.map((w) => `${optimizedSrc(src, w, quality)} ${w}w`).join(', ')
}

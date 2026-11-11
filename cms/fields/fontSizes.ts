// Font-size presets for the CMS rich-text "Font size" toolbar menu (Payload's
// TextStateFeature) on Programs > About Program. 14px to 30px in 2px steps.
//
// The editor stores only the KEY (e.g. { "$": { "fontSize": "20" } } on a text
// node), never the pixel value. Pixels live here (admin preview) and in
// public/css/rich-text-sizes.css (website, classes .rt-fs-14 ... .rt-fs-30), so
// changing a size later never needs a content migration. Keep the three in sync:
// this list, that CSS file, and RichTextContent.tsx (which maps key -> class).
export const FONT_SIZE_VALUES = [14, 16, 18, 20, 22, 24, 26, 28, 30] as const
export const DEFAULT_FONT_SIZE = 16

export const fontSizeState = {
  fontSize: Object.fromEntries(
    FONT_SIZE_VALUES.map((px) => [
      String(px),
      {
        label: px === DEFAULT_FONT_SIZE ? `${px}px (ปกติ)` : `${px}px`,
        css: { 'font-size': `${px}px` },
      },
    ]),
  ),
}

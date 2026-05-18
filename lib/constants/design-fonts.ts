import {
  destructiveColor,
  foregroundColor,
  mutedForegroundColor,
} from "@/lib/constants/design-colors";

/** Font size utilities */
export const smFont = "text-sm";
export const baseFont = "text-base";
export const lgFont = "text-lg";
export const xl2Font = "text-2xl";
export const xl3Font = "text-3xl";

/** Composite typography presets */
export const captionFont = `${smFont} ${mutedForegroundColor}`;
export const bodyFont = `${baseFont} ${foregroundColor}`;
export const bodyMediumFont = `${baseFont} font-medium ${foregroundColor}`;
export const siteTitleFont = `${lgFont} font-semibold ${foregroundColor}`;
export const pageHeadingFont = `${xl2Font} font-semibold ${foregroundColor}`;
export const subtitleFont = `${baseFont} ${mutedForegroundColor}`;
export const statLabelFont = captionFont;
export const statValueFont = `${xl3Font} font-semibold tabular-nums ${foregroundColor}`;
export const errorMessageFont = `${smFont} leading-5 ${destructiveColor}`;
export const backLinkFont = captionFont;

/** shadcn Input base styles */
export const inputClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm";

/** shadcn Button base styles */
export const buttonBaseClassName =
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

/** shadcn Button variant styles */
export const buttonDefaultVariantClassName =
  "bg-primary text-primary-foreground [a]:hover:bg-primary/80";
export const buttonOutlineVariantClassName =
  "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground";
export const buttonGhostVariantClassName =
  "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground";

/** shadcn Button size styles */
export const buttonDefaultSizeClassName =
  "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2";
export const buttonIconSizeClassName = "size-8";

/** shadcn Avatar root styles */
export const avatarClassName =
  "relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken";

/** shadcn Avatar fallback styles */
export const avatarFallbackClassName =
  "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground";

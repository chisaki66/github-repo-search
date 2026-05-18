"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import {
  avatarClassName,
  avatarFallbackClassName,
} from "@/lib/constants/design-components";
import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: AvatarPrimitive.Root.Props) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarClassName, className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackClassName, className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };

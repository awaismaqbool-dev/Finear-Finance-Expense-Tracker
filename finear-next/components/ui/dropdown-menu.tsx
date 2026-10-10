"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuItem = DropdownMenuPrimitive.Item;

export function DropdownMenuContent({ children, className = "", ...props }: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.Content className={className} sideOffset={8} align="end" {...props}>{children}</DropdownMenuPrimitive.Content></DropdownMenuPrimitive.Portal>;
}

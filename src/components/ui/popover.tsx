'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';
import { useId } from 'react';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

interface PopoverTriggerWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> {
  label?: string;
}

const PopoverTrigger = React.forwardRef(function PopoverTrigger(
  {
    className,
    children,
    label,
    ...props
  }: PopoverTriggerWithLabelProps,
  ref: React.Ref<React.ElementRef<typeof PopoverPrimitive.Trigger>>,
) {
  const inputId = useId();

  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      data-slot="popover-trigger"
      className={cn(
        'relative flex h-12 bg-input w-full rounded-md border border-input px-3 pt-5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'justify-between items-center',
        className,
      )}
      {...props}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'absolute left-4 font-normal pointer-events-none transition-all duration-200',
            'top-1 text-sm text-primary',
          )}
        >
          {label}
        </label>
      )}
      {children}
    </PopoverPrimitive.Trigger>
  );
});

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };

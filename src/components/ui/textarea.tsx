'use client';

import {
  useState,
  useEffect,
  forwardRef,
  type TextareaHTMLAttributes,
  useId,
} from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const textareaId = useId();

    useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const shouldFloat = isFocused || hasValue || !!placeholder;

    return (
      <div className='relative'>
        <textarea
          id={textareaId}
          data-slot="textarea"
          className={cn(
            'border placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-[4rem] w-full rounded-md border bg-transparent px-4 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            shouldFloat ? 'pt-5 pb-1' : 'py-3',
            'bg-input',
            'placeholder:text-muted-foreground placeholder:text-sm',
            className,
          )}
          ref={ref}
          placeholder={shouldFloat && placeholder ? placeholder : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        />
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'absolute left-4 font-normal pointer-events-none transition-all duration-200',
              shouldFloat
                ? 'top-1 text-sm text-primary'
                : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground',
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };

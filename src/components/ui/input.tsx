'use client';
import {
  useState,
  useEffect,
  forwardRef,
  type InputHTMLAttributes,
  useId,
} from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const inputId = useId();

    useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const shouldFloat = isFocused || hasValue || !!placeholder;

    return (
      <div className='relative'>
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex h-12 border w-full rounded-md bg-input px-4 text-base ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            shouldFloat ? 'pt-5 pb-1' : 'py-3',
            'placeholder:text-foreground placeholder:text-sm',
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
            htmlFor={inputId}
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

Input.displayName = 'Input';

export { Input };

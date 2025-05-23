import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title?: string;
  description?: string;
  right?: ReactNode;
  backItem?: ReactNode;
  className?: string;
}

export default function Heading({ title, description, right, backItem, className }:Props){
  return(
    <div className={cn('flex items-center justify-between gap-5 lg:min-h-12', className)}>
      <div className="flex flex-col gap-2 w-full">
        {backItem && backItem}
        <div className="flex flex-col gap-1 w-full">
          {title && (<h1 className="heading-01">{title}</h1>)}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {right && right}
    </div>
  );
}

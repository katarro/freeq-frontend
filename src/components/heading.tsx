import { ReactNode } from 'react';

type Props = {
  title?: string;
  description?: string;
  right?: ReactNode;
  backItem?: ReactNode;
}

export default function Heading({ title, description, right, backItem }:Props){
  return(
    <div className="flex items-center justify-between gap-5 lg:min-h-12">
      <div className="flex flex-col gap-2">
        {backItem && backItem}
        <div className="flex flex-col gap-1">
          {title && (<h1 className="heading-01">{title}</h1>)}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {right && right}
    </div>
  );
}

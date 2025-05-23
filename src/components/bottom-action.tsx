import { ReactNode } from 'react';

type Props = {
  children: ReactNode
}

export default function BottomAction({ children }: Props) {
  return(
    <div className="fixed p-4 border-y border-y-border left-0 lg:hidden bottom-[calc(55px)] bg-background w-full z-10">
      {children}
    </div>
  );
}

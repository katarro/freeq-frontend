'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PrivateLayout({ children }: Props) {
  return <>{children}</>;
}

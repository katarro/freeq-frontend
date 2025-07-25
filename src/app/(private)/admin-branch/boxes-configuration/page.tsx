'use client';

import CardsOverview from './_components/cards-overview';
import type { Queue } from './_components/queue-card';
import QueuesTabs from './_components/queue-tabs';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function BoxesConfigurationPage() {
  const handleEdit = (queue: Queue) => {
    console.warn('Editando caja:', queue);
  };

  const handleConfigure = (queue: Queue) => {
    console.warn('Configurando caja:', queue);
  };

  const handleDelete = (queue: Queue) => {
    console.warn('Eliminando caja:', queue);
  };

  return (
    <>
      <section className="grid gap-4">
        <Heading
          title="Configuración de cajas"
          right={
            <Link
              href="/admin-branch/boxes-configuration/new"
              aria-label="Agregar caja"
              className={cn(buttonVariants({ variant: 'default' }), 'hidden lg:flex')}
            >
              <Plus />
              Agregar caja
            </Link>
          }
        />
        <Separator />
        <CardsOverview />
        <QueuesTabs
          handleEdit={handleEdit}
          handleConfigure={handleConfigure}
          handleDelete={handleDelete}
        />
      </section>
    </>
  );
}

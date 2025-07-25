import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import OperatorsOverviewCards from '@/app/(private)/admin-branch/operators/_components/operators-overview-cards';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import OperatorTable from '@/app/(private)/admin-branch/operators/_components/operators-table';
import { executives } from '@/app/(private)/admin-branch/operators/data';
import { OperatorValues } from '@/lib/schemas';

export default function OperatorsPage() {
  return (
    <section className="w-full grid gap-4">
      <Heading
        title="Gestión de ejecutivos"
        right={
          <Link
            href="/admin-branch/operators/new"
            aria-label="Agregar administrador"
            className={cn(buttonVariants({ variant: 'default' }), 'hidden lg:flex')}
          >
            <Plus />
            Agregar ejecutivos
          </Link>
        }
      />
      <Separator />
      <OperatorsOverviewCards operators={executives as OperatorValues[]} />
      <div className="overflow-hidden">
        <OperatorTable data={executives as OperatorValues[]} />
      </div>
    </section>
  );
}

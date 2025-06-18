import Heading from '@/components/heading';

import RealTimeOverviewCards from './_components/real-time-overview-cards';
import ActiveAlertsSection from './_components/active-alerts-section';

import { operators } from '@/app/(private)/admin-business/main-panel/data';
import { Separator } from '@/components/ui/separator';
import OperatorActivityTable from '@/app/(private)/admin-business/main-panel/_components/operator-activity-table';
import { useAuthPageAnimation } from '@/hooks/use-auth-page-animation';
import { AnimatePresence } from 'framer-motion';
import AuthLoadingScreen from '@/components/auth/auth-loading-screen';

export default function RealTimeDashboardPage() {
  const { loading, showForm, setShowForm } = useAuthPageAnimation();

  const activeOperators = operators.filter(
    (op) => op.status === 'Atendiendo' || op.status === 'Disponible',
  ).length;
  const totalWaiting = operators.reduce(
    (sum, op) => sum + (op.waitingClients ?? 0),
    0,
  );
  const avgEfficiency = Math.round(
    operators.reduce((sum, op) => sum + (op.efficiency ?? 0), 0) /
      operators.length,
  );

  return (
    <section className='w-full grid gap-4'>
      <AnimatePresence>
        {loading && (
          <AuthLoadingScreen
            onAnimationStart={() => {
              if (!loading) {
                setShowForm(true);
              }
            }}
          />
        )}
      </AnimatePresence>
      <Heading
        title='Panel en Tiempo Real'
        description='Monitoreo en vivo de la actividad de operadores y clientes'
      />
      <Separator />
      <RealTimeOverviewCards
        activeOperators={activeOperators}
        totalOperators={operators.length}
        totalWaitingClients={totalWaiting}
        avgEfficiency={avgEfficiency}
        activeAlerts={2}
      />
      <div className='overflow-hidden'>
        <OperatorActivityTable operators={operators} />
      </div>
      <ActiveAlertsSection />
    </section>
  );
}

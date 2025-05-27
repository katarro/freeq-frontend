import { TabsContent } from '@/components/ui/tabs';
import { Building, Settings } from 'lucide-react';
import QueueCard, { Queue } from '../queue-card';
import { queueConfigs } from '@/app/(private)/subsidiary-manager/boxes-configuration/data';

type Props = {
  handleEdit: (queue: Queue) => void;
  handleConfigure: (queue: Queue) => void;
  handleDelete: (queue: Queue) => void;
};

export default function PhysicalQueuesTab({ handleEdit, handleConfigure, handleDelete }: Props) {
  return (
    <TabsContent value="physical" className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {queueConfigs.physical.map((queue) => (
          <QueueCard
            key={queue.id}
            queue={queue as any}
            IconComponent={Building}
            handleEdit={handleEdit}
            handleConfigure={handleConfigure}
            handleDelete={handleDelete}
            configureActionLabel="Configurar"
            configureActionIcon={Settings}
          />
        ))}
      </div>
    </TabsContent>
  );
}

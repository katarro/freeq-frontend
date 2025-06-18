import { TabsContent } from '@/components/ui/tabs';
import { Shuffle } from 'lucide-react';
import QueueCard, { Queue } from '../queue-card';
import { queueConfigs } from '@/app/(private)/admin-business/boxes-configuration/data';

type Props = {
  handleEdit: (queue: Queue) => void;
  handleConfigure: (queue: Queue) => void;
  handleDelete: (queue: Queue) => void;
};

export default function MixedQueuesTab({
  handleEdit,
  handleConfigure,
  handleDelete,
}: Props) {
  return (
    <TabsContent value='mixed' className='space-y-4'>
      <div className='grid gap-4 lg:grid-cols-2'>
        {queueConfigs.mixed.map((queue) => (
          <QueueCard
            key={queue.id}
            queue={queue}
            IconComponent={Shuffle}
            handleEdit={handleEdit}
            handleConfigure={handleConfigure}
            handleDelete={handleDelete}
            configureActionLabel='Configurar modo'
            configureActionIcon={Shuffle}
          />
        ))}
      </div>
    </TabsContent>
  );
}

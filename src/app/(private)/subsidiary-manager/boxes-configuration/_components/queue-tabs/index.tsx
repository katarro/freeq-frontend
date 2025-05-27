'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Monitor, Shuffle, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Queue } from '../queue-card';
import PhysicalQueuesTab from './physical-queues-tab';
import VirtualQueuesTab from './virtual-queues-tab';
import MixedQueuesTab from './mixed-queues-tab';
import GlobalSettingsTab from './global-settings-tab';

type Props = {
  handleEdit: (queue: Queue) => void;
  handleConfigure: (queue: Queue) => void;
  handleDelete: (queue: Queue) => void;
};

const tabItems = [
  { value: 'physical', label: 'Cajas Físicas', icon: Building },
  { value: 'virtual', label: 'Cajas Virtuales', icon: Monitor },
  { value: 'mixed', label: 'Cajas Mixtas', icon: Shuffle },
  { value: 'settings', label: 'Configuración Global', icon: Settings },
];

export default function QueuesTabs({ handleEdit, handleConfigure, handleDelete }: Props) {
  const [activeTab, setActiveTab] = useState('physical');
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
      {isMobile ? (
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger floatingLabel="Seleccionar tipo de caja" className="w-full">
            <SelectValue placeholder="Seleccionar tipo de caja" />
          </SelectTrigger>
          <SelectContent>
            {tabItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <TabsList className="grid w-full grid-cols-4">
          {tabItems.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="flex items-center space-x-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      <PhysicalQueuesTab handleEdit={handleEdit} handleConfigure={handleConfigure} handleDelete={handleDelete} />
      <VirtualQueuesTab handleEdit={handleEdit} handleConfigure={handleConfigure} handleDelete={handleDelete} />
      <MixedQueuesTab handleEdit={handleEdit} handleConfigure={handleConfigure} handleDelete={handleDelete} />
      <GlobalSettingsTab />
    </Tabs>
  );
}

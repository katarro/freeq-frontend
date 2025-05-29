import { notFound } from 'next/navigation';
import sitesData from '@/data/sites.json';
import servicesData from '@/data/services.json';
import Image from 'next/image';
import { cn, currentStatus } from '@/lib/utils';
import { SiteStatus } from '@/components/cards/site-card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import DniDialog from '@/components/dialogs/dni-dialog';

interface Props {
  params: Promise<{
    slug: string;
    service: string;
  }>;
}

export default async function ServicePage({ params }: Props) {
  const { slug: empresaSlug, service: servicioSlug } = await params;

  // Buscar la empresa/sitio
  const site = sitesData.sites.find((site) => site.slug === empresaSlug);

  // Buscar el servicio específico
  const service = servicesData.services.find(
    (service) => service.slug === servicioSlug,
  );

  if (!site || !service) {
    notFound();
  }

  if (!site || !service) {
    notFound();
  }

  const siteStatus =
    SiteStatus[
      site.status.toUpperCase().replace('-', '_') as keyof typeof SiteStatus
    ];

  const serviceStatus =
    SiteStatus[
      service.status.toUpperCase().replace('-', '_') as keyof typeof SiteStatus
    ];

  return (
    <>
      <section className='flex items-center gap-4 p-6 bg-gradient-to-bl from-secondary to-primary'>
        <div className='container flex flex-col items-center gap-2 max-w-4xl mx-auto'>
          <figure className='w-[88px] h-[88px] overflow-hidden rounded-full'>
            <Image
              className='w-full h-full object-cover'
              src={site.image}
              alt={site.title}
              width={88}
              height={88}
            />
          </figure>
          <h1 className='text-2xl text-primary-foreground text-center font-semibold'>
            {service.title}
          </h1>
          <p className='text-primary-foreground text-center text-sm'>
            {site.title}
          </p>
          <p className='text-primary-foreground text-center'>
            {currentStatus(serviceStatus)}
          </p>
        </div>
      </section>

      <section className='px-4 py-5 flex flex-col gap-6 container max-w-[600px] mx-auto'>
        <div className='flex flex-col gap-2.5'>
          <p className='text-primary text-sm'>Dirección</p>
          <p className='text-heading-foreground'>{site.description}</p>
        </div>

        <div className='flex flex-col gap-2.5'>
          <p className='text-primary text-sm'>Servicio</p>
          <p className='text-heading-foreground'>{service.description}</p>
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-6'>
          <figure className='w-[156px] h-[166px]'>
            <Image
              className='w-full h-full object-cover aspect-square rounded-lg'
              src='/images/group-rafiki.avif'
              alt='Personas en cola'
              width={156}
              height={166}
            />
          </figure>
          <div className='grid gap-5 items-center justify-center text-center'>
            <p className='font-semibold text-primary text-4xl'>
              {service.people}
            </p>
            <p>personas hay haciendo cola</p>
            <p
              className={cn(
                'text-sm text-center font-medium',
                service.status === 'high-demand' && 'text-warning',
                service.status === 'available' && 'text-success',
                service.status === 'closed' && 'text-destructive',
              )}
            >
              {service.status === 'high-demand' &&
                `Espera Aprox. ${service.waiting} min`}
              {service.status === 'available' &&
                `Espera Aprox. ${service.waiting} min`}
              {service.status === 'closed' && 'Cerrado'}
            </p>
          </div>
        </div>

        {/* Barra de progreso basada en ocupación */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm text-muted-foreground'>
            <span>Ocupación actual</span>
            <span>
              {Math.min(Math.round((service.people / 20) * 100), 100)}%
            </span>
          </div>
          <Progress
            className='w-full'
            value={Math.min(Math.round((service.people / 20) * 100), 100)}
          />
        </div>

        {/* Información adicional del servicio */}
        <div className='bg-muted/50 rounded-lg p-4 space-y-3'>
          <h3 className='font-medium text-heading-foreground'>
            Información del servicio
          </h3>
          <div className='grid gap-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                Tiempo estimado por persona:
              </span>
              <span>3-5 min</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                Horario de atención:
              </span>
              <span>08:00 - 17:00</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Estado actual:</span>
              <span
                className={cn(
                  'font-medium',
                  service.status === 'available' && 'text-success',
                  service.status === 'high-demand' && 'text-warning',
                  service.status === 'closed' && 'text-destructive',
                )}
              >
                {service.status === 'available' && 'Disponible'}
                {service.status === 'high-demand' && 'Alta demanda'}
                {service.status === 'closed' && 'Cerrado'}
              </span>
            </div>
          </div>
        </div>

        <DniDialog />
      </section>
    </>
  );
}

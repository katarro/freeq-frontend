import { notFound } from 'next/navigation';
import sitesData from '@/data/sites.json';
import servicesData from '@/data/services.json';
import Image from 'next/image';
import Link from 'next/link';
import { cn, currentStatus } from '@/lib/utils';
import { SiteStatus } from '@/components/cards/site-card';
import { Separator } from '@/components/ui/separator';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServicesPage({ params }: Props) {
  const { slug } = await params;

  const site = sitesData.sites.find((site) => site.slug === slug);

  if (!site) {
    notFound();
  }

  const siteStatus =
    SiteStatus[
      site.status.toUpperCase().replace('-', '_') as keyof typeof SiteStatus
    ];

  // Función para obtener el badge de estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success'>
            Disponible
          </span>
        );
      case 'high-demand':
        return (
          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning'>
            Alta demanda
          </span>
        );
      case 'closed':
        return (
          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive'>
            Cerrado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header Section con gradiente */}
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
            {site.title}
          </h1>
          <p className='text-primary-foreground text-center'>
            {currentStatus(siteStatus)}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className='px-4 py-5 flex flex-col gap-6 container max-w-[600px] mx-auto'>
        {/* Dirección */}
        <div className='flex flex-col gap-2.5'>
          <p className='text-primary text-sm font-medium'>Dirección</p>
          <p className='text-heading-foreground'>{site.direction}</p>
        </div>

        <Separator />

        {/* Servicios disponibles */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-heading-foreground'>
            Servicios disponibles
          </h2>

          <div className='grid gap-4'>
            {servicesData.services.map((service) => (
              <Link
                key={service.id}
                href={`/user/services/${slug}/${service.slug}`}
                className={cn(
                  'block border border-border rounded-lg p-4 hover:shadow-md transition-shadow',
                  service.status === 'closed' &&
                    'opacity-60 pointer-events-none',
                )}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <h3 className='font-medium text-heading-foreground mb-1'>
                      {service.title}
                    </h3>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                          />
                        </svg>
                        {service.people} personas
                      </span>
                      <span className='flex items-center gap-1'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                        {service.status === 'closed'
                          ? 'No disponible'
                          : `~${service.waiting} min`}
                      </span>
                    </div>
                  </div>
                  <div className='text-right'>
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Separator />
      </section>
    </>
  );
}

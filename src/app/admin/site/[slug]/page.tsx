import { notFound } from 'next/navigation';
import sitesData from '@/data/sites.json';
import Image from 'next/image';
import { cn, currentStatus } from '@/lib/utils';
import { SiteStatus } from '@/components/cards/site-card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import DniDialog from '@/components/dialogs/dni-dialog';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;

  const site = sitesData.sites.find((site) => site.slug === slug);

  if (!site) {
    notFound();
  }

  const siteStatus =
    SiteStatus[
      site.status.toUpperCase().replace('-', '_') as keyof typeof SiteStatus
    ];

  return (
    <>
      <section className='flex items-center gap-4 p-6 bg-linear-to-bl from-secondary to-primary'>
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

      <section className='px-4 py-5 flex flex-col gap-6 container max-w-[600px] mx-auto'>
        <div className='flex flex-col gap-2.5'>
          <p className='text-primary text-sm'>Dirección</p>
          <p className='text-heading-foreground'>{site.description}</p>
        </div>
        <Separator />
        <div className='grid grid-cols-2 gap-6'>
          <figure className='w-[156px] h-[166px]'>
            <Image
              className='w-full h-full object-cover aspect-square'
              src='/images/group-rafiki.avif'
              alt='Grupo rafiki'
              width={156}
              height={166}
            />
          </figure>
          <div className='grid gap-5 items-center justify-center text-center'>
            <p className='font-semibold text-primary text-4xl'>14</p>
            <p>personas hay haciendo cola</p>
            <p
              className={cn(
                'text-sm text-center font-medium',
                site.status === 'high-demand' && 'text-warning',
                site.status === 'available' && 'text-success',
                site.status === 'closed' && 'text-gray',
              )}
            >
              {site.status === 'high-demand' &&
                `Espera Aprox. ${site.waiting} min`}
              {site.status === 'available' &&
                `Espera Aprox. ${site.waiting} min`}
              {site.status === 'closed' && 'Cerrado'}
            </p>
          </div>
        </div>
        <Progress className='w-full' value={70} />
        <DniDialog />
      </section>
    </>
  );
}

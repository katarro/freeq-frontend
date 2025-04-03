import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export enum SiteStatus {
  HIGH_DEMAND = 'high-demand',
  AVAILABLE = 'available',
  CLOSED = 'closed',
}

type Props = Readonly<{
  isLiked?: boolean;
  status?: SiteStatus;
  waiting?: number;
  title?: string;
  siteImage?: StaticImageData;
  description?: string;
  slug?: string;
}>;

export default function SiteCard({
  isLiked: initialIsLiked = false,
  status = SiteStatus.AVAILABLE,
  waiting = 0,
  title,
  siteImage,
  description,
  slug,
}: Props) {
  const [isLiked, setIsLiked] = React.useState(initialIsLiked);

  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]');
    setIsLiked(favorites.includes(slug));
  }, [slug]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Detiene la propagación pero no previene la navegación

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    const favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]');
    const newFavorites = newIsLiked
      ? [...favorites, slug]
      : favorites.filter((fav: string) => fav !== slug);

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className='relative'>
      {' '}
      {/* Contenedor relativo para posicionar el Link */}
      <Link
        href={`/admin/site/${slug ?? ''}`}
        className='absolute inset-0 z-10'
      />
      <Card className='gap-0 grid grid-rows-[auto_72px_44px] hover:shadow-md transition-shadow relative'>
        <CardHeader className='grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-0 pt-3'>
          <figure className='w-10 h-10 overflow-hidden rounded-full'>
            <Image
              className='w-full h-full object-cover'
              quality={100}
              src={
                siteImage?.src ??
                '/images/sites/registro-civil-e-identificacion.avif'
              }
              alt={title ?? ''}
              width={40}
              height={40}
            />
          </figure>
          <p className='font-bold text-lg line-clamp-1'>{title ?? ''}</p>

          <Button
            variant='ghost'
            size='icon'
            className='p-0 rounded-sm shadow-none w-6 h-6 !gap-0 z-20' // z-20 para estar sobre el Link
            onClick={toggleFavorite}
          >
            <svg
              className={cn(
                '!w-6 !h-6 fill-transparent',
                isLiked && 'fill-primary',
              )}
              width='23'
              height='21'
              viewBox='0 0 23 21'
              fill='inherit'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10.5039 18.7483L10.5024 18.747C7.521 16.0565 5.12777 13.8945 3.46785 11.8749C1.81927 9.86915 1 8.12714 1 6.29428C1 3.32635 3.33069 1 6.325 1C8.02503 1 9.67093 1.79242 10.7402 3.04199L11.5 3.92989L12.2598 3.04199C13.3291 1.79242 14.975 1 16.675 1C19.6693 1 22 3.32635 22 6.29428C22 8.12716 21.1807 9.86921 19.5319 11.8766C17.872 13.8976 15.4789 16.0623 12.4977 18.7583C12.4974 18.7586 12.4971 18.7588 12.4968 18.7591L11.5025 19.653L10.5039 18.7483Z'
                fill='inherit'
                stroke='#0194AD'
                strokeWidth='2'
              />
            </svg>
          </Button>
        </CardHeader>
        <CardContent className='py-3'>
          <p className='line-clamp-2'>{description ?? ''}</p>
        </CardContent>
        <CardFooter className='justify-center border-t border-t-border !py-3'>
          <p
            className={cn(
              'text-sm text-center font-medium',
              status === 'high-demand' && 'text-warning',
              status === 'available' && 'text-success',
              status === 'closed' && 'text-gray',
            )}
          >
            {status === 'high-demand' &&
              `Alta demanda | Espera Aprox. ${waiting} min`}
            {status === 'available' &&
              `Disponible | Espera Aprox. ${waiting} min`}
            {status === 'closed' && 'Cerrado'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

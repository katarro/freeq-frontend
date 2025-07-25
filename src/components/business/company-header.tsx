import Image from 'next/image';
import { Company } from '@/types/company';
import { cn } from '@/lib/utils';

interface CompanyHeaderProps {
  readonly company: Company;
  readonly status: string;
}

export function CompanyHeader({ company, status }: CompanyHeaderProps) {
  const apiImage = `https://ui-avatars.com/api/?name=${company.name}&background=0D8ABC&color=ffffff`;

  return (
    <section className="p-6 bg-gradient-to-bl from-secondary to-primary">
      <div className="container max-w-4xl mx-auto">
        {/* Logo, nombre y estado */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <figure className="w-[88px] h-[88px] overflow-hidden rounded-full">
            <Image
              className="w-full h-full object-contain"
              src={company.logo ? company.logo : apiImage}
              alt={company.name}
              width={88}
              height={88}
            />
          </figure>
          <h1 className="text-2xl text-primary-foreground text-center font-semibold">
            {company.name}
          </h1>
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2',
              status === 'Disponible' && 'bg-white/95 text-green-700 border-green-200',
              status === 'Alta demanda' && 'bg-white/95 text-orange-700 border-orange-200',
              status === 'Cerrado' && 'bg-white/95 text-red-700 border-red-200',
            )}
          >
            {status}
          </span>
        </div>

        {/* Información de la empresa en cards horizontales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Dirección */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-primary-foreground mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Dirección</p>
                <p className="text-primary-foreground text-sm">{company.address}</p>
              </div>
            </div>
          </div>

          {/* Teléfono */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-primary-foreground mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Teléfono</p>
                <p className="text-primary-foreground text-sm">{company.phone}</p>
              </div>
            </div>
          </div>

          {/* Email */}
          {/* <div className='bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4'>
            <div className='flex items-start gap-3'>
              <svg
                className='w-5 h-5 text-primary-foreground mt-0.5 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <div>
                <p className='text-primary-foreground/80 text-sm font-medium'>
                  Email
                </p>
                <p className='text-primary-foreground text-sm'>
                  {company.email}
                </p>
              </div>
            </div>
          </div> */}

          {/* Sitio web (si existe) */}
          {company.website && (
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary-foreground mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Sitio web</p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground text-sm underline hover:opacity-80 transition-opacity"
                  >
                    Visitar sitio
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Descripción (si existe) */}
        {company.description && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-primary-foreground/80 text-sm font-medium mb-2">Descripción</p>
              <p className="text-primary-foreground text-sm leading-relaxed">
                {company.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

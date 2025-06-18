'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { type NavigationGroup } from '@/lib/navigation-data';
import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { FilterType, useHomePage } from '@/hooks/use-home-page';
import { ModeToggle } from '@/components/actions/mode-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  navigationData?: NavigationGroup[];
};

function SidebarComponent({ navigationData = [] }: Props) {
  const { toggleSidebar } = useSidebar();
  const { updateFilter } = useHomePage();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Función para verificar si un link está activo (versión simplificada)
  const isLinkActive = (itemUrl: string) => {
    // Para cualquier ruta, verificar coincidencia exacta con URL completa
    const currentUrl =
      pathName + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    // También verificar si es la misma ruta base sin query params
    if (itemUrl === pathName && !itemUrl.includes('?')) {
      return !searchParams.toString(); // Solo si no hay query params
    }

    return itemUrl === currentUrl;
  };

  // Función para manejar clicks en filtros
  const handleFilterClick = (itemUrl: string, itemTitle: string) => {
    if (itemUrl.includes('/user/home')) {
      if (itemUrl.includes('?filter=')) {
        const [, queryString] = itemUrl.split('?');
        const urlParams = new URLSearchParams(queryString);
        const filterValue = urlParams.get('filter');

        if (filterValue) {
          updateFilter(filterValue as FilterType);
        }
      } else {
        // "Mostrar todas" - sin filtro
        updateFilter('all');
      }

      // Navegar a la página home si no estamos ahí
      if (pathName !== '/user/home') {
        router.push('/user/home');
      }

      // Cerrar sidebar en móvil
      if (window.innerWidth < 1024) {
        toggleSidebar();
      }

      return true; // Indica que manejamos el click
    }

    return false; // No manejamos el click, usar navegación normal
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className='px-9 py-10'>
        <div className='flex items-center justify-between mb-4'>
          <Button
            aria-label='Cerrar navegación'
            variant='ghost'
            onClick={toggleSidebar}
            className='!w-fit !h-fit !px-0 shadow-none hover:bg-transparent lg:sr-only'
          >
            <svg
              className='!w-7 !h-7 fill-sidebar-primary-foreground'
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M28 2.82L25.18 0L14 11.18L2.82 0L0 2.82L11.18 14L0 25.18L2.82 28L14 16.82L25.18 28L28 25.18L16.82 14L28 2.82Z'
                fill='currentColor'
              />
            </svg>
          </Button>

          {/* ModeToggle en el header */}
          <div className='lg:hidden'>
            <ModeToggle />
          </div>
        </div>

        <Link href='/' className='mx-auto hidden lg:flex'>
          <Image
            src='/images/logo-white.avif'
            alt='Logo'
            width={120}
            height={120}
          />
        </Link>

        {/* ModeToggle para desktop */}
        {/* <div className='hidden lg:flex justify-center mt-4'>
          <ModeToggle />
        </div> */}
      </SidebarHeader>
      <SidebarContent className='px-9 relative gap-11 pb-10'>
        <div className='flex flex-col gap-6'>
          {navigationData &&
            navigationData.map((group, index) => (
              <div
                key={`${group.title}-${index}`}
                className='flex flex-col gap-6'
              >
                <SidebarGroup className='p-0'>
                  <SidebarGroupLabel className='mb-1'>
                    {group.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const isActive = isLinkActive(item.url);

                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <Link
                                href={item.url}
                                onClick={(e) => {
                                  // Manejar filtros especiales
                                  const handled = handleFilterClick(
                                    item.url,
                                    item.title,
                                  );

                                  // Si no manejamos el click como filtro, usar navegación normal
                                  if (!handled) {
                                    // Para enlaces externos (WhatsApp)
                                    if (item.url.startsWith('http')) {
                                      e.preventDefault();
                                      window.open(item.url, '_blank');
                                    }

                                    // Cerrar sidebar en móvil para navegación normal
                                    if (window.innerWidth < 1024) {
                                      toggleSidebar();
                                    }
                                  } else {
                                    // Prevenimos la navegación por defecto si manejamos el filtro
                                    e.preventDefault();
                                  }
                                }}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                                  isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : 'hover:bg-sidebar-accent/50',
                                )}
                              >
                                {item?.icon && (
                                  <item.icon className='w-5 h-5' />
                                )}

                                <span
                                  className='text-sm font-medium'
                                  onClick={() => {
                                    if (item.title === 'Cerrar sesión') {
                                      handleLogout();
                                    }
                                  }}
                                >
                                  {item.title}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                {index < navigationData.length - 1 && (
                  <SidebarSeparator className='w-full mx-0' />
                )}
              </div>
            ))}
        </div>
      </SidebarContent>
      <svg
        className='absolute right-0 top-0 -z-[1]'
        width='276'
        height='215'
        viewBox='0 0 276 215'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g opacity='0.1'>
          <path
            d='M482.205 0.0161278H-17C16.1104 6.22534 45.7373 12.6281 73.1062 19.7566H702.35L708.107 1.64504L708.607 0H482.205V0.0161278Z'
            fill='white'
          />
          <path
            d='M137.682 39.5132C154.391 45.4644 170.486 51.98 186.437 59.2537H689.851L696.108 39.5132H137.682Z'
            fill='white'
          />
          <path
            d='M682.819 78.9779H464.238H395.179H225.998C237.304 85.0903 248.674 91.6382 260.254 98.7345H388.889L382.599 118.491H290.219C299.622 124.684 309.185 131.297 319.023 138.232H376.309L373.745 146.279C371.31 154.069 370.326 161.988 370.81 170.116C371.229 178.212 373.165 185.551 376.503 192.147C379.858 198.743 384.631 204.194 390.808 208.549C397.018 212.855 404.807 215 414.258 215H448.498L477.447 109.814H671.465L682.835 78.9779H682.819Z'
            fill='white'
          />
        </g>
      </svg>
    </Sidebar>
  );
}

export default function FreeqSidebar({ navigationData = [] }: Props) {
  return (
    <Suspense fallback={<div className='w-full h-full' />}>
      <SidebarComponent navigationData={navigationData} />
    </Suspense>
  );
}

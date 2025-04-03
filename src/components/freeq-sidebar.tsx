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
import { navigationGroups } from '@/lib/navigation-data';
import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useHomePage } from '@/hooks/use-home-page';
import { cn } from '@/lib/utils';

export default function FreeqSidebar() {
  const { toggleSidebar } = useSidebar();

  const { updateFilter } = useHomePage(); // Usamos el hook aquí
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') ?? 'all';

  // // Función para manejar el filtro desde el sidebar
  // const handleFilterClick = (filter: 'all' | 'open' | 'closed') => {
  //   const params = new URLSearchParams(searchParams);

  //   if (filter === 'all') {
  //     params.delete('filter');
  //   } else {
  //     params.set('filter', filter);
  //   }

  //   // Actualiza tanto la URL como el estado del filtro
  //   router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  //   setFilterStatus(filter);
  // };

  return (
    <Sidebar>
      <SidebarHeader className='px-9 py-10'>
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
        <Link href='/' className='mx-auto hidden lg:flex'>
          <Image
            src='/images/logo-white.avif'
            alt='Logo'
            width={120}
            height={120}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className='px-9 relative gap-11 pb-10'>
        <div className='flex flex-col gap-6'>
          {navigationGroups.map((group, index) => (
            <div key={group.title} className='flex flex-col gap-6'>
              <SidebarGroup className='p-0'>
                <SidebarGroupLabel className='mb-1'>
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          {item.title === 'Sitios favoritos' ? (
                            <button
                              onClick={() => updateFilter('favorites')}
                              className={cn(
                                'w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg',
                                currentFilter === 'favorites' && 'bg-accent/50',
                              )}
                              aria-current={
                                currentFilter === 'favorites' ? 'true' : 'false'
                              }
                            >
                              {item?.icon && <item.icon className='w-5 h-5' />}
                              <span className='text-sm font-medium'>
                                {item.title}
                              </span>
                            </button>
                          ) : item.title === 'Sucursales abiertas' ? (
                            <button
                              onClick={() => updateFilter('open')}
                              className={cn(
                                'w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg',
                                currentFilter === 'open' && 'bg-accent/50',
                              )}
                              aria-current={
                                currentFilter === 'open' ? 'true' : 'false'
                              }
                            >
                              {item?.icon && <item.icon className='w-5 h-5' />}
                              <span className='text-sm font-medium'>
                                {item.title}
                              </span>
                            </button>
                          ) : item.title === 'Mostrar todas' ? (
                            <button
                              onClick={() => updateFilter('all')}
                              className={cn(
                                'w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg',
                                currentFilter === 'all' && 'bg-accent/50',
                              )}
                              aria-current={
                                currentFilter === 'all' ? 'true' : 'false'
                              }
                            >
                              {item?.icon && <item.icon className='w-5 h-5' />}
                              <span className='text-sm font-medium'>
                                {item.title}
                              </span>
                            </button>
                          ) : (
                            <Link
                              href={item.url}
                              className='flex items-center gap-3 px-4 py-2 rounded-lg'
                            >
                              {item?.icon && <item.icon className='w-5 h-5' />}
                              <span className='text-sm font-medium'>
                                {item.title}
                              </span>
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {index < navigationGroups.length - 1 && (
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

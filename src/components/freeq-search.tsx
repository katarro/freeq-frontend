import { cn } from '@/lib/utils';

type FreeqSearchProps = Readonly<{
  onSearchChange: (value: string) => void;
  onToggleFilter: () => void;
  filterActive: boolean;
}>;

export default function FreeqSearch({
  onSearchChange,
  onToggleFilter,
  filterActive,
}: FreeqSearchProps) {
  return (
    <div className='relative'>
      {/* Icono de búsqueda (lupa) */}
      <svg
        className='absolute top-1/2 w-5 h-5 -translate-y-1/2 left-3'
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M9.58333 2.29166C5.55625 2.29166 2.29166 5.55625 2.29166 9.58332C2.29166 13.6104 5.55625 16.875 9.58333 16.875C13.6104 16.875 16.875 13.6104 16.875 9.58332C16.875 5.55625 13.6104 2.29166 9.58333 2.29166ZM1.04166 9.58332C1.04166 4.86589 4.8659 1.04166 9.58333 1.04166C14.3008 1.04166 18.125 4.86589 18.125 9.58332C18.125 11.7171 17.3426 13.6681 16.0491 15.1652L18.7753 17.8914C19.0194 18.1355 19.0194 18.5312 18.7753 18.7753C18.5312 19.0193 18.1355 19.0193 17.8914 18.7753L15.1652 16.049C13.6681 17.3426 11.7171 18.125 9.58333 18.125C4.8659 18.125 1.04166 14.3008 1.04166 9.58332Z'
          stroke='#0194AD'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>

      {/* Input de búsqueda */}
      <input
        placeholder='Buscar sitio'
        type='search'
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(
          'flex h-12 w-full py-3 pl-11 pr-14 shadow-md border border-border leading-[24px] rounded-md bg-card text-base text-heading-foreground ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-primary placeholder:leading-[24px] placeholder:text-base',
        )}
      />

      {/* Botón de filtro integrado */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFilter();
        }}
        className={cn(
          'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          filterActive ? 'text-primary' : 'text-muted-foreground',
        )}
        aria-label='Filtrar por estado'
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M4 6H20M8 12H16M11 18H13'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
          {filterActive && (
            <circle
              cx='19'
              cy='5'
              r='3'
              fill='#0194AD'
              stroke='white'
              strokeWidth='2'
            />
          )}
        </svg>
      </button>
    </div>
  );
}

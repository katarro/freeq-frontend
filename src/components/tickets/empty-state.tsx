export function EmptyState({ isHistory }: { readonly isHistory: boolean }) {
  return (
    <div className='text-center py-12'>
      <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
        {isHistory ? (
          <svg
            className='w-8 h-8 text-muted-foreground'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        ) : (
          <svg
            className='w-8 h-8 text-muted-foreground'
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
        )}
      </div>
      <h3 className='text-lg font-medium text-foreground mb-2'>
        {isHistory ? 'Sin historial' : 'No tienes turnos activos'}
      </h3>
      <p className='text-muted-foreground'>
        {isHistory
          ? 'Tus turnos completados aparecerán aquí'
          : 'Cuando solicites un turno, aparecerá aquí'}
      </p>
    </div>
  );
}

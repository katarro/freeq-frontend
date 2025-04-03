import { ModeToggle } from '@/components/actions/mode-toggle';

export default function ProfilePage() {
  return (
    <div className='px-4 py-8'>
      <section className='flex flex-col'>
        <h1 className='text-2xl lg:text-3xl font-semibold text-center text-heading-foreground'>
          Tu perfil
        </h1>
        <ModeToggle />
      </section>
    </div>
  );
}

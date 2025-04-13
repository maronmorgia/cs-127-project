import Container from './Container';

export default function FeaturesSection() {
  return (
    <section className='bg-primary-900'>
      <Container>
        <header className=' h-[944px] flex flex-col justify-center items-center gap-14 md:h-[848px] '>
          <h1
            id='features-heading'
            className='self-stretch text-center leading-[48px]'
          >
            FEATURES
          </h1>
          <div className='flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-10 self-stretch'>
            {/* Feature: Quick */}
            <article className='inline-flex w-80 flex-col items-center justify-center gap-3'>
              <figure className='relative size-28 overflow-hidden'>
                <img src='/check-circle.svg' alt='Quick icon' />
                <figcaption className='sr-only'>Quick</figcaption>
              </figure>
              <h2 className='self-stretch text-center leading-9 tracking-tight'>
                Quick
              </h2>
              <p className='self-stretch text-center leading-7'>
                Find room schedules in seconds.
              </p>
            </article>
            {/* Feature: Reliable */}
            <article className='inline-flex w-80 flex-col items-center justify-center gap-3'>
              <figure className='relative size-28 overflow-hidden'>
                <img src='/calendar-check.svg' alt='Reliable icon' />
                <figcaption className='sr-only'>Reliable</figcaption>
              </figure>
              <h2 className='self-stretch text-center leading-9 tracking-tight'>
                Reliable
              </h2>
              <p className='self-stretch text-center leading-7'>
                Based on the official school year’s schedule.
              </p>
            </article>
            {/* Feature: Secure */}
            <article className='inline-flex w-80 flex-col items-center justify-center gap-3'>
              <figure className='relative size-28 overflow-hidden'>
                <img src='/shield-check.svg' alt='Secure icon' />
                <figcaption className='sr-only'>Secure</figcaption>
              </figure>
              <h2 className='self-stretch text-center leading-9 tracking-tight'>
                Secure
              </h2>
              <p className='self-stretch text-center leading-7'>
                Exclusive to UP email owners.
              </p>
            </article>
          </div>
          <div className='bg-secondary-900 inline-flex items-center justify-center gap-2.5 self-stretch rounded-md px-4 py-2'>
            <p className='large leading-7 text-neutral-50'>
              Log in with your UP email
            </p>
          </div>
        </header>
      </Container>
    </section>
  );
}

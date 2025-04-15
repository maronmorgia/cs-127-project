import Container from './Container';

export default function FeaturesSection() {
  return (
    <section className='bg-primary-900'>
      <Container>
        <header className='flex flex-col items-center justify-center gap-14'>
          <h1
            id='features-heading'
            className='self-stretch text-center leading-[48px]'
          >
            FEATURES
          </h1>
          <div className='flex flex-col items-center justify-center gap-10 self-stretch md:flex-row md:flex-wrap'>
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
        </header>
      </Container>
    </section>
  );
}

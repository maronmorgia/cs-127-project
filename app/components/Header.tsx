import Navbar from './Navbar';
import Container from './Container';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <Navbar />
      <Container>
        <section className='flex w-full flex-col gap-10 lg:flex-row lg:justify-between lg:gap-15'>
          {/* LEFT SECTION */}
          <div className='flex w-full flex-col justify-center gap-5 lg:w-1/2 lg:items-start'>
            <h1
              id='hero-heading'
              className='displayS self-stretch text-left text-[44px] leading-[52px] md:leading-[60px]'
            >
              VIEW ROOM SCHEDULES WITH EASE
            </h1>
            <p>Providing you a digitalized tool</p>
            <Link href={''}>
              <button className='bg-primary-900 hover:bg-primary-700 lead group flex w-[269px] cursor-pointer items-center justify-center gap-3 rounded-md px-[43px] py-[8px] transition-all duration-300 hover:w-[280px] hover:px-[50px]'>
                Get Started
                <img
                  src='/arrow-right.svg'
                  alt='Arrow icon'
                  className='transition-transform duration-300 group-hover:scale-x-125'
                />
              </button>
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className='flex w-full items-center justify-end lg:w-1/2'>
            <div className='bg-4color-gradient flex h-[515px] w-full items-center justify-center rounded-xl p-[2px]'>
              <div className='h-[510px] w-full rounded-xl bg-neutral-800'></div>
            </div>
          </div>
        </section>
      </Container>
    </header>
  );
}

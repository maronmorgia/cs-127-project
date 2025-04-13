import Navbar from './Navbar';
import Container from './Container';

export default function Header() {
  return (
    <header>
      <Navbar />
      <Container>
      <section className='w-full flex flex-col gap-10 lg:flex-row md:h-[971px] lg:gap-15 lg:justify-between lg:h-[712px]'>
        {/* LEFT SECTION */}
        <div className='flex flex-col gap-5 w-full justify-center lg:w-1/2 lg:items-start'>
          <h1
            id='hero-heading'
            className='displayS text-[44px] text-left leading-[52px] md:h-[120px] md:leading-[60px]'
          >
            VIEW ROOM SCHEDULES WITH EASE
          </h1>
          <p>Providing you a digitalized tool</p>
          <button className='bg-primary-900 hover:bg-primary-700 lead flex w-[269px] gap-3 rounded-md px-[43px] py-[8px] items-center'>
            Get Started
            <img src='/arrow-right.svg' alt='Arrow icon'/>
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex justify-end items-center w-full lg:w-1/2">
          <div className="p-[2px] flex justify-center items-center w-full min-w-[310px] h-[515px] bg-4color-gradient rounded-xl">
            <div className="bg-neutral-800 w-full h-[510px] rounded-xl">
            </div>
          </div>
        </div>
      </section>
      </Container>
    </header>
  );
}

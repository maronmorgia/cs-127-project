import Navbar from './Navbar';
import Container from './Container';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { RoomCard } from './RoomCard';
import { useState, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';

const roomData = [
  {
    day: 'MONDAY',
    room: 'RM 227',
    time: '1:30-2:30 PM',
    gradient: 'bg-gradient-to-b from-[#294936] via-[#3c755a] to-[#6cb398]',
  },
  {
    day: 'TUESDAY',
    room: 'RM 223',
    time: '7:30-10:30AM',
    gradient: 'bg-gradient-to-b from-[#cc5f00] via-[#d67506] to-[#e7af4e]',
  },
  {
    day: 'FRIDAY',
    room: 'RM 115',
    time: '1:30-2:30 PM',
    gradient: 'bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500',
  },
];

export default function Header() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

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
            <div className='bg-4color-gradient flex h-[515px] w-full items-center justify-center rounded-xl p-1'>
              <div className='flex h-[510px] w-full items-center justify-center rounded-xl bg-neutral-800'>
                <Carousel
                  className='w-full max-w-5xl'
                  opts={{
                    align: 'center',
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                  setApi={setApi}
                >
                  <CarouselContent className='-ml-4'>
                    {roomData.map((room, idx) => (
                      <CarouselItem key={idx} className='flex-shrink-0 pl-4'>
                        <div className='flex h-[480px] items-center justify-center'>
                          <RoomCard {...room} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Dots */}
                  <div className='mt-4 flex justify-center gap-2 pb-5'>
                    {roomData.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => api?.scrollTo(idx)}
                        className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                          activeIndex === idx ? 'bg-secondary-900' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </header>
  );
}

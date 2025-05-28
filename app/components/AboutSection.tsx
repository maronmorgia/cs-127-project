'use client';
import Container from './Container';

export default function AboutTakda() {
  return (
    <section
      aria-labelledby='about-takda'
      className='h-383px bg-[url(/bg_s2.png)] bg-fixed'
    >
      <Container>
        <article className='flex flex-col items-center justify-center gap-16 md:flex-row'>
          <div className='w-full min-w-[300px] flex-1 md:w-1/2 lg:w-[600px]'>
            <h2
              id='about-takda'
              className='displayS text-center text-[44px] leading-[52px] md:text-left md:!text-[44px]'
            >
              WHAT IS TAKDA?
            </h2>
            <p className='mt-4 text-justify leading-7 lg:mt-10'>
              Designed for students, faculty, and staff of the University of the
              Philippines Mindanao to easily view assigned schedules of rooms
              and facilities in the College of Science and Mathematics.
            </p>
          </div>

          {/* Screenshot Placeholder */}
          <figure className='h-[264px] w-full rounded-[9px] bg-neutral-50 shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)] md:w-1/2'>
            <img src='/CalendarPIC.png' />
          </figure>
        </article>
      </Container>
    </section>
  );
}

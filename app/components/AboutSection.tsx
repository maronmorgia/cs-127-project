"use client";
import Container from "./Container";

export default function AboutTakda() {
  return (
    <section aria-labelledby="about-takda" className="bg-[url(/bg_s2.png)] bg-fixed h-383px">
      <Container>
        <article className="flex flex-col justify-center items-center gap-16 md:flex-row">
          <div className="w-full md:w-1/2 lg:w-[600px] min-w-[300px] flex-1">
            <h2
              id="about-takda"
              className="displayS text-[44px] leading-[52px] text-center md:text-left md:!text-[44px]"
            >
              WHAT IS TAKDA?
            </h2>
            <p className="mt-4 leading-7 text-justify lg:mt-10">
              Designed for students, faculty, and staff of the University of the Philippines
              Mindanao to easily view assigned schedules of rooms and facilities in the College
              of Science and Mathematics.
            </p>
          </div>

          {/* Screenshot Placeholder */}
          <figure className="w-full h-[264px] opacity-10 bg-neutral-50 rounded-[9px] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)] md:w-1/2"></figure>
        </article>
      </Container>
    </section>
  );
}

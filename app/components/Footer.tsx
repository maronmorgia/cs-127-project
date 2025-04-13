import Container from './Container';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className='bg-neutral-800'>
      <Container className='!pb-[20px]'>
        <div className='flex flex-col items-center gap-20'>
          {/* Logo Section */}
          <Logo />
          <div className='flex items-center'>
            {/* Link Groups */}
            <div className='flex w-full flex-wrap justify-center gap-[60px] md:gap-[120px] lg:gap-[169px]'>
              {/* Quick Links */}
              <div className='flex flex-col gap-2'>
                <h3 className='subtle'>Quick Links</h3>
                <hr className='w-16 border border-white' />
                <ul className='mt-2 space-y-2'>
                  <li>
                    <a href='#' className='small text-neutral-50'>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href='#' className='small text-neutral-50'>
                      Log in
                    </a>
                  </li>
                </ul>
              </div>
              {/* About Us */}
              <div className='flex flex-col gap-2'>
                <h3 className='subtle'>About Us</h3>
                <hr className='w-14 border border-white' />
                <ul className='mt-2 w-[74px] space-y-2'>
                  <li>
                    <a href='#' className='small text-neutral-50'>
                      Meet the Developers
                    </a>
                  </li>
                  <li>
                    <a href='#' className='small text-neutral-50'>
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              {/* Related Links */}
              <div className='flex flex-col gap-2'>
                <h3 className='subtle'>Related Links</h3>
                <hr className='w-20 border border-white' />
                <ul className='mt-2 space-y-2'>
                  <li>
                    <a href='#' className='small text-neutral-50'>
                      UP Mindanao
                    </a>
                  </li>
                  <li>
                    <a href='#' className='small text-neutral-50'>
                      CSM
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Copyright */}
          <div className='inline-flex items-center justify-center gap-7'>
            <p className='subtle'>© 2025 Takda. All Rights Reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

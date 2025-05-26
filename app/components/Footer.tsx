import Container from './Container';
import Logo from './Logo';
import Link from 'next/link';

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
                    <Link
                      href='#'
                      className='small inline-block text-neutral-50 transition-all duration-300 ease-in-out hover:scale-115 hover:text-white'
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/login'
                      className='small inline-block text-neutral-50 transition-all duration-300 ease-in-out hover:scale-115 hover:text-white'
                    >
                      Log in
                    </Link>
                  </li>
                </ul>
              </div>
              {/* About Us */}
              <div className='flex flex-col gap-2'>
                <h3 className='subtle'>About Us</h3>
                <hr className='w-14 border border-white' />
                <ul className='mt-2 w-[74px] space-y-2'>
                  <li>
                    <Link
                      href='#'
                      className='small inline-block text-neutral-50 transition-all duration-300 ease-in-out hover:scale-115 hover:text-white'
                    >
                      Meet the Developers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='small inline-block text-neutral-50 transition-all duration-300 ease-in-out hover:scale-115 hover:text-white'
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Related Links */}
              <div className='flex flex-col gap-2'>
                <h3 className='subtle'>Related Links</h3>
                <hr className='w-20 border border-white' />
                <ul className='mt-2 space-y-2'>
                  <li>
                    <Link
                      href='https://www.upmin.edu.ph/'
                      className='small inline-block text-neutral-50 transition-all duration-300 ease-in-out hover:scale-115 hover:text-white'
                    >
                      UP Mindanao
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='https://www.facebook.com/csmupmin/?locale=tl_PH'
                      className='small inline-block text-neutral-50 transition-all duration-300 ease-in-out hover:scale-115 hover:text-white'
                    >
                      CSM
                    </Link>
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

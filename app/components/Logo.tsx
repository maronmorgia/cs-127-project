import Image from 'next/image';

type LogoProps = {
  variant?: 'icon' | 'full';
};

const Logo = ({ variant = 'full' }: LogoProps) => {
  return (
    <div className='flex items-center gap-2'>
      <Image
        src='/Takda_Logo.png'
        alt='Takda Logo'
        width={42}
        height={42}
        className='object-contain'
      />
      {variant === 'full' && <h3 className='leading-7'>TAKDA</h3>}
    </div>
  );
};

export default Logo;

import Image from 'next/image';

const Logo = () => {
  return (
    <div className='flex items-center gap-2'>
      <Image
        src='/Takda_Logo.png'
        alt='Takda Logo'
        width={44}
        height={44}
        className='object-contain'
      />
      <h3 className='leading-7'>TAKDA</h3>
    </div>
  );
};

export default Logo;

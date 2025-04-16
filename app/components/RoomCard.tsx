import Image from 'next/image';

interface RoomCardProps {
  day: string;
  room: string;
  time: string;
  gradient: string;
}
export const RoomCard = ({ day, room, time, gradient }: RoomCardProps) => (
  <section
    className={`relative w-[272px] rounded-[25px] p-[30px] ${gradient} flex flex-col items-center shadow-lg`}
  >
    <h2 className='w-full text-center'>{day}</h2>
    <hr className='absolute top-[72px] right-0 left-0 border-t border-white' />
    <div className='flex flex-col items-center gap-[36px] text-center'>
      <h3 className='displayS mt-[20px]'>{room}</h3>
      <div className='flex flex-col items-center gap-[40px]'>
        <figure className='relative h-14 w-14'>
          <Image src='/calendar-check-2.svg' alt={`${day} icon`} fill />
        </figure>
        <h3 className='h3'>
          <time
            className='inline-block w-[230px] rounded-full border-2 border-white px-4 py-2 text-white'
            dateTime={time}
          >
            {time}
          </time>
        </h3>
      </div>
    </div>
  </section>
);

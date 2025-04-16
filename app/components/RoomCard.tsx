import Image from "next/image";

interface RoomCardProps {
  day: string;
  room: string;
  time: string;
  gradient: string;
}
export const RoomCard = ({ day, room, time, gradient,}: RoomCardProps) => (
  <section
    className={`relative w-[272px] p-[30px] rounded-[25px] ${gradient} flex flex-col items-center shadow-lg`}
  >
    <h2 className="w-full text-center">{day}</h2>
    <hr className="absolute left-0 right-0 top-[72px] border-t border-white" />
    <div className="flex flex-col gap-[36px] items-center text-center">
      <h3 className="mt-[20px] displayS">{room}</h3>
      <div className="flex flex-col items-center gap-[40px]">
        <figure className="w-14 h-14 relative">
          <Image src="/calendar-check-2.svg" alt={`${day} icon`} fill />
        </figure>
        <h3 className="h3">
        <time
          className="w-[230px] px-4 py-2 rounded-full border-2 border-white text-white inline-block"
          dateTime={time}
        >
          {time}
        </time>
      </h3>
      </div>
    </div>
  </section>
);


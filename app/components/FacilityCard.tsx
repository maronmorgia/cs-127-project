import { useState } from 'react';
import { Pencil, FlaskConical, Subtitles, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type Facility = {
  id: number;
  type: string;
  roomname: string;
  capacity: number;
};

interface FacilityCardProps {
  facility: Facility;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FacilityCard({
  facility,
  onEdit,
  onDelete,
}: FacilityCardProps) {
  const pathname = usePathname();
  const isAdminPath = pathname.includes('/admin');

  const { type, roomname, capacity } = facility;
  const [showPopup, setShowPopup] = useState(false);

  // Determine the schedule route based on admin path
  const scheduleRoute = isAdminPath
    ? `/admin/schedule?room=${encodeURIComponent(roomname)}`
    : `/student/schedule?roomname=${encodeURIComponent(roomname)}`;

  const backgroundClass =
    {
      classroom: 'bg-classroom-card',
      laboratory: 'bg-laboratory-card',
      meeting: 'bg-meeting-card',
    }[type] ??
    'bg-gradient-to-b from-neutral-500 via-neutral-400 to-neutral-200';

  const Icon =
    {
      classroom: Pencil,
      laboratory: FlaskConical,
      meeting: Subtitles,
    }[type] ?? Plus;

  const CardContent = () => {
    const contentClass = showPopup
      ? 'w-full px-4 py-6 sm:max-w-[320px]'
      : 'w-full px-4 py-6 sm:max-w-[220px]';

    return (
      <div
        className={`flex flex-col gap-4 rounded-[25px] leading-8 shadow-md shadow-neutral-500 ${contentClass} ${backgroundClass}`}
      >
        <h3 className='large leading-8 text-white uppercase'>
          {type || 'Facility'}
        </h3>
        <hr className='w-full border-white' />
        <div className='flex flex-col items-center gap-2'>
          <h2 className='lead leading-7 text-white'>{roomname || '000'}</h2>
          <figure>
            <Icon className='size-[35px] text-white' />
          </figure>
        </div>
      </div>
    );
  };

  const PopupContent = () => (
    <div
      className={`flex w-full flex-col gap-4 rounded-[25px] p-6 leading-8 shadow-md shadow-neutral-500 ${backgroundClass}`}
    >
      <h3 className='leading-8 text-white uppercase'>{type || 'Facility'}</h3>
      <hr className='w-full border-white' />
      <div className='flex flex-col items-center gap-2'>
        <h2 className='displayS leading-13 text-white'>{roomname || '000'}</h2>
        <figure>
          <Icon className='size-[60px] text-white' />
        </figure>
      </div>
      <p className='lead text-white uppercase'>Capacity: {capacity || 'N/A'}</p>

      <Link href={scheduleRoute}>
        <button className='large w-full cursor-pointer rounded-md border-2 border-neutral-50 px-4 py-2 text-white'>
          Show Schedule
        </button>
      </Link>

      {onEdit && onDelete && (
        <div className='flex w-full justify-between gap-2.5'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className='large w-full cursor-pointer rounded-md border-2 border-neutral-50 px-4 py-2 text-white'
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className='large w-full cursor-pointer rounded-md border-2 border-neutral-50 px-4 py-2 text-white'
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Regular card version */}
      <section
        onClick={() => setShowPopup(true)}
        className='mx-auto w-full max-w-[575px] cursor-pointer sm:max-w-[320px]'
      >
        <CardContent />
      </section>

      {/* Popup version */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='w-[90%] max-w-[575px] min-w-[320px] transform transition-all duration-300 ease-in-out'
          >
            <PopupContent />
          </div>
        </div>
      )}
    </>
  );
}

'use client';

<meta name="viewport" content="width=device-width, initial-scale=1.0" />
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-800 pr-7 pl-7 min-w-[375px] max-w-[575px]">
    <Navbar />
      {/* <button
        className='rounded bg-red-500 px-4 py-2 text-white'
        onClick={async () => {
          await logout();
        }}
      >
        Logout
      </button> */}
    </div>
  );
}

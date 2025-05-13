'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import {
  X,
  Home,
  Plus,
  Edit,
  FileText,
  FlaskConical,
  Subtitles,
  FileTextIcon,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-50 h-full w-[375px] bg-neutral-50 shadow-lg transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
      role='navigation'
      aria-label='Admin sidebar'
    >
      {/* Top section */}
      <div className='flex items-center justify-between px-7 py-3 text-black'>
        <Logo variant='full' />
        <button onClick={onClose} aria-label='Close sidebar'>
          <X />
        </button>
      </div>

      {/* Navigation links */}
      <nav className='flex flex-col gap-2 px-5 py-3'>
        <SidebarLink label='Home' href='/' icon={Home} />
      </nav>

      {/* Admin section (visible only in /admin paths) */}
      {isAdminPath && (
        <section className='border-t border-neutral-400 px-5 py-1.5'>
          <h2 className='lead px-2 py-1.5 leading-7 text-neutral-900'>Admin</h2>
          <SidebarLink
            label='Add Facility'
            href='/admin/facilities/create'
            icon={Plus}
          />
          <SidebarLink
            label='Change Password'
            href='/admin/change-password'
            icon={Edit}
          />
        </section>
      )}

      {/* Facilities section */}
      <section className='border-t border-neutral-400 px-5 py-3'>
        <h2 className='lead px-2 py-1.5 leading-7 text-neutral-900'>
          Facilities
        </h2>
        <SidebarLink
          label='Reservation Form'
          href='/reservation'
          icon={FileText}
        />
        <SidebarLink
          label='Laboratory Rooms'
          href='/labs'
          icon={FlaskConical}
        />
        <SidebarLink label='Meeting Rooms' href='/meetings' icon={Subtitles} />
      </section>

      {/* Forms Section */}
      <section className='border-t border-neutral-400 px-5 py-3'>
        <h2 className='lead px-2 py-1.5 leading-7 text-neutral-900'>Forms</h2>
        <SidebarLink
          label='Reservation Forms'
          href='/forms'
          icon={FileTextIcon}
        />
      </section>
    </aside>
  );
};

interface SidebarLinkProps {
  label: string;
  href: string;
  icon: React.ElementType;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  label,
  href,
  icon: Icon,
}) => (
  <Link
    href={href}
    className='medium flex items-center gap-2 rounded px-2 py-1.5 text-neutral-900 hover:bg-neutral-300'
  >
    <Icon className='text-secondary-900 size-4' />
    <span>{label}</span>
  </Link>
);

export default Sidebar;

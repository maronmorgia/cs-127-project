'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';

import {
  X,
  Home,
  Plus,
  Edit,
  FlaskConical,
  Subtitles,
  FileTextIcon,
  Pencil,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  setShowChangePassword?: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPath = pathname.startsWith('/admin');
  const isStudentPath = pathname.startsWith('/student');
  const basePath = isAdminPath ? '/admin' : isStudentPath ? '/student' : '';

  const handleChangePasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    router.push('/admin?modal=changePassword');
  };

  return (
    <>
      {open && (
        <div
          className='rad fixed inset-0 z-40 bg-black/30 transition-opacity duration-300'
          aria-hidden='true'
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-[375px] rounded-r-lg bg-neutral-800 shadow-lg transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        role='navigation'
        aria-label='Sidebar'
      >
        <div className='flex items-center justify-between px-7 py-3 text-neutral-50'>
          <Logo variant='full' />
          <button
            onClick={onClose}
            aria-label='Close sidebar'
            className='cursor-pointer rounded p-2 duration-200 ease-in-out hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none'
          >
            <X />
          </button>
        </div>

        <nav className='flex flex-col gap-2 px-5 py-3'>
          <SidebarLink label='Home' href='/' icon={Home} />
        </nav>

        {isAdminPath && (
          <section className='px-5 py-1.5'>
            <h2 className='lead px-2 py-1.5 leading-7 text-neutral-50'>
              Admin
            </h2>
            <SidebarLink
              label='Add Facility'
              href={`${basePath}/facilities`}
              icon={Plus}
            />
            <SidebarLink
              label='Change Password'
              href={basePath}
              icon={Edit}
              onClick={handleChangePasswordClick}
            />
          </section>
        )}

        <section className='px-5 py-3'>
          <h2 className='lead px-2 py-1.5 leading-7 text-neutral-50'>
            Facilities
          </h2>
          <SidebarLink
            label='Classrooms'
            href={`${basePath}/facilities?type=classroom`}
            icon={Pencil}
          />
          <SidebarLink
            label='Laboratory Rooms'
            href={`${basePath}/facilities?type=laboratory`}
            icon={FlaskConical}
          />
          <SidebarLink
            label='Meeting Rooms'
            href={`${basePath}/facilities?type=meeting`}
            icon={Subtitles}
          />
        </section>

        <section className='px-5 py-3'>
          <h2 className='lead px-2 py-1.5 leading-7 text-neutral-50'>Forms</h2>
          <SidebarLink
            label='Reservation Forms'
            href='/forms'
            icon={FileTextIcon}
          />
        </section>
      </aside>
    </>
  );
};

interface SidebarLinkProps {
  label: string;
  href: string;
  icon: React.ElementType;
  onClick?: (e: React.MouseEvent) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  label,
  href,
  icon: Icon,
  onClick,
}) => (
  <Link
    href={href}
    className='medium flex items-center gap-2 rounded px-2 py-1.5 text-neutral-50 duration-200 ease-in-out hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none'
    onClick={onClick}
  >
    <Icon className='text-secondary-900 size-4' />
    <span>{label}</span>
  </Link>
);

export default Sidebar;

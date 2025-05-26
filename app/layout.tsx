import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import { Roboto } from 'next/font/google';
import localFont from 'next/font/local';

import './globals.css';

const roboto = Roboto({
  weight: ['200'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const schibsted = Schibsted_Grotesk({
  weight: ['400', '600', '500'],
  subsets: ['latin'],
  variable: '--font-schibsted',
});

const campton = localFont({
  src: [
    {
      path: '../public/fonts/CamptonBold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/CamptonMedium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/CamptonBook.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CamptonSemiBold.woff',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-campton',
});

export const metadata: Metadata = {
  title: 'Takda',
  description:
    'A reliable room schedule viewer for UP Mindanao, College of Science and Mathematics',
  icons: {
    icon: '/takda.ico',
    shortcut: '/takda.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${schibsted.variable} ${campton.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

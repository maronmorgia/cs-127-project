'use client'

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-8">
      <header className="text-3xl font-bold mb-6">Welcome to the Homepage</header>
      
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      
      <p className="text-lg text-center mt-4">
        Explore and build amazing web applications with Next.js.
      </p>

      <div className="flex gap-4 mt-6">
        <a
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          href="/about"
        >
          Learn More
        </a>
        <a
          className="px-6 py-2 rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          href="/contact"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}

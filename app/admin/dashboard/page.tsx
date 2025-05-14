'use client';

import Container from '@/app/components/Container';
import Navbar from '@/app/components/Navbar';

// This is the dashboard page for the admin section of the application.
export default function DashboardPage() {
  return (
    <main>
      <Navbar variant='facility' />
      <Container>
        <h1 className='Lead text-primary-900'>Dashboard</h1>
      </Container>
    </main>
  );
}

'use client';

<meta name='viewport' content='width=device-width, initial-scale=1.0' />;
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className='min-h-screen bg-neutral-800'>
      <Header />
      <AboutSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}

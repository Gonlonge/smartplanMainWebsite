import { useEffect } from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialSection from '../components/home/TestimonialSection';
import CtaSection from '../components/home/CtaSection';

function HomePage() {
  useEffect(() => {
    // Update page title
    document.title = 'Smartplan | Digitalt verktøy for bygg- og anleggsprosjekter';
  }, []);

  return (
    <Box component="section">
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
      <CtaSection />
    </Box>
  );
}

export default HomePage;
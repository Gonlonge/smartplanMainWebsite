import { useEffect } from 'react';
import { Box } from '@mui/material';
import PricingPlans from '../components/pricing/PricingPlans';
import FaqSection from '../components/pricing/FaqSection';
import CtaSection from '../components/home/CtaSection';

function PricingPage() {
  useEffect(() => {
    // Update page title
    document.title = 'Priser | Smartplan';
  }, []);

  return (
    <Box component="section">
      <PricingPlans />
      <FaqSection />
      <CtaSection />
    </Box>
  );
}

export default PricingPage;
import { useEffect } from 'react';
import { Box } from '@mui/material';
import ContactForm from '../components/contact/ContactForm';
import MapSection from '../components/contact/MapSection';

function ContactPage() {
  useEffect(() => {
    // Update page title
    document.title = 'Kontakt oss | Smartplan';
  }, []);

  return (
    <Box component="section" sx={{ pt: 10 }}>
      <ContactForm />
      <MapSection />
    </Box>
  );
}

export default ContactPage;
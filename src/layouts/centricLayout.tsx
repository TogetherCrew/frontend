import React from 'react';
import { Box, Container } from '@mui/material';


interface ICentricLayout {
  children: React.ReactNode;
}

function centricLayout({ children }: ICentricLayout) {
  return (
    <Box className='min-h-screen w-screen' bgcolor='grey.100'>
      {/* <Container
        sx={{ textAlign: 'center', paddingY: '2rem' }}
        className='space-y-6'
      > */}
      {children}
      {/* </Container> */}
    </Box>
  );
}

export default centricLayout;

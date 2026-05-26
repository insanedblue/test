import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { BrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import App from './App.tsx';

const theme = createTheme({
  primaryColor: 'violet',
  colors: {
    violet: [
      '#F3E8FF', // 0 - subtle bg
      '#E0C8FF', // 1
      '#C4A0FF', // 2
      '#A872FF', // 3
      '#9B33FF', // 4 - light
      '#7800FF', // 5 - PRIMARY (RGB 120,0,255)
      '#6600DD', // 6
      '#5C00CC', // 7 - dark
      '#4A009E', // 8
      '#360070', // 9 - deepest
    ],
  },
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  fontFamilyMonospace: 'ui-monospace, Consolas, monospace',
  defaultRadius: 'sm',
  headings: {
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    fontWeight: '700',
  },
  components: {
    Button: {
      defaultProps: { radius: 'sm' },
    },
    Card: {
      defaultProps: { radius: 'sm' },
    },
    Badge: {
      defaultProps: { radius: 'sm' },
    },
    TextInput: {
      defaultProps: { radius: 'sm' },
    },
    Select: {
      defaultProps: { radius: 'sm' },
    },
    MultiSelect: {
      defaultProps: { radius: 'sm' },
    },
    NumberInput: {
      defaultProps: { radius: 'sm' },
    },
    Textarea: {
      defaultProps: { radius: 'sm' },
    },
    Modal: {
      defaultProps: { radius: 'md' },
    },
    Paper: {
      defaultProps: { radius: 'sm' },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <DatesProvider settings={{ locale: 'ko' }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DatesProvider>
    </MantineProvider>
  </StrictMode>
);

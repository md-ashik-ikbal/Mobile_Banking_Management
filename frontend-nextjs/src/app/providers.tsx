'use client'

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Spinner, { FullScreenSpinner } from './components/spinner/spinner';
// Lazy load NextUIProvider and ThemeProvider with a loading component

const NextUIProvider = dynamic(async () => {
  const mod = await import('@nextui-org/react');
  return mod.NextUIProvider;
}, {
  ssr: false,
  loading: () => {
    return(
      <>
        <FullScreenSpinner />
      </>
    );
  }  // Show loading screen while NextUIProvider is loading
});

const ThemeProvider = dynamic(async () => {
  const mod = await import('next-themes');
  return mod.ThemeProvider;
}, {
  ssr: false,
  loading: () => {
    return(
      <>
        <FullScreenSpinner />
      </>
    );
  }  // Show loading screen while ThemeProvider is loading
});


export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  );
}

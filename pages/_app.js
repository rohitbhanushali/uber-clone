import '../styles/globals.css'
import "tailwindcss/tailwind.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Handle route change errors
    const handleError = (err) => {
      console.error('Route error:', err);
    };

    router.events.on('routeChangeError', handleError);
    return () => {
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp

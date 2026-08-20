import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use 'instant' behavior to avoid smooth scrolling animation on page change
    // even if scroll-behavior: smooth is set in CSS
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

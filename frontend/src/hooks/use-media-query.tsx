// hooks/use-media-query.js
import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    // Define callback for change events
    const listener = (event) => {
      setMatches(event.matches);
    };
    
    // Add listener for media query changes
    media.addEventListener('change', listener);
    
    // Clean up function
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
}
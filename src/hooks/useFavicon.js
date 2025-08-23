import { useEffect } from 'react';

export const useFavicon = (faviconUrl) => {
  useEffect(() => {
    if (!faviconUrl) return;

    // Store original favicon to restore later
    const originalFavicon = document.querySelector('link[rel="icon"]') || 
                           document.querySelector('link[rel="shortcut icon"]');
    const originalHref = originalFavicon?.href;

    // Remove existing favicon
    if (originalFavicon) {
      originalFavicon.remove();
    }

    // Create new favicon link element
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png'; // or 'image/x-icon' for .ico files
    link.href = faviconUrl;
    
    // Add to head
    document.head.appendChild(link);

    // Also handle apple-touch-icon for mobile
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = faviconUrl;
    document.head.appendChild(appleTouchIcon);

    // Cleanup function to restore original favicon
    return () => {
      // Remove custom favicon
      const customFavicon = document.querySelector(`link[rel="icon"][href="${faviconUrl}"]`);
      const customAppleIcon = document.querySelector(`link[rel="apple-touch-icon"][href="${faviconUrl}"]`);
      
      if (customFavicon) customFavicon.remove();
      if (customAppleIcon) customAppleIcon.remove();

      // Restore original favicon if it existed
      if (originalHref && originalFavicon) {
        const restoreFavicon = document.createElement('link');
        restoreFavicon.rel = 'icon';
        restoreFavicon.href = originalHref;
        document.head.appendChild(restoreFavicon);
      }
    };
  }, [faviconUrl]);
};
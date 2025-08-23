import { useEffect } from 'react';

export const usePageBranding = ({ title, faviconUrl, associationName }) => {
  useEffect(() => {
    // Store originals
    const originalTitle = document.title;
    const originalFavicons = Array.from(document.querySelectorAll('link[rel*="icon"]'));
    const originalHrefs = originalFavicons.map(link => ({ rel: link.rel, href: link.href, sizes: link.sizes }));

    // Set dynamic title
    if (title && associationName) {
      document.title = `${title} | ${associationName} - DuesPay`;
    } else if (title) {
      document.title = `${title} - DuesPay`;
    }

    // Set dynamic favicon
    if (faviconUrl) {
      // Remove ALL existing favicon-related links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(link => link.remove());

      // Add new favicon with multiple sizes
      const faviconSizes = ['16x16', '32x32', '48x48'];
      
      faviconSizes.forEach(size => {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = faviconUrl;
        link.sizes = size;
        document.head.appendChild(link);
      });

      // Add apple-touch-icon
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = faviconUrl;
      appleTouchIcon.sizes = '180x180';
      document.head.appendChild(appleTouchIcon);

      // Add shortcut icon for older browsers
      const shortcutIcon = document.createElement('link');
      shortcutIcon.rel = 'shortcut icon';
      shortcutIcon.href = faviconUrl;
      document.head.appendChild(shortcutIcon);
    }

    // Cleanup function
    return () => {
      // Restore original title
      document.title = originalTitle;

      // Remove custom favicons
      if (faviconUrl) {
        const customFavicons = document.querySelectorAll(`link[href="${faviconUrl}"]`);
        customFavicons.forEach(link => link.remove());
      }

      // Restore original favicons
      originalHrefs.forEach(({ rel, href, sizes }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (sizes) link.sizes = sizes;
        document.head.appendChild(link);
      });
    };
  }, [title, faviconUrl, associationName]);
};
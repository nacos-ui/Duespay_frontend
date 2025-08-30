import { useEffect } from 'react';

export const useFavicon = (faviconUrl) => {
  useEffect(() => {
    if (!faviconUrl) return;

    const secureFaviconUrl = faviconUrl.replace(/^http:/, 'https:');
    
    console.log('Setting favicon:', {
      original: faviconUrl,
      secure: secureFaviconUrl,
      isProduction: window.location.protocol === 'https:'
    });

    const originalFavicon = document.querySelector('link[rel="icon"]') || 
                           document.querySelector('link[rel="shortcut icon"]');
    const originalHref = originalFavicon?.href;

    if (originalFavicon) {
      originalFavicon.remove();
    }

    const existingCustomFavicons = document.querySelectorAll('link[rel="icon"][data-custom="true"]');
    existingCustomFavicons.forEach(favicon => favicon.remove());

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = secureFaviconUrl;
    link.setAttribute('data-custom', 'true'); 
    
    link.onerror = () => {
      console.warn('Failed to load favicon:', secureFaviconUrl);
      if (secureFaviconUrl !== faviconUrl) {
        link.href = faviconUrl;
      }
    };
    

    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = secureFaviconUrl;
    appleTouchIcon.setAttribute('data-custom', 'true');
    
    appleTouchIcon.onerror = () => {
      console.warn('Failed to load apple-touch-icon:', secureFaviconUrl);
      if (secureFaviconUrl !== faviconUrl) {
        appleTouchIcon.href = faviconUrl;
      }
    };
    
    document.head.appendChild(appleTouchIcon);

    const sizes = ['16x16', '32x32', '96x96'];
    const sizedFavicons = sizes.map(size => {
      const sizedLink = document.createElement('link');
      sizedLink.rel = 'icon';
      sizedLink.type = 'image/png';
      sizedLink.sizes = size;
      sizedLink.href = secureFaviconUrl;
      sizedLink.setAttribute('data-custom', 'true');
      document.head.appendChild(sizedLink);
      return sizedLink;
    });

    return () => {
      const customFavicons = document.querySelectorAll('link[data-custom="true"]');
      customFavicons.forEach(favicon => favicon.remove());

      if (originalHref && originalFavicon) {
        const restoreFavicon = document.createElement('link');
        restoreFavicon.rel = 'icon';
        restoreFavicon.href = originalHref;
        document.head.appendChild(restoreFavicon);
      }
    };
  }, [faviconUrl]);
};
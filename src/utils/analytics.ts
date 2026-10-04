// Google Analytics and tracking utilities

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
};

// Track user interactions
export const trackPageView = (pagePath: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: pagePath,
    });
  }
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
  });
};

export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', {
    form_name: formName,
  });
};

export const trackMenuDownload = () => {
  trackEvent('menu_download', {
    content_type: 'pdf',
    item_id: 'restaurant_menu',
  });
};
export const trackArtworkInterest = (artworkId: string, artworkTitle: string) => {
  trackEvent('artwork_interest', {
    artwork_id: artworkId,
    artwork_title: artworkTitle,
  });
};

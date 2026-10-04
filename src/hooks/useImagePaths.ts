import { useMemo } from 'react';
import { imagePaths, hostingerImagePaths } from '../utils/imagePaths';

// Detect hosting provider based on domain or user agent
const detectHostingProvider = (): 'netlify' | 'hostinger' | 'other' => {
  if (typeof window === 'undefined') return 'other';
  
  const hostname = window.location.hostname;
  
  // Check for Netlify
  if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
    return 'netlify';
  }
  
  // Check for Hostinger (common patterns)
  if (hostname.includes('hostinger') || hostname.includes('000webhost') || hostname.includes('infinityfree')) {
    return 'hostinger';
  }
  
  // Default to hostinger for most shared hosting providers
  return 'hostinger';
};

    
        // Try hostinger first, fallback to netlify


export const useImagePaths = () => {
  return useMemo(() => {
    const provider = detectHostingProvider();
    switch (provider) {
      case 'netlify':
        return imagePaths;
      case 'hostinger':
        return hostingerImagePaths;
      default:
        return hostingerImagePaths;
    }
  }, []);
};

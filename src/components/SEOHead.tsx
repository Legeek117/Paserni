import React from 'react';
import { useCountry } from '../contexts/CountryContext';
import { getCountryContent } from '../data/countryContent';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

  
    
    // Update meta tags
    
    
    

    // Ensure og:image exists and is set

    // Ensure twitter card uses summary_large_image


const SEOHead: React.FC<SEOHeadProps> = ({ 
  title,
  description,
  keywords,
  ogImage = "/LOGO%20EP%20insubation%20(1).jpg"
}) => {
  const { countryData } = useCountry();
  const content = getCountryContent(countryData.id);
  const defaultTitle = "Espace Paserni - Arts • Culture • Incubation • Restauration";
  const defaultDescription = content.seo.description;
  const defaultKeywords = content.seo.keywords;
  React.useEffect(() => {
    document.title = title || defaultTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || defaultDescription);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || defaultKeywords);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title || defaultTitle);
    }
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description || defaultDescription);
    }
    let ogImageTag = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    if (!ogImageTag) {
      ogImageTag = document.createElement('meta');
      ogImageTag.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageTag);
    }
    ogImageTag.setAttribute('content', ogImage);
    let twitterCard = document.querySelector('meta[name="twitter:card"]') as HTMLMetaElement | null;
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');
  }, [title, description, keywords, ogImage, defaultTitle, defaultDescription, defaultKeywords]);
  return null;
};
export default SEOHead;

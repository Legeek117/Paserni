// Utility functions for handling image paths on Netlify

// Create properly encoded image paths for Netlify
export const encodeImagePath = (path: string): string => {
  return encodeURIComponent(path).replace(/%2F/g, '/');
};

// Pre-encoded paths for all images to avoid runtime encoding issues
export const createImagePath = (folder: string, filename: string): string => {
  const basePath = '/images-galeries';
  const fullPath = `${basePath}/${folder}/${filename}`;
  return encodeImagePath(fullPath);
};
  // PDG COM & EVENTS - Côte d'Ivoire
  // PDG COM & EVENTS - Bénin

// Alternative paths for Hostinger (with different encoding)
export const imagePaths = {
  'pdg-com-events-ci': {
    'branding-diegonefla': '/images-galeries/pdg-com-%26-events/CI/branding-diegonefla.jpeg',
    'poster-bob-marley': '/images-galeries/pdg-com-%26-events/CI/poster-geant-de-bob-marley.jpeg',
    'mur-stars-eunice-zunon': '/images-galeries/pdg-com-%26-events/CI/mur-de-stars-pour-eunice-zunonbrunch-des-kpakpatos.jpeg',
    'poster-jean-louis-moulot': '/images-galeries/pdg-com-%26-events/CI/Poster%20g%C3%A9ant%20de%20M.%20Jean%20louis%20Moulot.jpeg',
    'mur-stars-willy-dumbo': '/images-galeries/pdg-com-%26-events/CI/willydumbowammanshow.jpeg',
    'abidjan-weekend-expo': '/images-galeries/pdg-com-%26-events/CI/r%C3%A9alisationdumurdestarsetduportaildeabidjanweek-endexpo.jpeg',
    'camp-du-futur-bassam': '/images-galeries/pdg-com-%26-events/CI/creationdefonddescenepourunpodiumsurlethemetechnologiesdufuturabassamcote.jpeg',
    'branding-moov': '/images-galeries/pdg-com-%26-events/CI/Branding%20futuriste%20pour%20Moov%20Africa.jpeg',
    'decor-malta-street-dance': '/images-galeries/pdg-com-%26-events/CI/D%C3%A9cor%20sc%C3%A9nique%20pour%20Malta%20Street%20Dance.jpeg',
    'decor-space-photos': '/images-galeries/pdg-com-%26-events/CI/D%C3%A9cor%20space%20photos.jpeg',
    'decor-concert-yilim': '/images-galeries/pdg-com-%26-events/CI/D%C3%A9cor-concert-de-Yilim.jpeg',
    'decor-fond-scene-primid': '/images-galeries/pdg-com-%26-events/CI/decor-de-fond-de-scene-primid.jpeg',
    'mur-star-et-fond-scene': '/images-galeries/pdg-com-%26-events/CI/mur-de-star-et-fond-de-scene.jpeg',
    'mur-star-et-tapis-rouge': '/images-galeries/pdg-com-%26-events/CI/mur-de-star-et-tapis-rouge.jpeg',
    'poster-geant': '/images-galeries/pdg-com-%26-events/CI/poster-g%C3%A9ant.jpeg',
  },
  'pdg-com-events-bj': {
    'concert-elles-sont-de-retour': '/images-galeries/pdg-com-%26-events/BJ/concert-elles-sont-de-retour.jpeg.jpeg',
    'posters-ecureuils': '/images-galeries/pdg-com-%26-events/BJ/posterpourlesecureuils.jpeg',
    'branding-moov': '/images-galeries/pdg-com-%26-events/BJ/Branding%20futuriste%20pour%20Moov%20Africa.jpeg',
    'concert-ebenezer': '/images-galeries/pdg-com-%26-events/BJ/Conception%20et%20d%C3%A9cor%20de%20sc%C3%A8ne%20pour%20le%20concert%20Ebenezer%20dans%20la%20salle%20rouge%20du%20palais%20des%20congr%C3%A8s%20de%20Cotonou.jpeg',
    'decor-fete-musique': '/images-galeries/pdg-com-%26-events/BJ/Decor%20scenique%20fete%20de%20la%20musique.jpeg',
    'decor-space-photos': '/images-galeries/pdg-com-%26-events/BJ/D%C3%A9cor%20space%20photos.jpeg',
    'decor-esplanade-palais': '/images-galeries/pdg-com-%26-events/BJ/d%C3%A9cor-esplanade%20du-palais-des-congr%C3%A8s.jpeg',
    'effigies-celtiis': '/images-galeries/pdg-com-%26-events/BJ/Effigies%20g%C3%A9antes%20pour%20CELTIIS.jpeg',
    'portail-concert-elle-merite': '/images-galeries/pdg-com-%26-events/BJ/Portail%20Concert%20ELLE%20M%C3%89RITE%20TOUT.jpeg',
    'portail-branding-stands': '/images-galeries/pdg-com-%26-events/BJ/Portail%20et%20branding%20de%20Stands.jpeg',
    'portique-entree-celtiis': '/images-galeries/pdg-com-%26-events/BJ/Portique-d%27entr%C3%A9e-pour-un-%C3%A9v%C3%A8nement-celtiis-b%C3%A9nin.jpeg',
    'poster-bob-marley': '/images-galeries/pdg-com-%26-events/BJ/poster-geant-de-bob-marley.jpeg',
  }
};
  // PDG COM & EVENTS - Côte d'Ivoire
  // PDG COM & EVENTS - Bénin

export const hostingerImagePaths = {
  'pdg-com-events-ci': {
    'branding-diegonefla': '/images-galeries/pdg-com-&-events/CI/branding-diegonefla.jpeg',
    'poster-bob-marley': '/images-galeries/pdg-com-&-events/CI/poster-geant-de-bob-marley.jpeg',
    'mur-stars-eunice-zunon': '/images-galeries/pdg-com-&-events/CI/mur-de-stars-pour-eunice-zunonbrunch-des-kpakpatos.jpeg',
    'poster-jean-louis-moulot': '/images-galeries/pdg-com-&-events/CI/Poster géant de M. Jean louis Moulot.jpeg',
    'mur-stars-willy-dumbo': '/images-galeries/pdg-com-&-events/CI/willydumbowammanshow.jpeg',
    'abidjan-weekend-expo': '/images-galeries/pdg-com-&-events/CI/réalisationdumurdestarsetduportaildeabidjanweek-endexpo.jpeg',
    'camp-du-futur-bassam': '/images-galeries/pdg-com-&-events/CI/creationdefonddescenepourunpodiumsurlethemetechnologiesdufuturabassamcote.jpeg',
    'branding-moov': '/images-galeries/pdg-com-&-events/CI/Branding futuriste pour Moov Africa.jpeg',
    'decor-malta-street-dance': '/images-galeries/pdg-com-&-events/CI/Décor scénique pour Malta Street Dance.jpeg',
    'decor-space-photos': '/images-galeries/pdg-com-&-events/CI/Décor space photos.jpeg',
    'decor-concert-yilim': '/images-galeries/pdg-com-&-events/CI/Décor-concert-de-Yilim.jpeg',
    'decor-fond-scene-primid': '/images-galeries/pdg-com-&-events/CI/decor-de-fond-de-scene-primid.jpeg',
    'mur-star-et-fond-scene': '/images-galeries/pdg-com-&-events/CI/mur-de-star-et-fond-de-scene.jpeg',
    'mur-star-et-tapis-rouge': '/images-galeries/pdg-com-&-events/CI/mur-de-star-et-tapis-rouge.jpeg',
    'poster-geant': '/images-galeries/pdg-com-&-events/CI/poster-géant.jpeg',
  },
  'pdg-com-events-bj': {
    'concert-elles-sont-de-retour': '/images-galeries/pdg-com-&-events/BJ/concert-elles-sont-de-retour.jpeg.jpeg',
    'posters-ecureuils': '/images-galeries/pdg-com-&-events/BJ/posterpourlesecureuils.jpeg',
    'branding-moov': '/images-galeries/pdg-com-&-events/BJ/Branding futuriste pour Moov Africa.jpeg',
    'concert-ebenezer': '/images-galeries/pdg-com-&-events/BJ/Conception et décor de scène pour le concert Ebenezer dans la salle rouge du palais des congrès de Cotonou.jpeg',
    'decor-fete-musique': '/images-galeries/pdg-com-&-events/BJ/Decor scenique fete de la musique.jpeg',
    'decor-space-photos': '/images-galeries/pdg-com-&-events/BJ/Décor space photos.jpeg',
    'decor-esplanade-palais': '/images-galeries/pdg-com-&-events/BJ/décor-esplanade du-palais-des-congrès.jpeg',
    'effigies-celtiis': '/images-galeries/pdg-com-&-events/BJ/Effigies géantes pour CELTIIS.jpeg',
    'portail-concert-elle-merite': '/images-galeries/pdg-com-&-events/BJ/Portail Concert ELLE MÉRITE TOUT.jpeg',
    'portail-branding-stands': '/images-galeries/pdg-com-&-events/BJ/Portail et branding de Stands.jpeg',
    'portique-entree-celtiis': '/images-galeries/pdg-com-&-events/BJ/Portique-d\'entrée-pour-un-évènement-celtiis-bénin.jpeg',
    'poster-bob-marley': '/images-galeries/pdg-com-&-events/BJ/poster-geant-de-bob-marley.jpeg',
  }
};

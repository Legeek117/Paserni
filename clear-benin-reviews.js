// Script pour supprimer tous les avis du Bénin
// À exécuter dans la console du navigateur

console.log('🧹 Suppression des avis du Bénin...');

// Supprimer les avis du Bénin du localStorage
localStorage.removeItem('reviews_benin');

// Vérifier s'il y a d'autres clés d'avis liées au Bénin
const keys = Object.keys(localStorage);
const beninReviewKeys = keys.filter(key => key.includes('benin') && key.includes('reviews'));

if (beninReviewKeys.length > 0) {
  console.log('🔍 Clés d\'avis du Bénin trouvées:', beninReviewKeys);
  beninReviewKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Supprimé: ${key}`);
  });
} else {
  console.log('✅ Aucune clé d\'avis du Bénin trouvée');
}

// Afficher les avis restants
const remainingReviewKeys = keys.filter(key => key.startsWith('reviews_'));
console.log('📊 Avis restants:', remainingReviewKeys);

console.log('🎉 Suppression terminée ! Rechargez la page pour voir les changements.');



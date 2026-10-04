import React from 'react';

    // Clear the reload flags
    
    // Reload the page


const ResetGalleryButton: React.FC = () => {
  const handleReset = () => {
    sessionStorage.removeItem('pdg-com-events-reloaded');
    sessionStorage.removeItem('pdg-building-reloaded');
    window.location.reload();
  };
  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 z-50"
      title="Réinitialiser les galeries"
    >
      🔄 Reset
    </button>
  );
};

export default ResetGalleryButton;

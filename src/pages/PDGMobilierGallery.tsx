import React from 'react';
import { Link } from 'react-router-dom';

const PDGMobilierGallery: React.FC = () => {
  return (
    <div className="min-h-screen py-8 pt-6 md:pt-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/departements" className="inline-block mb-6 text-sm bg-orange-600 text-white hover:bg-orange-700 px-3 py-1 rounded">← Retour aux départements</Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="section-title">PDG MOBILIER</h1>
          <p className="text-gray-600">Cette page a été vidée par l'administrateur.</p>
        </div>
      </div>
    </div>
  );
};

export default PDGMobilierGallery;

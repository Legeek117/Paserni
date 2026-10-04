import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  progress: number;
  total: number;
  loaded: number;
}

        
        
        
        

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, total, loaded }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Chargement des images...
        </h2>
        <p className="text-gray-600 mb-4">
          {loaded} / {total} images chargées
        </p>
        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
          <motion.div
            className="bg-orange-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {Math.round(progress)}% terminé
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;

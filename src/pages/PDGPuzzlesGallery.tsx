import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import DepartmentImages from '../components/DepartmentImages'

const PDGPuzzlesGallery: React.FC = () => {
  return (
    <div className="min-h-screen py-8 pt-6 md:pt-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/departements" className="inline-block mb-6 text-sm bg-orange-600 text-white hover:bg-orange-700 px-3 py-1 rounded">← Retour aux départements</Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.45 }} 
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ImageIcon size={48} className="text-orange-600" />
            <h1 className="section-title">PDG PUZZLES</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Puzzles et jouets éducatifs conçus et fabriqués localement. Retrouvez ici nos créations et projets éducatifs.
          </p>
        </motion.div>

        <DepartmentImages department="puzzles" />
      </div>
    </div>
  )
}

export default PDGPuzzlesGallery

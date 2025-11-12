import React from 'react'
import { X, Star, MessageSquare } from 'lucide-react'
import TutorReviews from './TutorReviews'

const TutorReviewsModal = ({ isOpen, onClose, tutor }) => {
  if (!isOpen || !tutor) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-[28px] border border-white/15 bg-white/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold leading-tight">{tutor.name}&apos;s Reviews</h2>
            <p className="text-sm text-white/80">What students are saying</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/20 transition-colors"
            aria-label="Close reviews"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6 bg-white/80">
          <TutorReviews tutorId={tutor.id} tutorName={tutor.name} />
        </div>
      </div>
    </div>
  )
}

export default TutorReviewsModal

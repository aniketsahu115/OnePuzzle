import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Award, Star, TrendingUp, Trophy } from 'lucide-react';
import { Attempt } from '@shared/schema';
import { useChessAudio } from '@/lib/useChessAudio';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  date?: Date;
}

interface AchievementShowcaseProps {
  isVisible: boolean;
  onClose: () => void;
  attempt?: Attempt | null;
  streakCount?: number;
  totalSolved?: number;
}

const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  isVisible,
  onClose,
  attempt = null,
  streakCount = 0,
  totalSolved = 0
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { playSound } = useChessAudio();

  // Define possible achievements
  useEffect(() => {
    if (isVisible && attempt) {
      const newAchievements: Achievement[] = [];
      
      // First puzzle solved achievement
      if (totalSolved === 1) {
        newAchievements.push({
          id: 'first-puzzle',
          title: 'First Steps',
          description: 'You solved your first chess puzzle!',
          icon: <CheckCircle className="w-8 h-8" />,
          color: 'bg-green-500',
          unlocked: true,
          date: new Date()
        });
      }
      
      // Fast solver achievement
      if (attempt.timeTaken < 30) {
        newAchievements.push({
          id: 'fast-solver',
          title: 'Lightning Fast',
          description: 'Solved a puzzle in under 30 seconds!',
          icon: <TrendingUp className="w-8 h-8" />,
          color: 'bg-blue-500',
          unlocked: true,
          date: new Date()
        });
      }
      
      // First attempt achievement
      if (attempt.attemptNumber === 1 && attempt.isCorrect) {
        newAchievements.push({
          id: 'first-try',
          title: 'First Try!',
          description: 'Solved a puzzle on your first attempt',
          icon: <Star className="w-8 h-8" />,
          color: 'bg-yellow-500',
          unlocked: true,
          date: new Date()
        });
      }
      
      // Streak achievement
      if (streakCount >= 3) {
        newAchievements.push({
          id: 'streak',
          title: 'On Fire!',
          description: `${streakCount} correct solutions in a row`,
          icon: <Trophy className="w-8 h-8" />,
          color: 'bg-orange-500',
          unlocked: true,
          date: new Date()
        });
      }
      
      // Set achievements and play sound if there are any
      if (newAchievements.length > 0) {
        setAchievements(newAchievements);
        setShowConfetti(true);
        playSound('success');
      } else {
        // No achievements to show
        onClose();
      }
    }
  }, [isVisible, attempt, totalSolved, streakCount, onClose, playSound]);

  // Auto-advance through achievements
  useEffect(() => {
    if (isVisible && achievements.length > 0) {
      const timer = setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          // Last achievement, close after delay
          setTimeout(() => {
            onClose();
            setCurrentIndex(0);
            setShowConfetti(false);
          }, 3000);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, achievements, currentIndex, onClose]);

  // Render nothing if not visible or no achievements
  if (!isVisible || achievements.length === 0) {
    return null;
  }

  const currentAchievement = achievements[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Confetti effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-3 h-3 rounded-full ${
                    ['bg-primary', 'bg-accent', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400'][
                      Math.floor(Math.random() * 5)
                    ]
                  }`}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    ease: 'easeOut',
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          )}

          {/* Achievement card */}
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className={`${currentAchievement.color} p-6 flex justify-center`}>
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                className="bg-white p-4 rounded-full shadow-lg"
              >
                {currentAchievement.icon}
              </motion.div>
            </div>
            
            <div className="p-6 text-center">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold mb-2"
              >
                {currentAchievement.title}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-4"
              >
                {currentAchievement.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center"
              >
                <Award className="w-12 h-12 text-primary" />
              </motion.div>
            </div>
            
            {/* Pagination dots */}
            {achievements.length > 1 && (
              <div className="flex justify-center pb-4">
                {achievements.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 mx-1 rounded-full ${
                      index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
            
            <div className="p-4 border-t border-gray-200 flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementShowcase;
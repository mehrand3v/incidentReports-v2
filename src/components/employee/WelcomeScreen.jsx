import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Search,
  Shield,
  Eye,
  Camera,
  Lock,
  User,
  AlertCircle,
  Zap,
  Rocket,
  Sparkles
} from 'lucide-react';
import circleImage from '../../assets/circle.png';
import grenadeLauncherImage from '../../assets/grenade-launcher.png';
import rifleImage from '../../assets/rifle.png';
import handcuffsImage from '../../assets/handcuffs.png';
import gunImage from '../../assets/gun.png';
import bulletsImage from '../../assets/bullets.png';
import knifeImage from '../../assets/combat-knife.png';

const funMessages = [
  "Time to be a hero! 🦸‍♂️",
  "Ready to catch some troublemakers? 🕵️‍♂️",
  "Let's make this store safer! 🚀",
  "Another day, another incident report! 💪",
  "Ready to save the day? 🦸‍♀️",
  "Let's do some digital justice! ⚖️",
  "Time to flex those reporting muscles! 💪",
  "Ready to report some incidents? 😎",
  "Let's catch those thieves! 🎯",
  "Time to be a security hero! 🛡️",
  "Ready to protect our store? 🚨",
  "Let's make our store safer together! 🤝",
  "Time to be a detective! 🔍",
  "Ready to report suspicious activity? 👀",
  "Let's keep our store secure! 🔒"
];

// Define different animation variants
const imageAnimations = [
  {
    // Dramatic drop from high above
    initial: { y: -500, scale: 1.5, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.8,
      duration: 1.5
    }
  },
  {
    // Long slide from far left with multiple rotations
    initial: { x: -800, rotate: -720, opacity: 0 },
    animate: { x: 0, rotate: 0, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.5,
      duration: 1.8
    }
  },
  {
    // Dramatic flip from right
    initial: { x: 800, rotateY: 720, scale: 0.5, opacity: 0 },
    animate: { x: 0, rotateY: 0, scale: 1, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.6,
      duration: 1.6
    }
  },
  {
    // Explosive zoom from center
    initial: { scale: 0, rotate: 360, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.7,
      duration: 1.4
    }
  },
  {
    // Spiral entrance from top-right
    initial: { x: 600, y: -600, rotate: 720, scale: 0.5, opacity: 0 },
    animate: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.6,
      duration: 2
    }
  },
  {
    // Bounce in from bottom with multiple bounces
    initial: { y: 600, scale: 0.8, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.9,
      duration: 1.7
    }
  },
  {
    // Dramatic diagonal entrance
    initial: { x: -600, y: -600, rotate: -360, scale: 0.5, opacity: 0 },
    animate: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.7,
      duration: 1.8
    }
  },
  {
    // Flip and slide from bottom-right
    initial: { x: 600, y: 600, rotateX: 360, scale: 0.5, opacity: 0 },
    animate: { x: 0, y: 0, rotateX: 0, scale: 1, opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0.8,
      duration: 1.9
    }
  }
];

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    const randomDelay = () => Math.random() * 100 + 50; // Random delay between 50-150ms

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, randomDelay());

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, text, isTyping]);

  return (
    <div className="relative bg-black/30 p-4 rounded-lg border border-green-500/30 shadow-lg">
      <div className="font-mono text-green-400 text-xl">
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="inline-block w-2 h-6 bg-green-500 ml-1"
        />
      </div>
    </div>
  );
};

const WelcomeScreen = ({ onContinue }) => {
  const [showResponse, setShowResponse] = useState(false);
  const [selectedMessage] = useState(() =>
    funMessages[Math.floor(Math.random() * funMessages.length)]
  );
  const [selectedAnimation] = useState(() =>
    imageAnimations[Math.floor(Math.random() * imageAnimations.length)]
  );

  const handleContinue = () => {
    setShowResponse(true);
    setTimeout(() => {
      onContinue();
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center space-y-8 relative"
    >
      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-48 h-48 mx-auto"
      >
        {/* Enhanced glowing background effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Pulsing border effect */}
        <motion.div
          className="absolute -inset-4 rounded-full border-4 border-blue-500/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main image container */}
        <motion.div
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
          }}
          {...selectedAnimation}
        >
          <motion.img
            src={circleImage}
            alt="Circle"
            className="w-full h-full object-cover object-center scale-110"
            style={{
              transform: 'translateY(5%)'
            }}
          />

          {/* Enhanced animated border */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-500"
            animate={{
              borderColor: ['#3b82f6', '#8b5cf6', '#3b82f6'],
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(139, 92, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.5)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Grenade Launcher icon */}
        <motion.div
          className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={grenadeLauncherImage}
              alt="Grenade Launcher"
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </motion.div>
        </motion.div>

        {/* Rifle icon */}
        <motion.div
          className="absolute -top-4 -left-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
          }}
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={rifleImage}
              alt="Rifle"
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </motion.div>
        </motion.div>

        {/* Gun icon */}
        <motion.div
          className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={gunImage}
              alt="Gun"
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </motion.div>
        </motion.div>

        {/* Handcuffs icon */}
        <motion.div
          className="absolute -bottom-4 -left-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={handcuffsImage}
              alt="Handcuffs"
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </motion.div>
        </motion.div>

        {/* Combat Knife icon */}
        <motion.div
          className="absolute top-1/2 -left-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            boxShadow: '0 0 10px rgba(14, 165, 233, 0.5)'
          }}
        >
          <motion.div
            animate={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={knifeImage}
              alt="Combat Knife"
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </motion.div>
        </motion.div>

        {/* Decorative element - keeping only one */}
        <motion.div
          className="absolute top-1/2 -right-12 w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-12 mt-12"
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <TypewriterText text={selectedMessage} />
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResponse ? (
            <motion.div
              key="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg text-lg font-mono shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                [ENTER] Continue
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="response"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xl font-mono text-green-400"
            >
              Awesome! Let's make this store safer! 🚀
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-green-500/50 font-mono mt-4"
        >
          Your reports help keep our stores safe and secure
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
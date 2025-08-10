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
  Sparkles,
  Terminal,
  Wifi,
  Activity
} from 'lucide-react';

// Import your actual images here
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

const imageAnimations = [
  {
    initial: { y: -500, scale: 1.5, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    transition: { type: "spring", bounce: 0.8, duration: 1.5 }
  },
  {
    initial: { x: -800, rotate: -720, opacity: 0 },
    animate: { x: 0, rotate: 0, opacity: 1 },
    transition: { type: "spring", bounce: 0.5, duration: 1.8 }
  },
  {
    initial: { x: 800, rotateY: 720, scale: 0.5, opacity: 0 },
    animate: { x: 0, rotateY: 0, scale: 1, opacity: 1 },
    transition: { type: "spring", bounce: 0.6, duration: 1.6 }
  },
  {
    initial: { scale: 0, rotate: 360, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    transition: { type: "spring", bounce: 0.7, duration: 1.4 }
  }
];

const MatrixRain = () => {
  const [drops, setDrops] = useState([]);
  
  useEffect(() => {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const newDrops = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      characters: Array.from({ length: 8 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      )
    }));
    setDrops(newDrops);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute top-0 text-green-400 font-mono text-sm"
          style={{ left: `${drop.x}%` }}
          animate={{
            y: ['0vh', '120vh']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: drop.delay
          }}
        >
          {drop.characters.map((char, idx) => (
            <motion.div
              key={idx}
              className="opacity-80"
              animate={{
                opacity: [1, 0.3, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: idx * 0.1
              }}
            >
              {char}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const ScanLines = () => (
  <div className="fixed inset-0 pointer-events-none">
    <motion.div
      className="absolute inset-0 opacity-5"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          #00ff00 2px,
          #00ff00 4px
        )`
      }}
      animate={{
        backgroundPosition: ['0px 0px', '0px 8px']
      }}
      transition={{
        duration: 0.1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </div>
);

const TerminalHeader = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/90 border border-green-500/30 rounded-t-lg p-3 mb-6 font-mono text-green-400"
    >
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span>INCIDENT_REPORTER</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4" />
            <span>SECURE</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ONLINE
            </motion.span>
          </div>
        </div>
        <div className="text-green-300">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;
    
    const randomDelay = () => Math.random() * 100 + 50;
    
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
    <div className="relative bg-black/60 border border-green-500/40 rounded-lg p-4 backdrop-blur-sm">
      <div className="absolute top-2 left-2 flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
      <div className="font-mono text-green-400 text-xl mt-6">
        <span className="text-green-500 text-sm">$</span> {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="inline-block w-2 h-6 bg-green-500 ml-1"
        />
      </div>
      {!isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 text-sm mt-2 font-mono"
        >
          System{' '}
          <motion.span
            className="text-red-400 font-bold"
            animate={{
              opacity: [1, 0.3, 1],
              textShadow: [
                '0 0 5px rgba(248, 113, 113, 0.8)',
                '0 0 15px rgba(248, 113, 113, 1)',
                '0 0 5px rgba(248, 113, 113, 0.8)'
              ],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            [READY]
          </motion.span>
          {' '}for incident reporting.
        </motion.div>
      )}
    </div>
  );
};



const AccessGranted = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
  >
    <motion.div
      className="text-center space-y-4"
      animate={{
        textShadow: [
          '0 0 20px rgba(0, 255, 0, 0.8)',
          '0 0 40px rgba(0, 255, 0, 1)',
          '0 0 20px rgba(0, 255, 0, 0.8)'
        ]
      }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <div className="text-6xl font-mono text-green-400 font-bold">
        ACCESS
      </div>
      <div className="text-6xl font-mono text-green-400 font-bold">
        GRANTED
      </div>
      <motion.div
        className="text-lg text-green-500 font-mono"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        Initializing secure session...
      </motion.div>
    </motion.div>
  </motion.div>
);

const WelcomeScreen = ({ onContinue }) => {
  const [showResponse, setShowResponse] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [selectedMessage] = useState(() =>
    funMessages[Math.floor(Math.random() * funMessages.length)]
  );
  const [selectedAnimation] = useState(() =>
    imageAnimations[Math.floor(Math.random() * imageAnimations.length)]
  );

  const handleContinue = () => {
    setShowResponse(true);
    setShowAccessGranted(true);
    setTimeout(() => {
      setShowAccessGranted(false);
      setTimeout(() => {
        onContinue();
      }, 1000);
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
        <MatrixRain />
        <ScanLines />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="container mx-auto p-8 relative z-10"
        >
          <TerminalHeader />
          
          <div className="text-center space-y-8">
            {/* Main Profile Image */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-48 h-48 mx-auto"
            >
              {/* Multiple layered glow effects */}
              <motion.div
                className="absolute -inset-8 rounded-full blur-2xl"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)'
                  ],
                  scale: [1, 1.2, 1.1, 1],
                  opacity: [0.6, 0.8, 0.7, 0.6]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                className="absolute -inset-6 rounded-full blur-xl"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, transparent 60%)',
                    'radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, transparent 60%)',
                    'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, transparent 60%)'
                  ],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />

              {/* Enhanced terminal-style border with dynamic effects */}
              <motion.div
                className="absolute -inset-4 border-2 bg-green-500/5"
                animate={{
                  borderColor: [
                    'rgba(34, 197, 94, 0.8)', 
                    'rgba(59, 130, 246, 0.8)', 
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(34, 197, 94, 0.8)'
                  ],
                  boxShadow: [
                    '0 0 20px rgba(34, 197, 94, 0.6), inset 0 0 20px rgba(34, 197, 94, 0.1)',
                    '0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 30px rgba(59, 130, 246, 0.1)',
                    '0 0 25px rgba(147, 51, 234, 0.7), inset 0 0 25px rgba(147, 51, 234, 0.1)',
                    '0 0 20px rgba(34, 197, 94, 0.6), inset 0 0 20px rgba(34, 197, 94, 0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              />

              {/* Animated corner decorations */}
              <motion.div 
                className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2"
                animate={{
                  borderColor: ['#22c55e', '#3b82f6', '#9333ea', '#22c55e'],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2"
                animate={{
                  borderColor: ['#22c55e', '#3b82f6', '#9333ea', '#22c55e'],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.75 }}
              />
              <motion.div 
                className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2"
                animate={{
                  borderColor: ['#22c55e', '#3b82f6', '#9333ea', '#22c55e'],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
              <motion.div 
                className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2"
                animate={{
                  borderColor: ['#22c55e', '#3b82f6', '#9333ea', '#22c55e'],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 2.25 }}
              />

              {/* Main image container */}
              <motion.div
                className="relative w-full h-full overflow-hidden bg-black/50 border border-green-500/30 rounded-full"
                {...selectedAnimation}
              >
                <motion.img
                  src={circleImage}
                  alt="Security Profile"
                  className="w-full h-full object-cover object-center scale-110"
                  style={{
                    transform: 'translateY(5%)',
                  }}
                  animate={{
                    filter: [
                      'brightness(1.1) contrast(1.2) saturate(1.1)',
                      'brightness(1.3) contrast(1.4) saturate(1.3) hue-rotate(10deg)',
                      'brightness(1.1) contrast(1.2) saturate(1.1)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Enhanced scanning effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/30 to-transparent"
                  animate={{
                    y: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Additional horizontal scan line */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1
                  }}
                />

                {/* Pulsing border overlay */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  animate={{
                    borderColor: [
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(59, 130, 246, 0.8)', 
                      'rgba(147, 51, 234, 0.8)',
                      'rgba(34, 197, 94, 0.8)'
                    ],
                    boxShadow: [
                      '0 0 15px rgba(34, 197, 94, 0.6)',
                      '0 0 25px rgba(59, 130, 246, 0.8)',
                      '0 0 20px rgba(147, 51, 234, 0.7)',
                      '0 0 15px rgba(34, 197, 94, 0.6)'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Add back all the weapon icons around the image */}
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

              <motion.div
                className="absolute top-1/2 -right-12 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full p-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 }}
                style={{
                  boxShadow: '0 0 10px rgba(217, 70, 239, 0.5)'
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
                    src={bulletsImage}
                    alt="Bullets"
                    className="w-6 h-6 object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </motion.div>
              </motion.div>

              {/* Status indicators around the image */}
              <motion.div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500/20 border border-green-500 px-3 py-1 text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                SECURITY_ACTIVE
              </motion.div>

              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500/20 border border-blue-500 px-3 py-1 text-xs font-mono text-blue-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                ENCRYPTED_SESSION
              </motion.div>
            </motion.div>

            {/* Message Display */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <TypewriterText text={selectedMessage} />
              
              {/* System status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="grid grid-cols-3 gap-4 text-xs font-mono max-w-md mx-auto"
              >
                <div className="text-center p-2 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="text-green-400">SYSTEM</div>
                  <div className="text-green-600">ONLINE</div>
                </div>
                <div className="text-center p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                  <div className="text-blue-400">SECURITY</div>
                  <div className="text-blue-600">ACTIVE</div>
                </div>
                <div className="text-center p-2 bg-purple-500/10 border border-purple-500/30 rounded">
                  <div className="text-purple-400">REPORTS</div>
                  <div className="text-purple-600">READY</div>
                </div>
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
                      className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-none text-lg font-mono shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group border-2 border-green-500/50"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                      }}
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
                      <div className="flex items-center space-x-2 relative z-10">
                        <Terminal className="w-5 h-5" />
                        <span>[ENTER] INITIALIZE_SYSTEM</span>
                      </div>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xl font-mono text-green-400 bg-black/50 border border-green-500/30 p-4 rounded"
                  >
                    <div className="text-green-500 text-sm mb-2">root@security:~$</div>
                    System initialized successfully! Launching secure interface...
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-2"
                    >
                      |
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-green-600/50 font-mono mt-4 border-t border-green-500/20 pt-4"
              >
                <div>Secure Incident Reporting System v2.1</div>
                <div className="mt-1">Your reports help maintain store security protocols</div>
                <div className="mt-1 text-green-700/50">Last updated: {new Date().toLocaleDateString()}</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showAccessGranted && <AccessGranted />}
      </AnimatePresence>
    </>
  );
};

export default WelcomeScreen;
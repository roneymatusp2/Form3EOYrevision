import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Mathematical Decorative Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Mathematical Symbols */}
        <motion.div
          className="absolute bottom-40 left-10 text-4xl"
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          π
        </motion.div>
        
        <motion.div
          className="absolute top-10 right-20 text-5xl"
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          ∑
        </motion.div>
        
        <motion.div
          className="absolute top-20 left-1/4 text-4xl"
          animate={{
            y: [0, -8, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          ∫
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 right-1/3 text-5xl"
          animate={{
            y: [0, 8, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          θ
        </motion.div>
        
        <motion.div
          className="absolute bottom-30 right-10 text-3xl"
          animate={{
            y: [0, -5, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        >
          √
        </motion.div>
        
        {/* Coordinate System */}
        <svg className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 opacity-20" viewBox="0 0 100 100">
          <motion.line 
            x1="0" y1="50" x2="100" y2="50" 
            stroke="white" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 8 }}
          />
          <motion.line 
            x1="50" y1="0" x2="50" y2="100" 
            stroke="white" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 8 }}
          />
          
          {/* Curve of y = sin(x) */}
          <motion.path 
            d="M 0,50 C 10,30 20,70 30,30 C 40,70 50,30 60,70 C 70,30 80,70 90,50 L 100,50" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 7 }}
          />
        </svg>
      </div>
      
      {/* Footer Content */}
      <div className="container mx-auto relative z-10 py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Title */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Form 3 Mathematics</h2>
            <p className="text-indigo-200 mt-1">Cambridge IGCSE™ International Mathematics</p>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 text-sm">
            <div className="flex flex-col space-y-2">
              <h3 className="text-indigo-200 font-medium mb-1">Topics</h3>
              <Link to="/topic/number-systems" className="hover:text-indigo-300 transition-colors">Number Systems</Link>
              <Link to="/topic/algebraic-manipulation" className="hover:text-indigo-300 transition-colors">Algebraic Manipulation</Link>
              <Link to="/topic/mensuration" className="hover:text-indigo-300 transition-colors">Mensuration</Link>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-indigo-200 font-medium mb-1">More Topics</h3>
              <Link to="/topic/linear-patterns" className="hover:text-indigo-300 transition-colors">Linear Patterns</Link>
              <Link to="/topic/angles" className="hover:text-indigo-300 transition-colors">Angles</Link>
              <Link to="/topic/trigonometry" className="hover:text-indigo-300 transition-colors">Trigonometry</Link>
            </div>
            <div className="flex flex-col space-y-2 col-span-2 md:col-span-1">
              <h3 className="text-indigo-200 font-medium mb-1">Resources</h3>
              <Link to="/resources" className="hover:text-indigo-300 transition-colors">Study Materials</Link>
              <a href="https://www.corbettmaths.com/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">Corbett Maths</a>
              <a href="https://www.mathsgenie.co.uk/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">Maths Genie</a>
              <a href="https://wkhhcetm.manus.space/" target="_blank" rel="noopener noreferrer" className="text-indigo-300/30 hover:text-indigo-300/50 transition-colors"></a>
              <a href="https://qkvtywkg.manus.space/" target="_blank" rel="noopener noreferrer" className="text-indigo-300/30 hover:text-indigo-300/50 transition-colors"> 2</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-indigo-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-indigo-300">&copy; {currentYear} Form 3 Mathematics. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-indigo-300 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-indigo-300 hover:text-white transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
        
        {/* Made by Mr. NASCIMENTO */}
        <div className="text-center mt-6">
          <motion.p 
            className="text-lg font-serif tracking-wide text-indigo-200 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            Made by Mr. NASCIMENTO
          </motion.p>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180">
        <svg 
          className="relative block w-full h-[30px]" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.11,101.47,118.75,86.39,162.77,66.28Z" 
            className="fill-gray-50"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;

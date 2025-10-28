import React, { useEffect, useState } from 'react';
interface SplashScreenProps {
  onLoadingComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onLoadingComplete, 500);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center z-[9999] font-sans overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E')] animate-grain"></div>
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] text-4xl opacity-30 animate-float">🎬</div>
          <div className="absolute top-[70%] left-[85%] text-4xl opacity-30 animate-float delay-[1.5s]">🍿</div>
          <div className="absolute top-[80%] left-[15%] text-4xl opacity-30 animate-float delay-[3s]">🎫</div>
          <div className="absolute top-[25%] left-[80%] text-4xl opacity-30 animate-float delay-[4.5s]">📷</div>
        </div>
      </div>

      <div className="text-center z-10 max-w-[600px] p-8">
        <div className="mb-12">
          <div className="text-4xl mb-4 block animate-pulse">🎭</div>
          <h1 className="text-[3.5rem] font-bold tracking-[2px] m-0 mb-2 bg-gradient-to-r from-[#ff6b6b] via-[#feca57] via-[#48dbfb] to-[#ff9ff3] bg-[length:300%_300%] bg-clip-text text-transparent animate-gradient-shift">CineCollection</h1>
          <p className="text-lg text-gray-300 font-light">Your Personal Media Library</p>
        </div>

        {/* Loading Animation */}
        <div className="text-center">
          <div className="relative h-8 mb-4">
            <div className="flex justify-center gap-4">
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-400"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-600"></div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.3),transparent)] before:animate-shimmer"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="mt-4 text-gray-300 text-sm font-light">
            {progress < 30 && "Preparing your cinematic experience..."}
            {progress >= 30 && progress < 60 && "Loading your collection..."}
            {progress >= 60 && progress < 90 && "Setting up the stage..."}
            {progress >= 90 && "Almost ready..."}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex justify-center gap-8 mt-12">
          <div className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
            <span className="block text-xl mb-2">➕</span>
            <span>Add Movies & Shows</span>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
            <span className="block text-xl mb-2">📊</span>
            <span>Track Details</span>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
            <span className="block text-xl mb-2">∞</span>
            <span>Infinite Scroll</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
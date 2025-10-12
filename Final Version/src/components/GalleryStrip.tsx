import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';

export const GalleryStrip = () => {
  // Use your 4 videos for 6 slots (repeat 2 videos)
  const videos = [
    '/1.mp4',
    '/2.mp4', 
    '/3.mp4',
    '/4.mp4',
    '/1.mp4', // Repeat first video
    '/2.mp4'  // Repeat second video
  ];

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenVideoSrc, setFullscreenVideoSrc] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (video && !isFullscreen) {
      video.play();
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video && !isFullscreen) {
      video.pause();
      video.currentTime = 0; // Reset to beginning
    }
    setHoveredIndex(null);
  };

  const handleVideoClick = (src: string) => {
    setFullscreenVideoSrc(src);
    setIsFullscreen(true);
    // Pause all gallery videos
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenVideoSrc('');
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
      fullscreenVideoRef.current.currentTime = 0;
    }
  };

  const handleFullscreenVideoClick = () => {
    if (fullscreenVideoRef.current) {
      if (fullscreenVideoRef.current.paused) {
        fullscreenVideoRef.current.play();
      } else {
        fullscreenVideoRef.current.pause();
      }
    }
  };

  return (
    <>
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 px-4 justify-center items-center">
            {videos.map((src, i) => {
              const isHovered = hoveredIndex === i;
              const isBeforeHovered = hoveredIndex !== null && i < hoveredIndex;
              const isAfterHovered = hoveredIndex !== null && i > hoveredIndex;
              
              return (
                <div
                  key={i}
                  className={`
                    flex-none transition-all duration-300 ease-in-out relative h-36 flex items-center justify-center
                    ${isHovered ? 'scale-[1.8] z-20 mx-8' : 'scale-100 z-10'}
                    ${isBeforeHovered ? 'transform -translate-x-4' : ''}
                    ${isAfterHovered ? 'transform translate-x-4' : ''}
                    ${hoveredIndex !== null && !isHovered ? 'opacity-70' : 'opacity-100'}
                  `}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={src}
                  className={`
                    h-20 w-32 object-cover rounded-lg border border-border/30 cursor-pointer 
                    transition-all duration-300
                    ${isHovered ? 'shadow-2xl shadow-black/50' : ''}
                  `}
                  muted
                  loop
                  preload="metadata"
                  playsInline
                  onClick={() => handleVideoClick(src)}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          {/* Close Button - Top Right */}
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-200 z-60"
            aria-label="Close fullscreen"
          >
            <X size={32} />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
            {/* Fullscreen Video */}
            <video
              ref={fullscreenVideoRef}
              src={fullscreenVideoSrc}
              className="max-w-full max-h-full object-contain cursor-pointer rounded-lg"
              controls
              autoPlay
              loop
              onClick={(e) => {
                e.stopPropagation();
                handleFullscreenVideoClick();
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

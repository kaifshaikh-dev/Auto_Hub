import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const VehicleGallery = ({ images, video }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allMedia = [...(images || [])];
  if (video) {
    allMedia.push({ type: 'video', url: video });
  } else {
    // Convert to objects for consistency
    allMedia.forEach((img, i) => { allMedia[i] = { type: 'image', url: img } });
  }

  // Fallback if no media
  if (!allMedia || allMedia.length === 0) {
    return (
      <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  const handlePrevious = (e) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? allMedia.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const isLastSlide = currentIndex === allMedia.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const renderMedia = (media, className = "") => {
    if (media.type === 'video') {
      return (
        <video 
          controls 
          className={`w-full h-full object-contain bg-black ${className}`}
          src={media.url}
        />
      );
    }
    return (
      <img 
        src={media.url || media} 
        alt="Vehicle" 
        className={`w-full h-full object-contain ${className}`}
      />
    );
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div 
        className="relative aspect-[16/9] md:aspect-[21/9] bg-black rounded-xl overflow-hidden group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {renderMedia(allMedia[currentIndex])}
        
        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <button 
              onClick={handlePrevious}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-3 overflow-x-auto mt-4 pb-2 hide-scrollbar">
          {allMedia.map((media, index) => (
            <div 
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${
                currentIndex === index ? 'ring-2 ring-primary-500 opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              {media.type === 'video' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-xs">Video</div>
              ) : (
                <img src={media.url || media} alt="Thumbnail" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="w-full max-w-6xl px-4 flex items-center">
            {allMedia.length > 1 && (
              <button 
                onClick={handlePrevious}
                className="text-white/70 hover:text-white p-2 md:p-4 mr-2 md:mr-4 ml-auto"
              >
                <ChevronLeft size={40} strokeWidth={1.5} />
              </button>
            )}
            
            <div className="w-full flex-grow max-h-[85vh] flex justify-center items-center">
               {renderMedia(allMedia[currentIndex], "max-h-[85vh] rounded-lg shadow-2xl")}
            </div>

            {allMedia.length > 1 && (
              <button 
                onClick={handleNext}
                className="text-white/70 hover:text-white p-2 md:p-4 ml-2 md:mr-auto"
              >
                <ChevronRight size={40} strokeWidth={1.5} />
              </button>
            )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 bg-black/50 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
            {currentIndex + 1} / {allMedia.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleGallery;

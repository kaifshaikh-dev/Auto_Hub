import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const loaderClass = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600";
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
        <div className={loaderClass}></div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-12">
      <div className={loaderClass}></div>
    </div>
  );
};

export default Loader;

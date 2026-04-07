import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-grow min-h-[calc(100vh-64px)] w-full text-white overflow-hidden py-16 md:py-24">

        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Dealership"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle dark gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>

        {/* Content - Perfectly Centered */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-8 max-w-5xl mx-auto w-full">

          <h2 className="text-xs sm:text-sm md:text-base text-gray-400 font-semibold tracking-[0.4em] uppercase mb-6 sm:mb-8 drop-shadow-md">
            PREMIUM AUTO DEALER
          </h2>

          {/* Modern Premium Font for Title */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter text-white mb-8 sm:mb-10 drop-shadow-2xl font-serif">
            AutoHub
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 font-light max-w-3xl leading-relaxed mb-12 sm:mb-16 drop-shadow-lg">
            Explore a wide range of verified second-hand cars and two-wheelers at affordable prices.
          </p>

          {/* Premium Call-to-Action Button */}
          <Link
            to="/vehicles"
            className="group relative inline-flex items-center justify-center px-10 py-4 sm:px-14 sm:py-5 text-sm sm:text-base font-bold tracking-[0.2em] text-white uppercase transition-all duration-300 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transform hover:-translate-y-1"
          >
            <span>SEE VEHICLES</span>
          </Link>

        </div>
      </section>
    </div>
  );
};

export default Home;


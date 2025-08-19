// import React from 'react';

// function Home() {
//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-3xl text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Shop</h1>
//         <p className="text-gray-600 text-lg">
//           Welcome To Ecommerce Shop
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useState, useEffect } from 'react';

// The main App component that contains the slider.
// The entire application is self-contained within this one component.
export default function Home() {
  // Define an array of slide objects. Each object has a title, description, and image URL.
  // Using placehold.co for simple, customizable placeholder images.
  const slides = [
    {
      title: 'Experience the Future',
      description: 'Discover our latest collection of innovative gadgets.',
      imageUrl: 'https://placehold.co/1200x600/1e40af/ffffff?text=Slide+1'
    },
    {
      title: 'Unleash Your Creativity',
      description: 'Find the perfect tools for your next big project.',
      imageUrl: 'https://placehold.co/1200x600/1d4ed8/ffffff?text=Slide+2'
    },
    {
      title: 'Sustainable Living',
      description: 'Explore eco-friendly products that make a difference.',
      imageUrl: 'https://placehold.co/1200x600/3b82f6/ffffff?text=Slide+3'
    },
  ];

  // State to track the current slide index.
  const [currentSlide, setCurrentSlide] = useState(0);

  // useEffect hook to handle auto-sliding functionality.
  useEffect(() => {
    // Set an interval to advance the slide every 5 seconds (5000ms).
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
   
    return () => clearInterval(intervalId);
  }, [slides.length]); // The effect re-runs only if the number of slides changes.

  // Function to move to the next slide.
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  // Function to move to the previous slide.
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  // Function to directly jump to a specific slide using dot indicators.
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    // Main container with a background color and font family.
    <div className="bg-gray-100 font-sans min-h-screen pt-8">
      {/* Main slider container. */}
      <div className="relative w-full max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden">
        {}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-96 object-cover"
              />
              {/* Overlay with text content for each slide. */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-200">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
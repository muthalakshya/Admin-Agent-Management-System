import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-l from-blue-300 to-red-200 shadow z-10 relative">
      {/* Desktop Navigation */}
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">
            Agent Management System
          </h2>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button 
          className="md:hidden p-2 text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-red-700 font-medium">Admin User</span>
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
              alt="User profile"
            />
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1 text-sm text-red-600 border font-semibold border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="px-4 py-3 flex flex-col space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full object-cover mr-2"
                  src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                  alt="User profile"
                />
                <span className="text-violet-700 font-medium">Admin User</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 border font-semibold border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
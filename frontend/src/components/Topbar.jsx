import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes, FaShoppingCart, FaHome, FaBoxOpen, FaClipboardList, FaSignInAlt, FaUserPlus } from "react-icons/fa";

function Topbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Use a different state for the unauthenticated dropdown
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const authMenuRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setIsAuthMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [authMenuRef]);

  // Combined menu toggle function
  const toggleAuthMenu = () => {
    setIsAuthMenuOpen(!isAuthMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md shadow-md z-50 transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          EShop
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-gray-900 flex items-center space-x-1">
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-gray-900 flex items-center space-x-1">
            <FaBoxOpen /> <span>Products</span>
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-gray-900 flex items-center space-x-1">
            <FaShoppingCart /> <span>Cart</span>
          </Link>
        </div>

        {/* User and Auth Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative" onMouseEnter={() => setIsUserMenuOpen(true)} onMouseLeave={() => setIsUserMenuOpen(false)}>
              <div className="flex items-center space-x-2 cursor-pointer">
                <FaUserCircle className="text-gray-700 text-2xl" />
                <span className="hidden md:inline text-gray-700">{user.email}</span>
              </div>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link to="/my-products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <FaBoxOpen /> <span>My Products</span>
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <FaClipboardList /> <span>Orders</span>
                  </Link>
                  {user.is_staff && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 flex items-center space-x-2">
                      <FaUserCircle /> <span>Admin</span>
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={authMenuRef}>
              <button
                onClick={toggleAuthMenu}
                className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-gray-900 text-2xl"
              >
                <FaUserCircle />
              </button>
              {isAuthMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2" onClick={() => setIsAuthMenuOpen(false)}>
                    <FaSignInAlt /> <span>Login</span>
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2" onClick={() => setIsAuthMenuOpen(false)}>
                    <FaUserPlus /> <span>Signup</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-md px-4 pb-4">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-gray-700 hover:text-gray-900 py-1 flex items-center space-x-1">
              <FaHome /> <span>Home</span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900 py-1 flex items-center space-x-1">
              <FaBoxOpen /> <span>Products</span>
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-gray-900 py-1 flex items-center space-x-1">
              <FaShoppingCart /> <span>Cart</span>
            </Link>
            {user && (
              <>
                <Link to="/my-products" className="text-gray-700 hover:text-gray-900 py-1 flex items-center space-x-1">
                  <FaBoxOpen /> <span>My Products</span>
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-gray-900 py-1 flex items-center space-x-1">
                  <FaClipboardList /> <span>Orders</span>
                </Link>
                {user.is_staff && (
                  <Link to="/admin" className="text-gray-700 hover:text-gray-900 py-1 flex items-center space-x-1">
                    <FaUserCircle /> <span>Admin</span>
                  </Link>
                )}
                <button onClick={logout} className="text-left text-red-600 hover:text-red-800 py-1">
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 py-1">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm text-center">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Topbar;
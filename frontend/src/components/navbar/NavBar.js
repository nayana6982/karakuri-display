import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition">
              TIEI
            </Link>
            <Link to="/part" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
              Create Part
            </Link>
            <Link to="/edit-part" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
             Edit Part
            </Link>
             <Link to="/part-list" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
              List Parts 
            </Link>
              <Link to="/scan" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
              Scan Part
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;



import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`bg-gray-800 bg-gradient-to-b from-blue-100 to-purple-300 text-black transition-all duration-300 ${expanded ? 'w-64' : 'w-20'} min-h-screen`}>
      <div className="p-4 flex items-center justify-between">
        {expanded ? (
          <h1 className="text-xl font-bold text-red-600">Agent Dashboard</h1>
        ) : (
          <h1 className="text-xl font-bold text-red-600">AD</h1>
        )}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-red-700 p-1 rounded-full hover:bg-blue-700 hover:text-white"
        >
          {expanded ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      <div className="mt-8">
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-blue-200 text-red-600' : 'hover:bg-red-400 hover:text-white'} transition-colors`
          }
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-6h6" />
          </svg>
          {expanded && <span className="ml-3">Dashboard</span>}
        </NavLink>
        
        <div className="mt-2">
          <h3 className={`px-4 py-2 text-xs uppercase tracking-wider text-purple-900 ${!expanded && 'text-center'}`}>
            {expanded ? 'Agent Management' : 'AM'}
          </h3>
          
          <NavLink 
            to="/agents/add" 
            className={({isActive}) => 
              `flex items-center py-3 px-4 ${isActive ? 'bg-blue-200 text-red-600' : 'hover:bg-red-400 hover:text-white'} transition-colors`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {expanded && <span className="ml-3">Add Agent</span>}
          </NavLink>
          
          <NavLink 
            to="/agents/view" 
            className={({isActive}) => 
              `flex items-center py-3 px-4 ${isActive ? 'bg-blue-200 text-red-600' : 'hover:bg-red-400 hover:text-white'} transition-colors`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {expanded && <span className="ml-3">View Agents</span>}
          </NavLink>
        </div>
        
        <div className="mt-2">
          <h3 className={`px-4 py-2 text-xs uppercase tracking-wider text-purple-900 ${!expanded && 'text-center'}`}>
            {expanded ? 'List Management' : 'LM'}
          </h3>
          
          <NavLink 
            to="/lists/distribute" 
            className={({isActive}) => 
              `flex items-center py-3 px-4 ${isActive ? 'bg-blue-200 text-red-600' : 'hover:bg-red-400 hover:text-white'} transition-colors`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 112 0v2m0 0h2" />
            </svg>
            {expanded && <span className="ml-3">Upload & Distribute Lists</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const [agents, setAgents] = useState(0);
    const [distributes , setDistributes] = useState(0);
  // Sample statistics for demo
  const stats = [
    { title: "Total Agents", value: agents, icon: "users", bgColor: "bg-blue-500" },
    { title: "Active Lists", value: agents, icon: "clipboard", bgColor: "bg-green-500" },
    { title: "Distributed Today", value: distributes, icon: "chart-bar", bgColor: "bg-purple-500" },
  ];
  
  const recentActivities = [
    { action: "New agent added", user: "Admin", time: "2 minutes ago" },
    { action: "List 'March Leads' uploaded", user: "Admin", time: "1 hour ago" },
    { action: "List distributed to 8 agents", user: "Admin", time: "3 hours ago" },
    { action: "Agent John completed list", user: "John Doe", time: "5 hours ago" }
  ];
  
  const renderIcon = (icon) => {
    switch(icon) {
      case 'users':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'chart-bar':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/agent/list-agent`);
      if (response.data.success) {
        setAgents(response.data.agent.length);
      } else {
        toast.error('Failed to fetch agents');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Error fetching agents. Please try again.');
    }
  };

  useEffect(()=>{
    fetchAgents()
    console.log(agents)
    setDistributes(localStorage.getItem("distribute"))
  },[backendUrl, agents, distributes])
  
  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto bg-gradient-to-l from-red-200 to-blue-200">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome to your agent management dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} rounded-lg p-2 sm:p-3 text-white mr-3 sm:mr-4`}>
                {renderIcon(stat.icon)}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Add Agent Card */}
        <Link to="/agents/add" className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6 transition-all hover:shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 text-blue-500 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Add Agent</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Register a new agent in the system</p>
          </div>
        </Link>
        
        {/* View Agents Card */}
        <Link to="/agents/view" className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6 transition-all hover:shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 text-green-500 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1">View Agents</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Manage and view all agents</p>
          </div>
        </Link>
        
        {/* Distribute Lists Card */}
        <Link to="/lists/distribute" className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6 transition-all hover:shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="bg-yellow-100 text-yellow-500 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 112 0v2m0 0h2" />
              </svg>
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Upload & Distribute</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Assign lists to agents</p>
          </div>
        </Link>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Recent Activity</h2>
        <div className="divide-y">
          {recentActivities.map((activity, index) => (
            <div key={index} className="py-2 sm:py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-1 sm:mb-0">
                <p className="font-medium text-sm sm:text-base">{activity.action}</p>
                <p className="text-xs sm:text-sm text-gray-500">By {activity.user}</p>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
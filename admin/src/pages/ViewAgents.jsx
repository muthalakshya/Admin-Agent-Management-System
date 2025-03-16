import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    setFilteredAgents(
      agents.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phoneNumber.includes(searchTerm)
      )
    );
  }, [searchTerm, agents]);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/agent/list-agent`);
      if (response.data.success) {
        setAgents(response.data.agent);
        setFilteredAgents(response.data.agent);
      } else {
        toast.error('Failed to fetch agents');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    
    try {
      const response = await axios.post(`${backendUrl}/api/agent/remove-agent`,{id});
      if (response.data.success) {
        toast.success('Agent deleted successfully!');
        fetchAgents();
      } else {
        toast.error(response.data.message || 'Failed to delete agent');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl bg-gradient-to-l from-blue-200 to-red-200 m-6">
      {/* Fixed header section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">All Agents</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <Link 
              to="/agents/add" 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:scale-105 transition-all whitespace-nowrap w-full sm:w-auto text-center"
            >
              Add Agent
            </Link>
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto p-4 mb-20">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg flex flex-col justify-center items-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No agents found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'No agents match your search criteria' : 'Get started by adding your first agent'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link 
                  to="/add-agent" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:scale-105 transition-all"
                >
                  Add Agent
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg table-fixed md:table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-1/4">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-1/3">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-1/4">Phone Number</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800 truncate">{agent.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 truncate">{agent.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 truncate">{agent.phoneNumber}</td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link 
                          to={`/edit-agent/${agent._id}`}
                          className="p-1.5 bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-all"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </Link>
                        <button 
                          className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-all"
                          title="Delete"
                          onClick={() => handleDelete(agent._id)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAgents;
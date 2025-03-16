import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Papa from 'papaparse'; // For CSV parsing
import * as XLSX from 'xlsx'; // For Excel parsing

const DistributeLists = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [uploadedData, setUploadedData] = useState(false);
  const [agents, setAgents] = useState([]);
  const [distributedLists, setDistributedLists] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'results'

  // You may need to set your backend URL in an environment variable or config file
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Fetch all agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/agent/list-agent`);
      if (response.data.success) {
        setAgents(response.data.agent);
      } else {
        toast.error('Failed to fetch agents');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Error fetching agents. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file extension
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setError('Please upload only CSV, XLSX or XLS files');
      setFile(null);
      setFileName('No file chosen');
      return;
    }
    
    setError(null);
    setFile(selectedFile);
    setFileName(selectedFile.name);
    parseFile(selectedFile);
  };

  const parseFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          validateAndSetData(results.data);
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error}`);
        }
      });
    } else {
      // Parse Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          validateAndSetData(jsonData);
        } catch (error) {
          setError(`Error parsing Excel file: ${error}`);
        }
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsBinaryString(file);
    }
  };

  const validateAndSetData = (data) => {
    if (!data || data.length === 0) {
      setError('The file is empty');
      return;
    }

    // Check if the file has the required columns
    const requiredColumns = ['FirstName', 'Phone', 'Notes'];
    const firstRow = data[0];
    
    const missingColumns = requiredColumns.filter(col => 
      !Object.keys(firstRow).some(key => 
        key.toLowerCase() === col.toLowerCase()
      )
    );
    
    if (missingColumns.length > 0) {
      setError(`Missing required columns: ${missingColumns.join(', ')}`);
      return;
    }
    
    // Normalize column names (case insensitive)
    const normalizedData = data.map(row => {
      const newRow = {};
      Object.keys(row).forEach(key => {
        if (key.toLowerCase() === 'firstname') newRow.FirstName = row[key];
        else if (key.toLowerCase() === 'phone') newRow.Phone = row[key];
        else if (key.toLowerCase() === 'notes') newRow.Notes = row[key];
      });
      return newRow;
    });
    
    setParsedData(normalizedData);
    setUploadedData(true);
    setError(null);
  };

  const distributeItems = (items, agentCount) => {
    if (agentCount === 0) return [];
    
    // Create an array of empty arrays for each agent
    const distribution = Array(agentCount).fill().map(() => []);
    
    // Distribute items equally
    items.forEach((item, index) => {
      const agentIndex = index % agentCount;
      distribution[agentIndex].push(item);
    });
    
    return distribution;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    if (parsedData.length === 0) {
      setError('No valid data to distribute');
      return;
    }
    
    if (agents.length === 0) {
      setError('No agents available for distribution');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Distribute items
      const distributedData = distributeItems(parsedData, agents.length);
      
      // Prepare data for backend
      const distributionPayload = agents.map((agent, index) => ({
        agentId: agent._id,
        agentName: agent.name,
        items: distributedData[index] || []
      }));
      
      // Send to backend
      const response = await axios.post(`${backendUrl}/api/list/distribute`, {
        distribution: distributionPayload
      });
      
      if (response.data.success) {
        toast.success('Lists distributed successfully!');
        setDistributedLists(distributionPayload);
        setIsUploading(false);
        setActiveTab('results');
        localStorage.setItem("distribute",parsedData.length)
      } else {
        throw new Error(response.data.message || 'Failed to distribute lists');
      }
    } catch (error) {
      console.error('Error distributing lists:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Network error. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName('No file chosen');
    setParsedData([]);
    setUploadedData(false);
    setDistributedLists([]);
    setError(null);
    setActiveTab('upload');
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow p-6 bg-gradient-to-b from-purple-100 to-red-200">
      <div className="bg-gradient-to-l from-blue-200 to-red-200 p-4 rounded-t-lg">
        <h2 className="text-xl font-bold text-gray-800">Upload & Distribute Lists</h2>
      </div>
      
      {/* Tabs for better dashboard integration */}
      {distributedLists.length > 0 && (
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'results' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Results
          </button>
        </div>
      )}
      
      <div className="flex-1 p-4 overflow-y-auto">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded text-sm">
            {error}
          </div>
        )}
        
        {activeTab === 'results' && distributedLists.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded text-sm">
              Lists distributed successfully! {parsedData.length} items have been distributed among {agents.length} agents.
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {distributedLists.map((list, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <h4 className="font-medium text-blue-600 flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    {list.agentName}
                    <span className="ml-2 text-xs text-gray-500">({list.items.length} items)</span>
                  </h4>
                  
                  {list.items.length > 0 ? (
                    <div className="mt-2 overflow-x-auto max-h-40">
                      <table className="min-w-full bg-white text-xs">
                        <thead className="sticky top-0 bg-gray-100">
                          <tr>
                            <th className="py-1 px-2 border-b border-gray-200 text-left font-medium text-gray-600">Name</th>
                            <th className="py-1 px-2 border-b border-gray-200 text-left font-medium text-gray-600">Phone</th>
                            <th className="py-1 px-2 border-b border-gray-200 text-left font-medium text-gray-600">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.items.map((item, itemIndex) => (
                            <tr key={itemIndex} className={itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="py-1 px-2 border-b border-gray-200">{item.FirstName}</td>
                              <td className="py-1 px-2 border-b border-gray-200">{item.Phone}</td>
                              <td className="py-1 px-2 border-b border-gray-200 max-w-xs truncate">{item.Notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-500 mt-2">No items assigned</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                Upload Another File
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Upload CSV or Excel File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-all">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Drag & drop file here, or</p>
                    <label className="mt-1 cursor-pointer">
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all inline-block">
                        Browse Files
                      </span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".csv,.xlsx,.xls" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Supported formats: CSV, XLSX, XLS</p>
                </div>
              </div>
              
              {file && (
                <div className="flex items-center justify-between p-2 mt-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{fileName}</p>
                      <p className="text-xs text-gray-500">{parsedData.length} records found</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {uploadedData && (
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">File Preview</h3>
                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-32">
                  <table className="min-w-full bg-white text-xs">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="py-1 px-2 border-b border-gray-200 text-left font-medium text-gray-600">Name</th>
                        <th className="py-1 px-2 border-b border-gray-200 text-left font-medium text-gray-600">Phone</th>
                        <th className="py-1 px-2 border-b border-gray-200 text-left font-medium text-gray-600">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 5).map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-1 px-2 border-b border-gray-200">{item.FirstName}</td>
                          <td className="py-1 px-2 border-b border-gray-200">{item.Phone}</td>
                          <td className="py-1 px-2 border-b border-gray-200 max-w-xs truncate">{item.Notes}</td>
                        </tr>
                      ))}
                      {parsedData.length > 5 && (
                        <tr>
                          <td colSpan="3" className="py-1 px-2 border-b border-gray-200 text-center italic text-gray-500">
                            + {parsedData.length - 5} more records
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center mt-2 bg-blue-50 p-2 rounded text-xs">
                  <svg className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-blue-700">
                    Records will be distributed among <strong>{agents.length}</strong> agents.
                    {agents.length > 0 && (
                      <>
                        {" "}Each agent will receive approximately <strong>{Math.ceil(parsedData.length / agents.length)}</strong> records.
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading || !file || parsedData.length === 0}
                className={`w-full bg-gradient-to-r from-blue-200 to-red-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${(isUploading || !file || parsedData.length === 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Distribute Lists'
                )}
              </button>
            </div>

            {agents.length === 0 && (
              <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded text-xs">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-yellow-700">
                      No agents available. Please add agents before distributing lists.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-2 bg-gray-50 p-2 rounded text-xs">
              <h4 className="font-medium text-gray-700 mb-1">Requirements:</h4>
              <ul className="text-gray-600 space-y-1 list-disc pl-4">
                <li>File must be in CSV, XLSX, or XLS format</li>
                <li>File must contain columns: FirstName, Phone, and Notes</li>
                <li>At least one agent must be available for distribution</li>
              </ul>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DistributeLists;

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    countryCode: '+1',
    password: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // You may need to set your backend URL in an environment variable or config file
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      const { name, email, phoneNumber, countryCode, password } = formData;
      const fullPhoneNumber = countryCode + phoneNumber;
      
      const response = await axios.post(backendUrl + '/api/agent/add-agent', {
        name,
        email,
        phoneNumber: fullPhoneNumber,
        password
      });
      
      if(response.data.success){
        toast.success('Agent added successfully!');
        
        setFormStatus({ 
          isSubmitting: false, 
          isSubmitted: true, 
          error: null 
        });
        
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          countryCode: '+1',
          password: ''
        });
        
        setTimeout(() => {
          setFormStatus(prev => ({ ...prev, isSubmitted: false }));
        }, 3000);
      } else {
        toast.error(response.data.message || 'Failed to add agent');
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          error: response.data.message || 'Failed to add agent'
        });
      }
    } catch (error) {
      console.error('Error adding agent:', error);
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
      toast.error(errorMessage);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: errorMessage
      });
    }
  };

  const countryCodes = [
    { code: '+1', country: '🇺🇸 United States' },
    { code: '+44', country: '🇬🇧 United Kingdom' },
    { code: '+91', country: '🇮🇳 India' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+86', country: '🇨🇳 China' },
    { code: '+49', country: '🇩🇪 Germany' },
    { code: '+33', country: '🇫🇷 France' },
    { code: '+81', country: '🇯🇵 Japan' },
  ];

  return (
    // Removed min-h-screen to better fit within dashboard context
    // Changed from fixed size to responsive sizing
    <div className="w-auto justify-center  m-6 bg-gradient-to-l from-blue-200 to-red-200 rounded-2xl">
      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="bg-gradient-to-l from-blue-200 to-red-200 p-3 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">Add Agent</h2>
        </div>
        
        <div className="p-4">
          {formStatus.isSubmitted && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
              Agent added successfully!
            </div>
          )}
          
          {formStatus.error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
              {formStatus.error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-20 px-1 py-2 rounded-l border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                >
                  {countryCodes.map(item => (
                    <option key={item.code} value={item.code}>
                      {item.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-r border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Phone number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Create a password"
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {passwordVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={formStatus.isSubmitting}
                className={`w-full bg-gradient-to-l from-blue-200 to-red-200 text-black font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${formStatus.isSubmitting ? 'opacity-70' : 'hover:bg-blue-600'}`}
              >
                {formStatus.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Add Agent'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAgent;
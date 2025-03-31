import React, { useState } from 'react';
import { useAppDispatch } from '../../state/hooks';
import { login } from '../../state/reducers/userReducer';

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    dispatch(login(name.trim()));
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">ENTERPRISE SYSTEMS</h1>
          <p className="text-gray-400 text-sm">MegaCorp Development Environment</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Employee Name
            </label>
            <input
              type="text"
              id="name"
              autoComplete="name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              By logging in, you agree to abide by MegaCorp's monitoring policies.
              All activity is recorded and may be reviewed by management.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

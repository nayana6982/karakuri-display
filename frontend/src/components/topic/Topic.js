import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopicPage = () => {
  const navigate = useNavigate();

   return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">What would you like to do?</h1>

      <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-center">
        <button
          onClick={() => navigate('/create-topic/new')}
          className="px-6 py-4 bg-green-500 text-white rounded-lg text-lg font-medium shadow-lg hover:bg-green-600 transition"
        >
          ➕ Create New Topic
        </button>

        <button
          onClick={() => navigate('/create-topic/edit')}
          className="px-6 py-4 bg-yellow-500 text-white rounded-lg text-lg font-medium shadow-lg hover:bg-yellow-600 transition"
        >
          🛠️ Edit Existing Topic
        </button>

        <button
          onClick={() => navigate('/create-topic/manage')}
          className="px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-medium shadow-lg hover:bg-blue-600 transition"
        >
          🔧 Manage Topics
        </button>
      </div>
    </div>
  );
};

export default TopicPage;

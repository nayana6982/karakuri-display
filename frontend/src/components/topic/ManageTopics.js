import { useState, useEffect } from 'react';

const ManageTopic = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.82.126.73:6512/api/parts');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setParts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchParts}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Parts Management</h1>
            <p className="text-gray-600 mt-1">Total parts: {parts.length}</p>
          </div>
          
          <div className="overflow-hidden">
            {parts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No parts found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Part Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((part, index) => (
                      <tr 
                        key={part.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-6 text-gray-900 font-medium">{part.id}</td>
                        <td className="py-4 px-6 text-gray-900">{part.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTopic;
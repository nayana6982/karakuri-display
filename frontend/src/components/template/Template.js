import React from 'react';
import { Cog, Factory, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const navigate = useNavigate();

  // Navigate directly to Scan Part page
  const goToCompanyPortal = () => {
    navigate('/company#scan'); // <-- direct jump to Scan Part page
  };

  const goToKarakuriPortal = () => {
    navigate('/karakuri');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 text-center">
          {/* Spinning Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <div className="bg-blue-600 p-4 rounded-full">
                <Cog
                  className="h-12 w-12 text-white animate-spin"
                  style={{ animationDuration: '8s' }}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-12">
            Welcome to the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">
              Engine Parts Portal
            </span>
          </h1>

          {/* Two clickable cards */}
          <div className="flex flex-col md:flex-row justify-center gap-10 px-6">
            {/* Company Portal Card */}
            <div
              onClick={goToCompanyPortal}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer p-8 max-w-sm w-full border border-gray-100 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                <Factory className="h-16 w-16 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Defect Part Portal 
              </h2>
              <p className="text-gray-600">
                Access the main company system including Create Part, Scan Part,
                and other production tools.
              </p>
            </div>

            {/* Karakuri Portal Card */}
            <div
              onClick={goToKarakuriPortal}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer p-8 max-w-sm w-full border border-gray-100 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                <Cpu className="h-16 w-16 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Karakuri Portal
              </h2>
              <p className="text-gray-600">
                Explore your custom Karakuri webpage for part visualization and smart
                data management.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Templates;



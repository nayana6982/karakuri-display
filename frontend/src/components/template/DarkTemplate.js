import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Play, Image, FileText, Video } from 'lucide-react';

const API_BASE = 'http://10.82.126.73:6512';

const DarkTemplate = ({ topicId }) => {
  const [topic, setTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [topicId]);

  const fetchData = async () => {
    try {
      // Fetch topic with all related data
      const topicRes = await fetch(`${API_BASE}/api/topics/${topicId}`);
      const topicResponse = await topicRes.json();
      
      if (topicResponse.success) {
        const { topic, subtopics, videos } = topicResponse.data;
        
        setTopic(topic);
        setSubtopics(subtopics || []);
        setVideos(videos || []);

        // Extract images from subtopics (they're already included)
        const imageMap = {};
        if (subtopics) {
          subtopics.forEach(subtopic => {
            imageMap[subtopic.id] = subtopic.images || [];
          });
        }
        setImages(imageMap);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      {topic && (
        <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-20 px-4">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {topic.title}
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">{topic.description}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Videos Showcase */}
        {videos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              Featured Videos
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <div key={video.id} className={`${index === 0 ? 'lg:col-span-2' : ''} relative group`}>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="aspect-video">
                      <video 
                        controls 
                        className="w-full h-full object-cover"
                        preload="metadata"
                      >
                        <source src={`http://10.82.126.73:6512/${video.file_path}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white">{video.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Subtopics Grid */}
        {subtopics.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Explore Topics
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {subtopics.map((subtopic, index) => {
                const subtopicImages = images[subtopic.id] || [];
                const isLarge = index % 4 === 0;
                
                return (
                  <div key={subtopic.id} className={`${isLarge ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl h-full">
                      {subtopicImages.length > 0 && (
                        <div className={`${isLarge ? 'h-64' : 'h-48'} overflow-hidden`}>
                          <img 
                            src={`http://10.82.126.73:6512/${subtopicImages[0].file_path}`} 
                            alt={subtopicImages[0].alt_text}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 text-amber-400">{subtopic.title}</h3>
                        <p className={`text-gray-300 leading-relaxed ${isLarge ? 'text-base' : 'text-sm line-clamp-4'}`}>
                          {subtopic.content}
                        </p>
                        
                        {subtopicImages.length > 1 && (
                          <div className="mt-4">
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                              {subtopicImages.slice(1, 4).map((image) => (
                                <img 
                                  key={image.id}
                                  src={`http://10.82.126.73:6512/${image.file_path}`} 
                                  alt={image.alt_text}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 hover:scale-110 transition-transform"
                                />
                              ))}
                              {subtopicImages.length > 4 && (
                                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-gray-400">+{subtopicImages.length - 4}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!topic && subtopics.length === 0 && videos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-600 mb-6">
              <FileText className="w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-4">No Content Available</h3>
            <p className="text-gray-500">This topic doesn't have any content to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default DarkTemplate;

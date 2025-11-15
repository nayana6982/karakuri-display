import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Play, Image, FileText, Video } from 'lucide-react';

const API_BASE = 'http://10.82.126.73:6512';

const GalaxyTemplate = ({ topicId }) => {
  const [topic, setTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSubtopics, setExpandedSubtopics] = useState(new Set());

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

  const toggleSubtopic = (subtopicId) => {
    const newExpanded = new Set(expandedSubtopics);
    if (newExpanded.has(subtopicId)) {
      newExpanded.delete(subtopicId);
    } else {
      newExpanded.add(subtopicId);
    }
    setExpandedSubtopics(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Topic Header */}
        {topic && (
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-slate-700/50">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {topic.title}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">{topic.description}</p>
            </div>
          </div>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-slate-700/50">
            <div className="flex items-center mb-6">
              <Video className="w-6 h-6 text-pink-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Videos</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 border border-slate-600/30">
                  <div className="aspect-video bg-slate-900 rounded-lg mb-3 overflow-hidden border border-slate-600/50">
                    <video 
                      controls 
                      className="w-full h-full object-cover rounded-lg"
                      preload="metadata"
                    >
                      <source src={`http://10.82.126.73:6512/${video.file_path}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <h3 className="font-semibold text-white">{video.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtopics Section */}
        {subtopics.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-emerald-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Subtopics</h2>
            </div>
            {subtopics.map((subtopic) => (
              <div key={subtopic.id} className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/70 transition-all duration-300">
                <div 
                  className="p-6 cursor-pointer hover:bg-slate-700/30 transition-all duration-300"
                  onClick={() => toggleSubtopic(subtopic.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{subtopic.title}</h3>
                    {expandedSubtopics.has(subtopic.id) ? 
                      <ChevronUp className="w-5 h-5 text-cyan-400" /> : 
                      <ChevronDown className="w-5 h-5 text-cyan-400" />
                    }
                  </div>
                </div>
                
                {expandedSubtopics.has(subtopic.id) && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-300 mb-6 leading-relaxed">{subtopic.content}</p>
                    
                    {images[subtopic.id] && images[subtopic.id].length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center mb-4">
                          <Image className="w-5 h-5 text-orange-400 mr-2" />
                          <h4 className="font-semibold text-slate-200">Related Images</h4>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {images[subtopic.id].map((image) => (
                            <div key={image.id} className="bg-slate-700/50 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50">
                              <img 
                                src={`http://10.82.126.73:6512/${image.file_path}`} 
                                alt={image.alt_text} 
                                className="w-full h-32 object-cover"
                              />
                              <div className="p-2">
                                <p className="text-xs text-slate-400 truncate">{image.alt_text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!topic && subtopics.length === 0 && videos.length === 0 && (
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center border border-slate-700/50">
            <div className="text-slate-500 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Content Available</h3>
            <p className="text-slate-400">This topic doesn't have any content yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalaxyTemplate;
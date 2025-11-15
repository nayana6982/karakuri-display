import React, { useState, useEffect } from 'react';
import { Play, Image, FileText, Video, X, ZoomIn } from 'lucide-react';

const API_BASE = 'http://10.82.126.73:6512';

const ImageModal = ({ isOpen, onClose, image, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <img
          src={imageUrl}
          alt={image.alt_text}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        {image.alt_text && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
            <p className="text-sm">{image.alt_text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CardTemplate = ({ topicId }) => {
  const [topic, setTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Topic Header */}
        {topic && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{topic.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">{topic.description}</p>
            </div>
          </div>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <Video className="w-6 h-6 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Videos</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-800 rounded-lg mb-3 overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-full object-cover rounded-lg"
                      preload="metadata"
                    >
                      <source src={`http://10.82.126.73:6512/${video.file_path}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <h3 className="font-semibold text-gray-800">{video.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtopics Section - Always Expanded */}
        {subtopics.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Subtopics</h2>
            </div>
            {subtopics.map((subtopic) => (
              <div key={subtopic.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{subtopic.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{subtopic.content}</p>
                  
                  {images[subtopic.id] && images[subtopic.id].length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center mb-4">
                        <Image className="w-5 h-5 text-purple-500 mr-2" />
                        <h4 className="font-semibold text-gray-700">Related Images</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images[subtopic.id].map((image) => (
                          <div 
                            key={image.id} 
                            className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group relative"
                            onClick={() => openImageModal(image)}
                          >
                            <div className="relative">
                              <img 
                                src={`http://10.82.126.73:6512/${image.file_path}`} 
                                alt={image.alt_text} 
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <div className="p-2">
                              <p className="text-xs text-gray-600 truncate">{image.alt_text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!topic && subtopics.length === 0 && videos.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Content Available</h3>
            <p className="text-gray-500">This topic doesn't have any content yet.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={isModalOpen}
        onClose={closeImageModal}
        image={selectedImage}
        imageUrl={selectedImage ? `http://10.82.126.73:6512/${selectedImage.file_path}` : ''}
      />
    </div>
  );
};

export default CardTemplate;
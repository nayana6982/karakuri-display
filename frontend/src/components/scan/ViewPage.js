import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Maximize2, X, Image, Video, FileText, AlertTriangle, Settings } from 'lucide-react';

const ViewPage = () => {
  const { partId } = useParams(); 
  const [partData, setPartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMedia, setModalMedia] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE = 'http://10.82.126.73:6512';

  
  useEffect(() => {
    const fetchPartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/parts/${partId}/complete`);
        if (!response.ok) throw new Error('Failed to fetch part data');
        const data = await response.json();
        setPartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartData();
  }, [partId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalMedia]);

  // Transform function/defect data to create media objects for the MediaViewer
  const transformFunctionDefectMedia = (item, type) => {
    const media = [];
    
    // Add image if exists
    if (item.image_file_name && item.image_file_path) {
      media.push({
        id: `${type}-${item.id}-image`,
        media_type: 'image',
        file_name: item.image_file_name,
        file_path: item.image_file_path,
        alt_text: item.image_alt_text
      });
    }
    
    // Add video if exists
    if (item.video_file_name && item.video_file_path) {
      media.push({
        id: `${type}-${item.id}-video`,
        media_type: 'video',
        file_name: item.video_file_name,
        file_path: item.video_file_path,
        alt_text: item.video_alt_text
      });
    }
    
    return media;
  };

  const MediaViewer = ({ media, context }) => {
    const [playingVideo, setPlayingVideo] = useState(null);

    const handleMediaClick = (mediaItem) => {
      setModalMedia(mediaItem);
    };

    const toggleVideo = (mediaId) => {
      setPlayingVideo(playingVideo === mediaId ? null : mediaId);
    };

    if (!media || media.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No media available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {item.media_type === 'image' ? (
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={`${API_BASE}/api/${item.file_path}`}
                  alt={item.alt_text || item.file_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleMediaClick(item)}
                    className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video bg-gray-900">
                <video
                  src={`${API_BASE}/api/${item.file_path}`}
                  className="w-full h-full object-cover"
                  controls={playingVideo === item.id}
                  poster={`${API_BASE}/api/${item.file_path}`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-300">
                    <button
                      onClick={() => toggleVideo(item.id)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300"
                    >
                      {playingVideo === item.id ? (
                        <Pause className="w-5 h-5 text-gray-800" />
                      ) : (
                        <Play className="w-5 h-5 text-gray-800" />
                      )}
                    </button>
                    <button
                      onClick={() => handleMediaClick(item)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300"
                    >
                      <Maximize2 className="w-5 h-5 text-gray-800" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1">
                {item.media_type === 'image' ? (
                  <Image className="w-4 h-4 text-blue-500" />
                ) : (
                  <Video className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium text-gray-700">{item.file_name}</span>
              </div>
              {item.alt_text && (
                <p className="text-xs text-gray-500 truncate">{item.alt_text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const Modal = ({ media, onClose }) => {
    if (!media) return null;

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4"
        onClick={handleBackdropClick}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
      >
        {/* Close button - positioned absolutely */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300"
          style={{ position: 'absolute' }}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        </button>
        
        {/* Media container */}
        <div 
          className="relative w-full h-full max-w-none max-h-none flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
        >
          {media.media_type === 'image' ? (
            <img
              src={`${API_BASE}/api/${media.file_path}`}
              alt={media.alt_text || media.file_name}
              className="max-w-full max-h-full object-contain"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '95vw',
                maxHeight: '85vh',
                objectFit: 'contain'
              }}
            />
          ) : (
            <video
              src={`${API_BASE}/api/${media.file_path}`}
              className="max-w-full max-h-full object-contain"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '95vw',
                maxHeight: '85vh',
                objectFit: 'contain'
              }}
              controls
              autoPlay
            />
          )}
          
          {/* Media info - positioned at bottom */}
          <div 
            className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-black bg-opacity-70 rounded-lg p-2 sm:p-4 text-white"
            style={{ position: 'absolute' }}
          >
            <h3 className="font-semibold text-sm sm:text-base truncate">{media.file_name}</h3>
            {media.alt_text && <p className="text-xs sm:text-sm text-gray-300 truncate">{media.alt_text}</p>}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading part data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!partData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No part data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">{partData.part.name}</h1>
            <p className="text-gray-600 mt-2">Part ID: {partData.part.id}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'functions', label: 'Functions', icon: Settings },
              { id: 'defects', label: 'Defects', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Assembly Videos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                Assembly Videos
              </h2>
              <MediaViewer
                media={partData.assemblyVideos?.map(video => ({
                  id: video.id,
                  media_type: 'video',
                  file_name: video.file_name,
                  file_path: video.file_path,
                  alt_text: video.alt_text
                })) || []}
                context="assembly_video"
              />
            </div>

            {/* Part Drawings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-500" />
                Part Drawings
              </h2>
              <MediaViewer
                media={partData.drawings?.map(drawing => ({
                  id: drawing.id,
                  media_type: 'image',
                  file_name: drawing.file_name,
                  file_path: drawing.file_path,
                  alt_text: drawing.alt_text
                })) || []}
                context="part_drawing"
              />
            </div>
          </div>
        )}

        {activeTab === 'functions' && (
          <div className="space-y-6">
            {!partData.functions || partData.functions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No functions defined for this part</p>
              </div>
            ) : (
              partData.functions.map((func) => (
                <div key={func.id} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Function
                  </h3>
                  <p className="text-gray-700 mb-6 whitespace-pre-wrap">{func.description}</p>
                  
                  {(() => {
                    const media = transformFunctionDefectMedia(func, 'function');
                    return media.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3">Media</h4>
                        <MediaViewer media={media} context="function" />
                      </div>
                    );
                  })()}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'defects' && (
          <div className="space-y-6">
            {!partData.defects || partData.defects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No defects defined for this part</p>
              </div>
            ) : (
              partData.defects.map((defect) => (
                <div key={defect.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Defect
                  </h3>
                  <p className="text-gray-700 mb-6 whitespace-pre-wrap">{defect.description}</p>
                  
                  {(() => {
                    const media = transformFunctionDefectMedia(defect, 'defect');
                    return media.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3">Media</h4>
                        <MediaViewer media={media} context="defect" />
                      </div>
                    );
                  })()}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal for enlarged media */}
      {modalMedia && (
        <Modal media={modalMedia} onClose={() => setModalMedia(null)} />
      )}
    </div>
  );
};

export default ViewPage;
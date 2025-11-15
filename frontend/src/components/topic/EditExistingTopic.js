import React, { useState, useEffect } from 'react';
import { Search, Save, Edit3, Image, Video, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const EditExistingTopic = () => {
  
  
  const API_BASE_URL = 'http://10.82.126.73:6512';
  
  // State management
  const [topicId, setTopicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [topicData, setTopicData] = useState(null);
  
  // Form states
  const [topicForm, setTopicForm] = useState({
    title: '',
    description: '',
    theme: 'card'
  });
  
  const [subtopicForms, setSubtopicForms] = useState([]);
  const [imageForms, setImageForms] = useState([]);
  const [videoForms, setVideoForms] = useState([]);
  
  // Fetch topic data by ID
  const fetchTopicData = async () => {
    if (!topicId.trim()) {
      setError('Please enter a topic ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Fetching topic with ID:', topicId);
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${textResponse.substring(0, 200)}...`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch topic');
      }
      
      const { topic, subtopics, videos } = data.data;
      
      // Set topic data
      setTopicData(data.data);
      setTopicForm({
        title: topic.title || '',
        description: topic.description || '',
        theme: topic.theme || 'card'
      });
      
      // Set subtopics data
      setSubtopicForms(subtopics.map(subtopic => ({
        id: subtopic.id,
        title: subtopic.title || '',
        content: subtopic.content || '',
        images: subtopic.images || []
      })));
      
      // Set videos data
      setVideoForms(videos.map(video => ({
        id: video.id,
        title: video.title || '',
        file_name: video.file_name || '',
        file_path: video.file_path || ''
      })));
      
      // Collect all images from subtopics
      const allImages = [];
      subtopics.forEach(subtopic => {
        if (subtopic.images && subtopic.images.length > 0) {
          subtopic.images.forEach(image => {
            if (image) {
              allImages.push({
                id: image.id,
                subtopic_id: subtopic.id,
                file_name: image.file_name || '',
                file_path: image.file_path || '',
                alt_text: image.alt_text || ''
              });
            }
          });
        }
      });
      setImageForms(allImages);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch topic data');
      setTopicData(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Update topic
  const updateTopic = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicForm),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update topic');
      }
      
      setSuccess('Topic updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update topic');
    } finally {
      setSaving(false);
    }
  };
  
  // Update subtopic
  const updateSubtopic = async (subtopicId, subtopicData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subtopics/${subtopicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subtopicData),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update subtopic');
      }
      
      return true;
    } catch (err) {
      throw err;
    }
  };
  
  // Update image
  const updateImage = async (imageId, imageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update image');
      }
      
      return true;
    } catch (err) {
      throw err;
    }
  };
  
  // Update video
  const updateVideo = async (videoId, videoData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update video');
      }
      
      return true;
    } catch (err) {
      throw err;
    }
  };
  
  // Save all changes
  const saveAllChanges = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Update topic
      await updateTopic();
      
      // Update all subtopics
      for (const subtopic of subtopicForms) {
        await updateSubtopic(subtopic.id, {
          title: subtopic.title,
          content: subtopic.content
        });
      }
      
      // Update all images
      for (const image of imageForms) {
        await updateImage(image.id, {
          alt_text: image.alt_text
        });
      }
      
      // Update all videos
      for (const video of videoForms) {
        await updateVideo(video.id, {
          title: video.title
        });
      }
      
      setSuccess('All changes saved successfully!');
      
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };
  
  // Update subtopic form
  const updateSubtopicForm = (index, field, value) => {
    const updated = [...subtopicForms];
    updated[index][field] = value;
    setSubtopicForms(updated);
  };
  
  // Update image form
  const updateImageForm = (index, field, value) => {
    const updated = [...imageForms];
    updated[index][field] = value;
    setImageForms(updated);
  };
  
  // Update video form
  const updateVideoForm = (index, field, value) => {
    const updated = [...videoForms];
    updated[index][field] = value;
    setVideoForms(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Existing Topic</h1>
          <p className="text-gray-600">Enter a topic ID to load and edit existing content</p>
        </div>

        {/* Topic ID Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic ID
              </label>
              <input
                type="text"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter topic ID (e.g., 18)"
                disabled={loading}
              />
            </div>
            <button
              onClick={fetchTopicData}
              disabled={loading || !topicId.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'Loading...' : 'Load Topic'}
            </button>
          </div>
          
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Topic Data Editor */}
        {topicData && (
          <div className="space-y-6">
            {/* Topic Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Topic Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm({...topicForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter topic title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={topicForm.theme}
                    onChange={(e) => setTopicForm({...topicForm, theme: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="card">Card</option>
                    <option value="dark">Dark</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({...topicForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter topic description"
                />
              </div>
            </div>

            {/* Subtopics */}
            {subtopicForms.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Subtopics ({subtopicForms.length})</h2>
                </div>
                
                <div className="space-y-4">
                  {subtopicForms.map((subtopic, index) => (
                    <div key={subtopic.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtopic Title *
                          </label>
                          <input
                            type="text"
                            value={subtopic.title}
                            onChange={(e) => updateSubtopicForm(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter subtopic title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ID: {subtopic.id}
                          </label>
                          <div className="text-sm text-gray-500">
                            Images: {subtopic.images ? subtopic.images.filter(img => img !== null).length : 0}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={subtopic.content}
                          onChange={(e) => updateSubtopicForm(index, 'content', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter subtopic content"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {imageForms.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Images ({imageForms.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imageForms.map((image, index) => (
                    <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700">ID: {image.id}</div>
                        <div className="text-sm text-gray-500">File: {image.file_name}</div>
                        <div className="text-sm text-gray-500">Subtopic: {image.subtopic_id}</div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={image.alt_text}
                          onChange={(e) => updateImageForm(index, 'alt_text', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter alt text for accessibility"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videoForms.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Videos ({videoForms.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoForms.map((video, index) => (
                    <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700">ID: {video.id}</div>
                        <div className="text-sm text-gray-500">File: {video.file_name}</div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video Title
                        </label>
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => updateVideoForm(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter video title"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Make sure to review all changes before saving
                </div>
                <button
                  onClick={saveAllChanges}
                  disabled={saving}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditExistingTopic;
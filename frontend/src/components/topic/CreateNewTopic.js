import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Plus, X, Upload, Video, ImageIcon, Trash2, Palette } from 'lucide-react';

const CreateNewTopic = () => {
  const [topic, setTopic] = useState({
    title: '',
    description: '',
    theme: 'Card Layout' // Default theme (display value)
  });

  const [subtopics, setSubtopics] = useState([
    { title: '', content: '', images: [] }
  ]);

  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const API_BASE = 'http://10.82.126.73:6512';

  // Available themes - display value to database value mapping
  const themes = [
    { value: 'Card Layout', label: 'Card Layout', dbValue: 'card' },
    { value: 'Dark Layout', label: 'Dark Layout', dbValue: 'dark' },
    { value: 'Purple Layout', label: 'Purple Layout', dbValue: 'purple' }
  ];

  // Helper function to get database value from display value
  const getThemeDbValue = (displayValue) => {
    const theme = themes.find(t => t.value === displayValue);
    return theme ? theme.dbValue : 'card'; // default to 'card'
  };

  // Topic handlers
  const handleTopicChange = (field, value) => {
    setTopic(prev => ({ ...prev, [field]: value }));
  };

  // Subtopic handlers
  const addSubtopic = () => {
    setSubtopics(prev => [...prev, { title: '', content: '', images: [] }]);
  };

  const removeSubtopic = (index) => {
    if (subtopics.length > 1) {
      setSubtopics(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubtopicChange = (index, field, value) => {
    setSubtopics(prev => prev.map((subtopic, i) => 
      i === index ? { ...subtopic, [field]: value } : subtopic
    ));
  };

  // Image handlers
  const handleImageAdd = (subtopicIndex, files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      alt_text: '',
      preview: URL.createObjectURL(file)
    }));

    setSubtopics(prev => prev.map((subtopic, i) => 
      i === subtopicIndex 
        ? { ...subtopic, images: [...subtopic.images, ...newImages] }
        : subtopic
    ));
  };

  const removeImage = (subtopicIndex, imageIndex) => {
    setSubtopics(prev => prev.map((subtopic, i) => 
      i === subtopicIndex 
        ? { 
            ...subtopic, 
            images: subtopic.images.filter((_, imgI) => imgI !== imageIndex)
          }
        : subtopic
    ));
  };

  const handleImageAltChange = (subtopicIndex, imageIndex, altText) => {
    setSubtopics(prev => prev.map((subtopic, i) => 
      i === subtopicIndex 
        ? {
            ...subtopic,
            images: subtopic.images.map((img, imgI) => 
              imgI === imageIndex ? { ...img, alt_text: altText } : img
            )
          }
        : subtopic
    ));
  };

  // Video handlers
  const handleVideoAdd = (files) => {
    const newVideos = Array.from(files).map(file => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, "")
    }));
    setVideos(prev => [...prev, ...newVideos]);
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoTitleChange = (index, title) => {
    setVideos(prev => prev.map((video, i) => 
      i === index ? { ...video, title } : video
    ));
  };

  // API calls
  const uploadImage = async (imageData, subtopicId) => {
    const formData = new FormData();
    formData.append('image', imageData.file);
    formData.append('subtopic_id', subtopicId);
    formData.append('alt_text', imageData.alt_text);

    const response = await fetch(`${API_BASE}/api/images`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  };

  const uploadVideo = async (videoData, topicId) => {
    const formData = new FormData();
    formData.append('video', videoData.file);
    formData.append('topic_id', topicId);
    formData.append('title', videoData.title);

    const response = await fetch(`${API_BASE}/api/videos`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload video');
    return response.json();
  };

  const createTopic = async () => {
    // Convert theme to database value before sending
    const topicData = {
      ...topic,
      theme: getThemeDbValue(topic.theme)
    };

    const response = await fetch(`${API_BASE}/api/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData)
    });

    if (!response.ok) throw new Error('Failed to create topic');
    return response.json();
  };

  const createSubtopic = async (subtopicData, topicId) => {
    const payload = {
      topic_id: topicId,
      title: subtopicData.title,
      content: subtopicData.content
    };

    console.log('Creating subtopic with payload:', payload);

    const response = await fetch(`${API_BASE}/api/subtopics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Subtopic creation failed:', errorText);
      throw new Error(`Failed to create subtopic: ${response.status}`);
    }
    return response.json();
  };

  // Main submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // Validate required fields
      if (!topic.title.trim()) {
        throw new Error('Topic title is required');
      }

      if (subtopics.some(st => !st.title.trim())) {
        throw new Error('All subtopic titles are required');
      }

      // 1. Create topic (now includes theme converted to db value)
      const topicResponse = await createTopic();
      console.log('Full topic response:', topicResponse);
      
      const topicId = topicResponse.data?.id || topicResponse.id || topicResponse.topic_id || topicResponse.insertId;
      console.log('Extracted topic ID:', topicId);
      
      if (!topicId) {
        throw new Error('Topic was created but no ID was returned');
      }

      // 2. Create subtopics and upload images
      for (let i = 0; i < subtopics.length; i++) {
        const subtopic = subtopics[i];
        
        console.log('Processing subtopic:', subtopic);
        console.log('Topic ID from response:', topicId);
        
        // Validate subtopic data before sending
        if (!subtopic.title || !subtopic.title.trim()) {
          throw new Error(`Subtopic ${i + 1} title is empty`);
        }
        
        // Create subtopic
        const subtopicResponse = await createSubtopic({
          title: subtopic.title.trim(),
          content: subtopic.content || ''
        }, topicId);
        
        console.log('Subtopic created:', subtopicResponse);
        
        const subtopicId = subtopicResponse.data?.id || subtopicResponse.id || subtopicResponse.subtopic_id || subtopicResponse.insertId;
        console.log('Extracted subtopic ID:', subtopicId);
        
        if (!subtopicId) {
          throw new Error('Subtopic was created but no ID was returned');
        }

        // Upload images for this subtopic
        for (const image of subtopic.images) {
          await uploadImage(image, subtopicId);
        }
      }

      // 3. Upload videos
      for (const video of videos) {
        await uploadVideo(video, topicId);
      }

      setSubmitStatus({
        type: 'success',
        message: 'Topic created successfully with all content!'
      });

      // Reset form
      setTopic({ title: '', description: '', theme: 'Card Layout' });
      setSubtopics([{ title: '', content: '', images: [] }]);
      setVideos([]);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to create topic'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Topic</h1>
      
      <div className="space-y-8">
        {/* Topic Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Topic Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic Title *
              </label>
              <input
                type="text"
                value={topic.title}
                onChange={(e) => handleTopicChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topic title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic Description
              </label>
              <textarea
                value={topic.description}
                onChange={(e) => handleTopicChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topic description"
              />
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="inline mr-2" size={16} />
                Theme
              </label>
              <select
                value={topic.theme}
                onChange={(e) => handleTopicChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {themes.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Choose how this topic will be displayed to users
              </p>
            </div>
          </div>
        </div>

        {/* Subtopics Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Subtopics</h2>
            <button
              type="button"
              onClick={addSubtopic}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Subtopic
            </button>
          </div>

          {subtopics.map((subtopic, index) => (
            <div key={index} className="bg-white p-4 rounded-lg mb-4 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Subtopic {index + 1}
                </h3>
                {subtopics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubtopic(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtopic Title *
                  </label>
                  <input
                    type="text"
                    value={subtopic.title}
                    onChange={(e) => handleSubtopicChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subtopic title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={subtopic.content}
                    onChange={(e) => handleSubtopicChange(index, 'content', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subtopic content"
                  />
                </div>

                {/* Images for this subtopic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageAdd(index, e.target.files)}
                    className="hidden"
                    id={`images-${index}`}
                  />
                  
                  <label
                    htmlFor={`images-${index}`}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <ImageIcon size={20} />
                    Add Images
                  </label>

                  {subtopic.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {subtopic.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, imgIndex)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                          <input
                            type="text"
                            value={image.alt_text}
                            onChange={(e) => handleImageAltChange(index, imgIndex, e.target.value)}
                            placeholder="Alt text"
                            className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Videos Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Videos</h2>
          
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => handleVideoAdd(e.target.files)}
            className="hidden"
            id="videos"
          />
          
          <label
            htmlFor="videos"
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors inline-flex"
          >
            <Video size={20} />
            Add Videos
          </label>

          {videos.length > 0 && (
            <div className="mt-4 space-y-3">
              {videos.map((video, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-md border">
                  <Video size={20} className="text-gray-500" />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) => handleVideoTitleChange(index, e.target.value)}
                      placeholder="Video title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">{video.file.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Message */}
        {submitStatus.message && (
          <div className={`p-4 rounded-md ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isSubmitting ? 'Creating Topic...' : 'Create Topic'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewTopic;
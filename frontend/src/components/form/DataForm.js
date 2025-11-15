import React, { useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import './DataForm.css';

// Individual SubHeading Component
const SubHeadingForm = ({ subHeading, index, onUpdate, onDelete }) => {
  const handleSubHeadingChange = (field, value) => {
    onUpdate(index, { ...subHeading, [field]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    handleSubHeadingChange('images', [...(subHeading.images || []), ...imageUrls]);
  };

  const removeImage = (imageIndex) => {
    const updatedImages = subHeading.images.filter((_, idx) => idx !== imageIndex);
    handleSubHeadingChange('images', updatedImages);
  };

  return (
    <div className="subheading-container">
      <div className="subheading-header">
        <h4 className="subheading-title">Sub Heading {index + 1}</h4>
        <button
          onClick={() => onDelete(index)}
          className="delete-button"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="subheading-content">
        <div className="form-group">
          <label className="form-label">
            Sub Heading Title
          </label>
          <input
            type="text"
            value={subHeading.title || ''}
            onChange={(e) => handleSubHeadingChange('title', e.target.value)}
            className="form-input"
            placeholder="Enter sub heading title"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Sub Heading Data
          </label>
          <textarea
            value={subHeading.data || ''}
            onChange={(e) => handleSubHeadingChange('data', e.target.value)}
            rows={3}
            className="form-textarea"
            placeholder="Enter corresponding data for this sub heading"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Images for Sub Heading
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="form-file-input"
          />
          {subHeading.images && subHeading.images.length > 0 && (
            <div className="image-grid">
              {subHeading.images.map((img, imgIdx) => (
                <div key={imgIdx} className="image-preview-container">
                  <img
                    src={img}
                    alt={`Preview ${imgIdx + 1}`}
                    className="image-preview"
                  />
                  <button
                    onClick={() => removeImage(imgIdx)}
                    className="image-remove-button"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Video Upload Component
const VideoSection = ({ videos, onVideoUpload, onVideoRemove }) => {
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const videoUrls = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    onVideoUpload(videoUrls);
  };

  return (
    <div className="video-section">
      <label className="form-label">
        Videos (General - not related to specific headings)
      </label>
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoUpload}
        className="form-file-input"
      />
      {videos.length > 0 && (
        <div className="video-list">
          {videos.map((video, idx) => (
            <div key={idx} className="video-item">
              <div className="video-info">
                <video
                  src={video.url}
                  className="video-preview"
                  controls={false}
                />
                <span className="video-name">{video.name}</span>
              </div>
              <button
                onClick={() => onVideoRemove(idx)}
                className="delete-button"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Form Component
const DataForm = () => {
  const [formData, setFormData] = useState({
    heading: '',
    headingData: '',
    subHeadings: [{ title: '', data: '', images: [] }],
    videos: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSubHeading = () => {
    setFormData(prev => ({
      ...prev,
      subHeadings: [...prev.subHeadings, { title: '', data: '', images: [] }]
    }));
  };

  const updateSubHeading = (index, updatedSubHeading) => {
    setFormData(prev => ({
      ...prev,
      subHeadings: prev.subHeadings.map((sub, idx) => 
        idx === index ? updatedSubHeading : sub
      )
    }));
  };

  const deleteSubHeading = (index) => {
    if (formData.subHeadings.length > 1) {
      setFormData(prev => ({
        ...prev,
        subHeadings: prev.subHeadings.filter((_, idx) => idx !== index)
      }));
    }
  };

  const handleVideoUpload = (newVideos) => {
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, ...newVideos]
    }));
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send data to your backend
    // For demo purposes, we'll just log the data
    console.log('Form Data:', formData);
    
    // In a real PERN app, you would make an API call like:
    // await fetch('/api/submit-data', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    
    alert('Form data logged to console! Check developer tools.');
  };

  const resetForm = () => {
    setFormData({
      heading: '',
      headingData: '',
      subHeadings: [{ title: '', data: '', images: [] }],
      videos: []
    });
  };

  return (
    <div className="data-form-container">
      <div className="form-header">
        <h1 className="main-title">Data Collection Form</h1>
  
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {/* Main Heading Section */}
        <div className="section main-heading-section">
          <h2 className="section-title">Main Heading</h2>
          
          <div className="section-content">
            <div className="form-group">
              <label className="form-label">
                Heading Title
              </label>
              <input
                type="text"
                value={formData.heading}
                onChange={(e) => handleInputChange('heading', e.target.value)}
                className="form-input main-input"
                placeholder="Enter main heading"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Heading Data
              </label>
              <textarea
                value={formData.headingData}
                onChange={(e) => handleInputChange('headingData', e.target.value)}
                rows={4}
                className="form-textarea main-textarea"
                placeholder="Enter corresponding data for the main heading"
                required
              />
            </div>
          </div>
        </div>

        {/* Sub Headings Section */}
        <div className="section subheadings-section">
          <div className="section-header">
            <h2 className="section-title">Sub Headings</h2>
            <button
              type="button"
              onClick={addSubHeading}
              className="add-button"
            >
              <Plus size={16} />
              <span>Add Sub Heading</span>
            </button>
          </div>
          
          <div className="subheadings-list">
            {formData.subHeadings.map((subHeading, index) => (
              <SubHeadingForm
                key={index}
                subHeading={subHeading}
                index={index}
                onUpdate={updateSubHeading}
                onDelete={deleteSubHeading}
              />
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div className="section videos-section">
          <h2 className="section-title">Videos</h2>
          <VideoSection
            videos={formData.videos}
            onVideoUpload={handleVideoUpload}
            onVideoRemove={removeVideo}
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
          >
            Submit Data
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="reset-button"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataForm;
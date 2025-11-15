import React, { useState, useEffect } from 'react';
import { Search, Upload, X, Plus, Edit2, Save, Trash2, Image, Video, FileText } from 'lucide-react';

const BASE_URL = 'http://10.82.126.73:6512/api';

const EditPart = () => {
  const [partNumber, setPartNumber] = useState('');
  const [partData, setPartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPart, setEditingPart] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  
  // Form states for new items
  const [newFunction, setNewFunction] = useState('');
  const [newDefect, setNewDefect] = useState('');
  const [editingFunction, setEditingFunction] = useState(null);
  const [editingDefect, setEditingDefect] = useState(null);
  
  // File upload states
  const [uploadingDrawing, setUploadingDrawing] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingFunctionMedia, setUploadingFunctionMedia] = useState({});
  const [uploadingDefectMedia, setUploadingDefectMedia] = useState({});

  const fetchPartData = async (partId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${BASE_URL}/parts/${partId}/complete`);
      if (!response.ok) {
        throw new Error('Part not found');
      }
      
      const data = await response.json();
      setPartData(data);
      setNewPartName(data.part.name);
    } catch (err) {
      setError(err.message);
      setPartData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePartSearch = () => {
    if (partNumber.trim()) {
      fetchPartData(partNumber.trim());
    }
  };

  const handleUpdatePartName = async () => {
    try {
      const response = await fetch(`${BASE_URL}/parts/${partData.part.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPartName }),
      });
      
      if (!response.ok) throw new Error('Failed to update part name');
      
      setSuccess('Part name updated successfully');
      setEditingPart(false);
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddFunction = async () => {
    if (!newFunction.trim()) return;
    
    try {
      const response = await fetch(`${BASE_URL}/functions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          part_id: partData.part.id,
          description: newFunction,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add function');
      
      setSuccess('Function added successfully');
      setNewFunction('');
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateFunction = async (functionId, description) => {
    try {
      const response = await fetch(`${BASE_URL}/functions/${functionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      
      if (!response.ok) throw new Error('Failed to update function');
      
      setSuccess('Function updated successfully');
      setEditingFunction(null);
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFunction = async (functionId) => {
    if (!window.confirm('Are you sure you want to delete this function?')) return;
    
    try {
      const response = await fetch(`${BASE_URL}/functions/${functionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete function');
      
      setSuccess('Function deleted successfully');
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddDefect = async () => {
    if (!newDefect.trim()) return;
    
    try {
      const response = await fetch(`${BASE_URL}/defects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          part_id: partData.part.id,
          description: newDefect,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add defect');
      
      setSuccess('Defect added successfully');
      setNewDefect('');
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateDefect = async (defectId, description) => {
    try {
      const response = await fetch(`${BASE_URL}/defects/${defectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      
      if (!response.ok) throw new Error('Failed to update defect');
      
      setSuccess('Defect updated successfully');
      setEditingDefect(null);
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDefect = async (defectId) => {
    if (!window.confirm('Are you sure you want to delete this defect?')) return;
    
    try {
      const response = await fetch(`${BASE_URL}/defects/${defectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete defect');
      
      setSuccess('Defect deleted successfully');
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (file, endpoint, formData, setUploading) => {
    try {
      setUploading(true);
      
      const data = new FormData();
      data.append('file', file);
      
      // Add additional form data
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: data,
      });
      
      if (!response.ok) throw new Error('Failed to upload file');
      
      setSuccess('File uploaded successfully');
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (endpoint, successMessage) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete file');
      
      setSuccess(successMessage);
      fetchPartData(partData.part.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDrawingUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file, '/drawings', {
        part_id: partData.part.id,
        context: 'drawings'
      }, setUploadingDrawing);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file, '/assembly-videos', {
        part_id: partData.part.id,
        context: 'videos'
      }, setUploadingVideo);
    }
  };

  const handleFunctionMediaUpload = (functionId, mediaType) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadingFunctionMedia(prev => ({ ...prev, [`${functionId}-${mediaType}`]: true }));
      handleFileUpload(file, `/functions/${functionId}/media`, {
        function_id: functionId,
        media_type: mediaType,
        context: 'function-media'
      }, () => setUploadingFunctionMedia(prev => ({ ...prev, [`${functionId}-${mediaType}`]: false })));
    }
  };

  const handleDefectMediaUpload = (defectId, mediaType) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadingDefectMedia(prev => ({ ...prev, [`${defectId}-${mediaType}`]: true }));
      handleFileUpload(file, `/defects/${defectId}/media`, {
        defect_id: defectId,
        media_type: mediaType,
        context: 'defect-media'
      }, () => setUploadingDefectMedia(prev => ({ ...prev, [`${defectId}-${mediaType}`]: false })));
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Part</h1>
        
        {/* Search Section */}
        <div className="flex gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Enter Part Number/ID"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handlePartSearch()}
          />
          <button
            onClick={handlePartSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Search size={20} />
            Search
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading part data...</p>
          </div>
        )}
      </div>

      {partData && (
        <div className="space-y-8">
          {/* Part Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Part Information</h2>
              {!editingPart ? (
                <button
                  onClick={() => setEditingPart(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdatePartName}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingPart(false);
                      setNewPartName(partData.part.name);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part ID</label>
                <input
                  type="text"
                  value={partData.part.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Name</label>
                <input
                  type="text"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  disabled={!editingPart}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Part Drawings */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Part Drawings</h2>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDrawingUpload}
                  className="hidden"
                  id="drawing-upload"
                />
                <label
                  htmlFor="drawing-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Upload size={16} />
                  Add Drawing
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partData.drawings.map((drawing) => (
                <div key={drawing.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span className="text-sm font-medium truncate">{drawing.file_name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(`/drawings/${drawing.id}`, 'Drawing deleted successfully')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <img
                    src={`${BASE_URL}/uploads/${drawing.file_path.split('/').pop()}`}
                    alt={drawing.alt_text || 'Part drawing'}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Assembly Videos */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Assembly Videos</h2>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Upload size={16} />
                  Add Video
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partData.assemblyVideos.map((video) => (
                <div key={video.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Video size={16} />
                      <span className="text-sm font-medium truncate">{video.file_name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(`/assembly-videos/${video.id}`, 'Video deleted successfully')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <video
                    controls
                    className="w-full h-40 rounded"
                    src={`${BASE_URL}/uploads/${video.file_path.split('/').pop()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Functions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Functions</h2>
            
            {/* Add New Function */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <h3 className="font-medium mb-2">Add New Function</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Function description"
                  value={newFunction}
                  onChange={(e) => setNewFunction(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAddFunction}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Existing Functions */}
            <div className="space-y-4">
              {partData.functions.map((func) => (
                <div key={func.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    {editingFunction === func.id ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          defaultValue={func.description}
                          onBlur={(e) => handleUpdateFunction(func.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingFunction(null)}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800">{func.description}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingFunction(func.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteFunction(func.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Function Media */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Image</h4>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFunctionMediaUpload(func.id, 'image')}
                            className="hidden"
                            id={`func-image-${func.id}`}
                          />
                          <label
                            htmlFor={`func-image-${func.id}`}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                          >
                            <Upload size={12} />
                          </label>
                          {func.image_file_path && (
                            <button
                              onClick={() => handleDeleteFile(`/functions/${func.id}/media/image`, 'Image deleted successfully')}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      {func.image_file_path && (
                        <img
                          src={`${BASE_URL}/uploads/${func.image_file_path.split('/').pop()}`}
                          alt={func.image_alt_text || 'Function image'}
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Video</h4>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleFunctionMediaUpload(func.id, 'video')}
                            className="hidden"
                            id={`func-video-${func.id}`}
                          />
                          <label
                            htmlFor={`func-video-${func.id}`}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                          >
                            <Upload size={12} />
                          </label>
                          {func.video_file_path && (
                            <button
                              onClick={() => handleDeleteFile(`/functions/${func.id}/media/video`, 'Video deleted successfully')}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      {func.video_file_path && (
                        <video
                          controls
                          className="w-full h-32 rounded"
                          src={`${BASE_URL}/uploads/${func.video_file_path.split('/').pop()}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defects */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Defects</h2>
            
            {/* Add New Defect */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <h3 className="font-medium mb-2">Add New Defect</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Defect description"
                  value={newDefect}
                  onChange={(e) => setNewDefect(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAddDefect}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Existing Defects */}
            <div className="space-y-4">
              {partData.defects.map((defect) => (
                <div key={defect.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    {editingDefect === defect.id ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          defaultValue={defect.description}
                          onBlur={(e) => handleUpdateDefect(defect.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingDefect(null)}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800">{defect.description}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingDefect(defect.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDefect(defect.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Defect Media */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Image</h4>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDefectMediaUpload(defect.id, 'image')}
                            className="hidden"
                            id={`defect-image-${defect.id}`}
                          />
                          <label
                            htmlFor={`defect-image-${defect.id}`}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                          >
                            <Upload size={12} />
                          </label>
                          {defect.image_file_path && (
                            <button
                              onClick={() => handleDeleteFile(`/defects/${defect.id}/media/image`, 'Image deleted successfully')}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      {defect.image_file_path && (
                        <img
                          src={`${BASE_URL}/uploads/${defect.image_file_path.split('/').pop()}`}
                          alt={defect.image_alt_text || 'Defect image'}
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Video</h4>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleDefectMediaUpload(defect.id, 'video')}
                            className="hidden"
                            id={`defect-video-${defect.id}`}
                          />
                          <label
                            htmlFor={`defect-video-${defect.id}`}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                          >
                            <Upload size={12} />
                          </label>
                          {defect.video_file_path && (
                            <button
                              onClick={() => handleDeleteFile(`/defects/${defect.id}/media/video`, 'Video deleted successfully')}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                                            {defect.video_file_path && (
                        <video
                          controls
                          className="w-full h-32 rounded"
                          src={`${BASE_URL}/uploads/${defect.video_file_path.split('/').pop()}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPart;

import React, { useState } from 'react';
import { Plus, X, Upload, FileText, Video, Image, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://10.82.126.73:6512/api';

const CreateNewPart = () => {
  const [partName, setPartName] = useState('');
  const [functions, setFunctions] = useState([{ description: '', image: null, video: null }]);
  const [defects, setDefects] = useState([{ description: '', image: null, video: null }]);
  const [drawings, setDrawings] = useState([]);
  const [assemblyVideos, setAssemblyVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const addFunction = () => {
    setFunctions([...functions, { description: '', image: null, video: null }]);
  };

  const removeFunction = (index) => {
    setFunctions(functions.filter((_, i) => i !== index));
  };

  const updateFunction = (index, field, value) => {
    const updated = [...functions];
    updated[index][field] = value;
    setFunctions(updated);
  };

  const addDefect = () => {
    setDefects([...defects, { description: '', image: null, video: null }]);
  };

  const removeDefect = (index) => {
    setDefects(defects.filter((_, i) => i !== index));
  };

  const updateDefect = (index, field, value) => {
    const updated = [...defects];
    updated[index][field] = value;
    setDefects(updated);
  };

  const addDrawing = (file) => {
    setDrawings([...drawings, file]);
  };

  const removeDrawing = (index) => {
    setDrawings(drawings.filter((_, i) => i !== index));
  };

  const addAssemblyVideo = (file) => {
    setAssemblyVideos([...assemblyVideos, file]);
  };

  const removeAssemblyVideo = (index) => {
    setAssemblyVideos(assemblyVideos.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!partName.trim()) {
      newErrors.partName = 'Part name is required';
    }

    functions.forEach((func, index) => {
      if (!func.description.trim()) {
        newErrors[`function_${index}`] = 'Function description is required';
      }
    });

    defects.forEach((defect, index) => {
      if (!defect.description.trim()) {
        newErrors[`defect_${index}`] = 'Defect description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFile = async (file, endpoint, additionalData = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    return response.json();
  };

  const createPartWithData = async () => {
    try {
      // Step 1: Create the part
      const partResponse = await fetch(`${API_BASE_URL}/parts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: partName }),
      });

      if (!partResponse.ok) {
        throw new Error('Failed to create part');
      }

      const partData = await partResponse.json();
      const partId = partData.part.id;

      // Step 2: Create functions and upload their media
      for (const func of functions) {
        if (func.description.trim()) {
          // Create function
          const functionResponse = await fetch(`${API_BASE_URL}/functions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              part_id: partId,
              description: func.description,
            }),
          });

          if (!functionResponse.ok) {
            throw new Error('Failed to create function');
          }

          const functionData = await functionResponse.json();
          const functionId = functionData.function.id;

          // Upload function media
          if (func.image) {
            await uploadFile(func.image, `/functions/${functionId}/media`, {
              function_id: functionId,
              media_type: 'image',
            });
          }

          if (func.video) {
            await uploadFile(func.video, `/functions/${functionId}/media`, {
              function_id: functionId,
              media_type: 'video',
            });
          }
        }
      }

      // Step 3: Create defects and upload their media
      for (const defect of defects) {
        if (defect.description.trim()) {
          // Create defect
          const defectResponse = await fetch(`${API_BASE_URL}/defects`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              part_id: partId,
              description: defect.description,
            }),
          });

          if (!defectResponse.ok) {
            throw new Error('Failed to create defect');
          }

          const defectData = await defectResponse.json();
          const defectId = defectData.defect.id;

          // Upload defect media
          if (defect.image) {
            await uploadFile(defect.image, `/defects/${defectId}/media`, {
              defect_id: defectId,
              media_type: 'image',
            });
          }

          if (defect.video) {
            await uploadFile(defect.video, `/defects/${defectId}/media`, {
              defect_id: defectId,
              media_type: 'video',
            });
          }
        }
      }

      // Step 4: Upload drawings
      for (const drawing of drawings) {
        await uploadFile(drawing, '/drawings', {
          part_id: partId,
          context: 'drawings',
        });
      }

      // Step 5: Upload assembly videos
      for (const video of assemblyVideos) {
        await uploadFile(video, '/assembly-videos', {
          part_id: partId,
          context: 'assembly',
        });
      }

      return partData;
    } catch (error) {
      console.error('Error creating part:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await createPartWithData();
      setSubmitStatus('success');
      
      // Reset form
      setPartName('');
      setFunctions([{ description: '', image: null, video: null }]);
      setDefects([{ description: '', image: null, video: null }]);
      setDrawings([]);
      setAssemblyVideos([]);
      setErrors({});
    } catch (error) {
      setSubmitStatus('error');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUpload = ({ label, accept, onFileSelect, file, onRemove }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2">
          <label className="cursor-pointer">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
              {label}
            </span>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => onFileSelect(e.target.files[0])}
            />
          </label>
        </div>
        {file && (
          <div className="mt-2 flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">{file.name}</span>
            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Part</h1>
        <p className="text-gray-600">Add a new part with its functions, defects, and associated media.</p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800">Part created successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Failed to create part. Please try again.</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Part Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Part Name *
          </label>
          <input
            type="text"
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.partName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter part name"
          />
          {errors.partName && (
            <p className="mt-1 text-sm text-red-600">{errors.partName}</p>
          )}
        </div>

        {/* Functions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Functions</h2>
            <button
              type="button"
              onClick={addFunction}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Function
            </button>
          </div>
          
          {functions.map((func, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Function {index + 1}</h3>
                {functions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFunction(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={func.description}
                    onChange={(e) => updateFunction(index, 'description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`function_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the function"
                  />
                  {errors[`function_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`function_${index}`]}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Function Image
                    </label>
                    <FileUpload
                      label="Upload Image"
                      accept="image/*"
                      file={func.image}
                      onFileSelect={(file) => updateFunction(index, 'image', file)}
                      onRemove={() => updateFunction(index, 'image', null)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Function Video
                    </label>
                    <FileUpload
                      label="Upload Video"
                      accept="video/*"
                      file={func.video}
                      onFileSelect={(file) => updateFunction(index, 'video', file)}
                      onRemove={() => updateFunction(index, 'video', null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Defects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Defects</h2>
            <button
              type="button"
              onClick={addDefect}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Defect
            </button>
          </div>
          
          {defects.map((defect, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Defect {index + 1}</h3>
                {defects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDefect(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={defect.description}
                    onChange={(e) => updateDefect(index, 'description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`defect_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the defect"
                  />
                  {errors[`defect_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`defect_${index}`]}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Defect Image
                    </label>
                    <FileUpload
                      label="Upload Image"
                      accept="image/*"
                      file={defect.image}
                      onFileSelect={(file) => updateDefect(index, 'image', file)}
                      onRemove={() => updateDefect(index, 'image', null)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Defect Video
                    </label>
                    <FileUpload
                      label="Upload Video"
                      accept="video/*"
                      file={defect.video}
                      onFileSelect={(file) => updateDefect(index, 'video', file)}
                      onRemove={() => updateDefect(index, 'video', null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Part Drawings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Part Drawings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {drawings.map((drawing, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">{drawing.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDrawing(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <FileUpload
            label="Add Drawing"
            accept="image/*"
            onFileSelect={addDrawing}
          />
        </div>

        {/* Assembly Videos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Assembly Videos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {assemblyVideos.map((video, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Video className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm font-medium">{video.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAssemblyVideo(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <FileUpload
            label="Add Assembly Video"
            accept="video/*"
            onFileSelect={addAssemblyVideo}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Part...
              </>
            ) : (
              'Create Part'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPart;
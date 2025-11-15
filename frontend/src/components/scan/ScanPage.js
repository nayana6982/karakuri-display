import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Scan, X, Camera } from 'lucide-react';

const ScanPage = () => {
  const [partId, setPartId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!partId.trim()) return;

    setLoading(true);
    
    // Navigate to the dynamic template page
    navigate(`/view/${partId}`);
    
    setLoading(false);
  };

  const startCamera = async () => {
    try {
      setError('');
      setScanning(true);
      
      console.log('Browser info:', {
        userAgent: navigator.userAgent,
        isSecureContext: window.isSecureContext,
        protocol: window.location.protocol,
        hasNavigator: !!navigator,
        hasMediaDevices: !!navigator.mediaDevices,
        hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      });
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices) {
        throw new Error('navigator.mediaDevices not available');
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not available');
      }
      
      console.log('Requesting camera access...');
      
      // Try with simpler constraints first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      
      console.log('Camera access granted', stream);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Video stream attached');
        
        // Wait for video to load
        videoRef.current.addEventListener('loadedmetadata', () => {
          console.log('Video metadata loaded');
        });
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = 'Camera access failed: ';
      
      switch(err.name) {
        case 'NotAllowedError':
          errorMessage += 'Permission denied. Please allow camera access.';
          break;
        case 'NotFoundError':
          errorMessage += 'No camera found on this device.';
          break;
        case 'NotSupportedError':
          errorMessage += 'Camera not supported in this browser.';
          break;
        case 'OverconstrainedError':
          errorMessage += 'Camera constraints not supported.';
          break;
        case 'SecurityError':
          errorMessage += 'Security error. Try using HTTPS.';
          break;
        default:
          errorMessage += err.message || 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setError('');
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg');
  };

  const simulateBarcodeScan = () => {
    // Simulate a successful barcode scan
    const mockBarcodeValue = Math.floor(Math.random() * 1000) + 100;
    setPartId(mockBarcodeValue.toString());
    stopCamera();
    
    // Auto-submit after scanning
    setTimeout(() => {
      navigate(`/view/${mockBarcodeValue}`);
    }, 500);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Camera View */}
          {scanning && (
            <div className="relative bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-white border-dashed w-48 h-32 rounded-lg flex items-center justify-center">
                  <p className="text-white text-sm font-medium">Position barcode here</p>
                </div>
              </div>
              
              {/* Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={simulateBarcodeScan}
                  className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                  title="Simulate Scan (Demo)"
                >
                  <Scan className="w-5 h-5" />
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-600 text-white p-2 rounded text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">View Part</h1>
              <p className="text-gray-600">Enter a part ID or scan a barcode to view content</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="partId" className="block text-sm font-medium text-gray-700 mb-2">
                  Part ID
                </label>
                <input
                  type="text"
                  id="partId"
                  value={partId}
                  onChange={(e) => setPartId(e.target.value)}
                  placeholder="Enter part ID (e.g., 123)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !partId.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? 'Loading...' : 'View Part'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              {!scanning ? (
                <button
                  onClick={startCamera}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-colors flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera to Scan
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Camera is active - position barcode in view</p>
                  <p className="text-xs text-gray-500">Click the green scan button above to simulate scanning</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
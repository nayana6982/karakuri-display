



// const express = require('express');
// const router = express.Router();

// // Import existing controllers
// const topicController = require('../controllers/topicController');
// const subtopicController = require('../controllers/subtopicController');
// const imageController = require('../controllers/imageController');
// const videoController = require('../controllers/videoController');

// // Import new parts controller
// const {
//   // Upload middleware
//   upload,
  
//   // Parts
//   createPart,
//   getAllParts,
//   getPartById,
//   updatePart,
//   deletePart,
  
//   // Part Functions
//   createPartFunction,
//   getPartFunctions,
//   getPartFunctionById,
//   updatePartFunction,
//   deletePartFunction,
  
//   // Part Defects
//   createPartDefect,
//   getPartDefects,
//   getPartDefectById,
//   updatePartDefect,
//   deletePartDefect,
  
//   // Media Files
//   uploadMedia,
//   getMediaByPart,
//   getMediaByFunction,
//   getMediaByDefect,
//   getMediaById,
//   updateMediaAltText,
//   deleteMedia,
  
//   // Complex Queries
//   getCompletePartData
// } = require('../controllers/partController');

// // ==================== EXISTING ROUTES ====================

// // Topic routes
// router.get('/topics', topicController.getAllTopics);
// router.get('/topics/:id', topicController.getTopicById);
// router.post('/topics', topicController.createTopic);
// router.put('/topics/:id', topicController.updateTopic);
// router.delete('/topics/:id', topicController.deleteTopic);

// // Subtopic routes
// router.get('/topics/:topicId/subtopics', subtopicController.getSubtopicsByTopicId);
// router.get('/subtopics/:id', subtopicController.getSubtopicById);
// router.post('/subtopics', subtopicController.createSubtopic);
// router.put('/subtopics/:id', subtopicController.updateSubtopic);
// router.delete('/subtopics/:id', subtopicController.deleteSubtopic);

// // Image routes
// router.get('/subtopics/:subtopicId/images', imageController.getImagesBySubtopicId);
// router.post('/images', imageController.upload.single('image'), imageController.uploadImage);
// router.put('/images/:id', imageController.updateImage);
// router.delete('/images/:id', imageController.deleteImage);

// // Video routes
// router.get('/topics/:topicId/videos', videoController.getVideosByTopicId);
// router.get('/videos/:id', videoController.getVideoById);
// router.post('/videos', videoController.upload.single('video'), videoController.uploadVideo);
// router.put('/videos/:id', videoController.updateVideo);
// router.delete('/videos/:id', videoController.deleteVideo);

// // ==================== NEW PARTS ROUTES ====================

// // GET /api/parts - Get all parts
// router.get('/parts', getAllParts);

// // GET /api/parts/:id - Get a specific part
// router.get('/parts/:id', getPartById);

// // POST /api/parts - Create a new part
// router.post('/parts', createPart);

// // PUT /api/parts/:id - Update a part
// router.put('/parts/:id', updatePart);

// // DELETE /api/parts/:id - Delete a part
// router.delete('/parts/:id', deletePart);

// // GET /api/parts/:part_id/complete - Get complete part data with functions, defects, and media
// router.get('/parts/:part_id/complete', getCompletePartData);

// // ==================== PART FUNCTIONS ROUTES ====================

// // GET /api/parts/:part_id/functions - Get all functions for a part
// router.get('/parts/:part_id/functions', getPartFunctions);

// // GET /api/functions/:id - Get a specific function
// router.get('/functions/:id', getPartFunctionById);

// // POST /api/functions - Create a new part function
// router.post('/functions', createPartFunction);

// // PUT /api/functions/:id - Update a part function
// router.put('/functions/:id', updatePartFunction);

// // DELETE /api/functions/:id - Delete a part function
// router.delete('/functions/:id', deletePartFunction);

// // ==================== PART DEFECTS ROUTES ====================

// // GET /api/parts/:part_id/defects - Get all defects for a part
// router.get('/parts/:part_id/defects', getPartDefects);

// // GET /api/defects/:id - Get a specific defect
// router.get('/defects/:id', getPartDefectById);

// // POST /api/defects - Create a new part defect
// router.post('/defects', createPartDefect);

// // PUT /api/defects/:id - Update a part defect
// router.put('/defects/:id', updatePartDefect);

// // DELETE /api/defects/:id - Delete a part defect
// router.delete('/defects/:id', deletePartDefect);

// // ==================== MEDIA FILES ROUTES ====================

// // POST /api/media/upload - Upload media files
// // Supports multiple files upload
// router.post('/media/upload', upload.array('files'), uploadMedia);

// // GET /api/parts/:part_id/media - Get all media for a part
// // Query params: ?context=part_drawing|assembly_video|function_image|function_video|defect_image|defect_video
// router.get('/parts/:part_id/media', getMediaByPart);

// // GET /api/functions/:function_id/media - Get all media for a function
// router.get('/functions/:function_id/media', getMediaByFunction);

// // GET /api/defects/:defect_id/media - Get all media for a defect
// router.get('/defects/:defect_id/media', getMediaByDefect);

// // GET /api/media/:id - Get a specific media file
// router.get('/media/:id', getMediaById);

// // PUT /api/media/:id - Update media alt text
// router.put('/media/:id', updateMediaAltText);

// // DELETE /api/media/:id - Delete a media file
// router.delete('/media/:id', deleteMedia);

// // ==================== STATIC FILES SERVING ====================

// // Static file serving for uploaded files
// router.use('/uploads', express.static('uploads'));

// module.exports = router;


const express = require('express');
const router = express.Router();

// Import existing controllers
const topicController = require('../controllers/topicController');
const subtopicController = require('../controllers/subtopicController');
const imageController = require('../controllers/imageController');
const videoController = require('../controllers/videoController');

// Import new parts controller
const {
  // Upload middleware
  upload,
  
  // Parts
  createPart,
  getAllParts,
  getPartById,
  updatePart,
  deletePart,
  
  // Part Functions
  createPartFunction,
  getPartFunctions,
  getPartFunctionById,
  updatePartFunction,
  deletePartFunction,
  
  // Part Defects
  createPartDefect,
  getPartDefects,
  getPartDefectById,
  updatePartDefect,
  deletePartDefect,
  
  // Part Drawings
  uploadPartDrawing,
  getPartDrawings,
  deletePartDrawing,
  
  // Assembly Videos
  uploadAssemblyVideo,
  getAssemblyVideos,
  deleteAssemblyVideo,
  
  // Function Media
  uploadFunctionMedia,
  deleteFunctionMedia,
  
  // Defect Media
  uploadDefectMedia,
  deleteDefectMedia,
  
  // Complex Queries
  getCompletePartData
} = require('../controllers/partController');

// ==================== EXISTING ROUTES ====================

// Topic routes
router.get('/topics', topicController.getAllTopics);
router.get('/topics/:id', topicController.getTopicById);
router.post('/topics', topicController.createTopic);
router.put('/topics/:id', topicController.updateTopic);
router.delete('/topics/:id', topicController.deleteTopic);

// Subtopic routes
router.get('/topics/:topicId/subtopics', subtopicController.getSubtopicsByTopicId);
router.get('/subtopics/:id', subtopicController.getSubtopicById);
router.post('/subtopics', subtopicController.createSubtopic);
router.put('/subtopics/:id', subtopicController.updateSubtopic);
router.delete('/subtopics/:id', subtopicController.deleteSubtopic);

// Image routes
router.get('/subtopics/:subtopicId/images', imageController.getImagesBySubtopicId);
router.post('/images', imageController.upload.single('image'), imageController.uploadImage);
router.put('/images/:id', imageController.updateImage);
router.delete('/images/:id', imageController.deleteImage);

// Video routes
router.get('/topics/:topicId/videos', videoController.getVideosByTopicId);
router.get('/videos/:id', videoController.getVideoById);
router.post('/videos', videoController.upload.single('video'), videoController.uploadVideo);
router.put('/videos/:id', videoController.updateVideo);
router.delete('/videos/:id', videoController.deleteVideo);

// ==================== NEW PARTS ROUTES ====================

// GET /api/parts - Get all parts
router.get('/parts', getAllParts);

// GET /api/parts/:id - Get a specific part
router.get('/parts/:id', getPartById);

// POST /api/parts - Create a new part
router.post('/parts', createPart);

// PUT /api/parts/:id - Update a part
router.put('/parts/:id', updatePart);

// DELETE /api/parts/:id - Delete a part
router.delete('/parts/:id', deletePart);

// GET /api/parts/:part_id/complete - Get complete part data with functions, defects, and media
router.get('/parts/:part_id/complete', getCompletePartData);

// ==================== PART FUNCTIONS ROUTES ====================

// GET /api/parts/:part_id/functions - Get all functions for a part
router.get('/parts/:part_id/functions', getPartFunctions);

// GET /api/functions/:id - Get a specific function
router.get('/functions/:id', getPartFunctionById);

// POST /api/functions - Create a new part function
router.post('/functions', createPartFunction);

// PUT /api/functions/:id - Update a part function
router.put('/functions/:id', updatePartFunction);

// DELETE /api/functions/:id - Delete a part function
router.delete('/functions/:id', deletePartFunction);

// ==================== PART DEFECTS ROUTES ====================

// GET /api/parts/:part_id/defects - Get all defects for a part
router.get('/parts/:part_id/defects', getPartDefects);

// GET /api/defects/:id - Get a specific defect
router.get('/defects/:id', getPartDefectById);

// POST /api/defects - Create a new part defect
router.post('/defects', createPartDefect);

// PUT /api/defects/:id - Update a part defect
router.put('/defects/:id', updatePartDefect);

// DELETE /api/defects/:id - Delete a part defect
router.delete('/defects/:id', deletePartDefect);

// ==================== PART DRAWINGS ROUTES ====================

// GET /api/parts/:part_id/drawings - Get all drawings for a part
router.get('/parts/:part_id/drawings', getPartDrawings);

// POST /api/drawings - Upload part drawing
router.post('/drawings', upload.single('file'), uploadPartDrawing);

// DELETE /api/drawings/:id - Delete a part drawing
router.delete('/drawings/:id', deletePartDrawing);

// ==================== ASSEMBLY VIDEOS ROUTES ====================

// GET /api/parts/:part_id/assembly-videos - Get all assembly videos for a part
router.get('/parts/:part_id/assembly-videos', getAssemblyVideos);

// POST /api/assembly-videos - Upload assembly video
router.post('/assembly-videos', upload.single('file'), uploadAssemblyVideo);

// DELETE /api/assembly-videos/:id - Delete an assembly video
router.delete('/assembly-videos/:id', deleteAssemblyVideo);

// ==================== FUNCTION MEDIA ROUTES ====================

// POST /api/functions/:function_id/media - Upload function media (image or video)
router.post('/functions/:function_id/media', upload.single('file'), uploadFunctionMedia);

// DELETE /api/functions/:function_id/media/:media_type - Delete function media
router.delete('/functions/:function_id/media/:media_type', deleteFunctionMedia);

// ==================== DEFECT MEDIA ROUTES ====================

// POST /api/defects/:defect_id/media - Upload defect media (image or video)
router.post('/defects/:defect_id/media', upload.single('file'), uploadDefectMedia);

// DELETE /api/defects/:defect_id/media/:media_type - Delete defect media
router.delete('/defects/:defect_id/media/:media_type', deleteDefectMedia);

// ==================== STATIC FILES SERVING ====================

// Static file serving for uploaded files
router.use('/uploads', express.static('uploads'));

module.exports = router;
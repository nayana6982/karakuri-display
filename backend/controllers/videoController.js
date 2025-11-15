const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/videos';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|avi|mkv|mov|wmv|flv|webm/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('video/');

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'));
        }
    }
});

// Get all videos for a topic
const getVideosByTopicId = async (req, res) => {
    const { topicId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM videos WHERE topic_id = $1 ORDER BY id', [topicId]);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching videos',
            error: error.message
        });
    }
};

// Get single video
const getVideoById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching video',
            error: error.message
        });
    }
};

// Upload video
const uploadVideo = async (req, res) => {
    const { topic_id, title } = req.body;

    if (!topic_id) {
        return res.status(400).json({
            success: false,
            message: 'Topic ID is required'
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No video file provided'
        });
    }

    try {
        // Check if topic exists
        const topicCheck = await pool.query('SELECT id FROM topics WHERE id = $1', [topic_id]);
        if (topicCheck.rows.length === 0) {
            // Delete uploaded file if topic doesn't exist
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        const result = await pool.query(
            'INSERT INTO videos (topic_id, file_name, file_path, title) VALUES ($1, $2, $3, $4) RETURNING *',
            [topic_id, req.file.originalname, req.file.path, title]
        );

        res.status(201).json({
            success: true,
            message: 'Video uploaded successfully',
            data: result.rows[0]
        });
    } catch (error) {
        // Delete uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error uploading video:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading video',
            error: error.message
        });
    }
};

// Update video metadata
const updateVideo = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const result = await pool.query(
            'UPDATE videos SET title = $1 WHERE id = $2 RETURNING *',
            [title, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        res.json({
            success: true,
            message: 'Video updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating video',
            error: error.message
        });
    }
};

// Delete video
const deleteVideo = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM videos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        // Delete file from filesystem
        const filePath = result.rows[0].file_path;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({
            success: true,
            message: 'Video deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting video',
            error: error.message
        });
    }
};

module.exports = {
    getVideosByTopicId,
    getVideoById,
    uploadVideo,
    updateVideo,
    deleteVideo,
    upload
};
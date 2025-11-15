const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/images';
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
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get all images for a subtopic
const getImagesBySubtopicId = async (req, res) => {
    const { subtopicId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM images WHERE subtopic_id = $1 ORDER BY id', [subtopicId]);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching images',
            error: error.message
        });
    }
};

// Upload image
const uploadImage = async (req, res) => {
    const { subtopic_id, alt_text } = req.body;

    if (!subtopic_id) {
        return res.status(400).json({
            success: false,
            message: 'Subtopic ID is required'
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No image file provided'
        });
    }

    try {
        // Check if subtopic exists
        const subtopicCheck = await pool.query('SELECT id FROM subtopics WHERE id = $1', [subtopic_id]);
        if (subtopicCheck.rows.length === 0) {
            // Delete uploaded file if subtopic doesn't exist
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                success: false,
                message: 'Subtopic not found'
            });
        }

        const result = await pool.query(
            'INSERT INTO images (subtopic_id, file_name, file_path, alt_text) VALUES ($1, $2, $3, $4) RETURNING *',
            [subtopic_id, req.file.originalname, req.file.path, alt_text]
        );

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: result.rows[0]
        });
    } catch (error) {
        // Delete uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
};

// Update image metadata
const updateImage = async (req, res) => {
    const { id } = req.params;
    const { alt_text } = req.body;

    try {
        const result = await pool.query(
            'UPDATE images SET alt_text = $1 WHERE id = $2 RETURNING *',
            [alt_text, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            message: 'Image updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating image',
            error: error.message
        });
    }
};

// Delete image
const deleteImage = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM images WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete file from filesystem
        const filePath = result.rows[0].file_path;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting image',
            error: error.message
        });
    }
};

module.exports = {
    getImagesBySubtopicId,
    uploadImage,
    updateImage,
    deleteImage,
    upload
};
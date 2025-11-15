const pool = require('../config/database');

// Get all subtopics for a topic
const getSubtopicsByTopicId = async (req, res) => {
    const { topicId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                st.*,
                array_agg(
                    CASE WHEN i.id IS NOT NULL 
                    THEN json_build_object('id', i.id, 'file_name', i.file_name, 'file_path', i.file_path, 'alt_text', i.alt_text)
                    ELSE NULL END
                ) as images
            FROM subtopics st
            LEFT JOIN images i ON st.id = i.subtopic_id
            WHERE st.topic_id = $1
            GROUP BY st.id
            ORDER BY st.id
        `, [topicId]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching subtopics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subtopics',
            error: error.message
        });
    }
};

// Get single subtopic
const getSubtopicById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                st.*,
                array_agg(
                    CASE WHEN i.id IS NOT NULL 
                    THEN json_build_object('id', i.id, 'file_name', i.file_name, 'file_path', i.file_path, 'alt_text', i.alt_text)
                    ELSE NULL END
                ) as images
            FROM subtopics st
            LEFT JOIN images i ON st.id = i.subtopic_id
            WHERE st.id = $1
            GROUP BY st.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subtopic not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching subtopic:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subtopic',
            error: error.message
        });
    }
};

// Create new subtopic
const createSubtopic = async (req, res) => {
    const { topic_id, title, content } = req.body;

    if (!topic_id || !title) {
        return res.status(400).json({
            success: false,
            message: 'Topic ID and title are required'
        });
    }

    try {
        // Check if topic exists
        const topicCheck = await pool.query('SELECT id FROM topics WHERE id = $1', [topic_id]);
        if (topicCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        const result = await pool.query(
            'INSERT INTO subtopics (topic_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [topic_id, title, content]
        );

        res.status(201).json({
            success: true,
            message: 'Subtopic created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating subtopic:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating subtopic',
            error: error.message
        });
    }
};

// Update subtopic
const updateSubtopic = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    try {
        const result = await pool.query(
            'UPDATE subtopics SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subtopic not found'
            });
        }

        res.json({
            success: true,
            message: 'Subtopic updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating subtopic:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating subtopic',
            error: error.message
        });
    }
};

// Delete subtopic
const deleteSubtopic = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM subtopics WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subtopic not found'
            });
        }

        res.json({
            success: true,
            message: 'Subtopic deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subtopic:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting subtopic',
            error: error.message
        });
    }
};

module.exports = {
    getSubtopicsByTopicId,
    getSubtopicById,
    createSubtopic,
    updateSubtopic,
    deleteSubtopic
};
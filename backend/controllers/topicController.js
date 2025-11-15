// const pool = require('../config/database');

// // Get all topics
// const getAllTopics = async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM topics ORDER BY id DESC');
//         res.json({
//             success: true,
//             data: result.rows
//         });
//     } catch (error) {
//         console.error('Error fetching topics:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching topics',
//             error: error.message
//         });
//     }
// };

// // Get single topic with all related data
// const getTopicById = async (req, res) => {
//     const { id } = req.params;
    
//     try {
//         // Get topic
//         const topicResult = await pool.query('SELECT * FROM topics WHERE id = $1', [id]);
        
//         if (topicResult.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Topic not found'
//             });
//         }

//         // Get subtopics with images
//         const subtopicsResult = await pool.query(`
//             SELECT 
//                 st.id, st.title, st.content,
//                 array_agg(
//                     CASE WHEN i.id IS NOT NULL 
//                     THEN json_build_object('id', i.id, 'file_name', i.file_name, 'file_path', i.file_path, 'alt_text', i.alt_text)
//                     ELSE NULL END
//                 ) as images
//             FROM subtopics st
//             LEFT JOIN images i ON st.id = i.subtopic_id
//             WHERE st.topic_id = $1
//             GROUP BY st.id, st.title, st.content
//             ORDER BY st.id
//         `, [id]);

//         // Get videos
//         const videosResult = await pool.query('SELECT * FROM videos WHERE topic_id = $1 ORDER BY id', [id]);

//         res.json({
//             success: true,
//             data: {
//                 topic: topicResult.rows[0],
//                 subtopics: subtopicsResult.rows,
//                 videos: videosResult.rows
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching topic:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching topic',
//             error: error.message
//         });
//     }
// };

// // Create new topic
// const createTopic = async (req, res) => {
//     const { title, description } = req.body;

//     if (!title) {
//         return res.status(400).json({
//             success: false,
//             message: 'Title is required'
//         });
//     }

//     try {
//         const result = await pool.query(
//             'INSERT INTO topics (title, description) VALUES ($1, $2) RETURNING *',
//             [title, description]
//         );

//         res.status(201).json({
//             success: true,
//             message: 'Topic created successfully',
//             data: result.rows[0]
//         });
//     } catch (error) {
//         console.error('Error creating topic:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating topic',
//             error: error.message
//         });
//     }
// };

// // Update topic
// const updateTopic = async (req, res) => {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     if (!title) {
//         return res.status(400).json({
//             success: false,
//             message: 'Title is required'
//         });
//     }

//     try {
//         const result = await pool.query(
//             'UPDATE topics SET title = $1, description = $2 WHERE id = $3 RETURNING *',
//             [title, description, id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Topic not found'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Topic updated successfully',
//             data: result.rows[0]
//         });
//     } catch (error) {
//         console.error('Error updating topic:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating topic',
//             error: error.message
//         });
//     }
// };

// // Delete topic
// const deleteTopic = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const result = await pool.query('DELETE FROM topics WHERE id = $1 RETURNING *', [id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Topic not found'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Topic deleted successfully'
//         });
//     } catch (error) {
//         console.error('Error deleting topic:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error deleting topic',
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     getAllTopics,
//     getTopicById,
//     createTopic,
//     updateTopic,
//     deleteTopic
// };


const pool = require('../config/database');

// Get all topics
const getAllTopics = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM topics ORDER BY id DESC');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching topics',
            error: error.message
        });
    }
};

// Get single topic with all related data
const getTopicById = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get topic
        const topicResult = await pool.query('SELECT * FROM topics WHERE id = $1', [id]);
        
        if (topicResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        // Get subtopics with images
        const subtopicsResult = await pool.query(`
            SELECT 
                st.id, st.title, st.content,
                array_agg(
                    CASE WHEN i.id IS NOT NULL 
                    THEN json_build_object('id', i.id, 'file_name', i.file_name, 'file_path', i.file_path, 'alt_text', i.alt_text)
                    ELSE NULL END
                ) as images
            FROM subtopics st
            LEFT JOIN images i ON st.id = i.subtopic_id
            WHERE st.topic_id = $1
            GROUP BY st.id, st.title, st.content
            ORDER BY st.id
        `, [id]);

        // Get videos
        const videosResult = await pool.query('SELECT * FROM videos WHERE topic_id = $1 ORDER BY id', [id]);

        res.json({
            success: true,
            data: {
                topic: topicResult.rows[0],
                subtopics: subtopicsResult.rows,
                videos: videosResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching topic',
            error: error.message
        });
    }
};

// Create new topic
const createTopic = async (req, res) => {
    const { title, description, theme } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    // Validate theme - now accepting the short values
    const validThemes = ['card', 'dark', 'purple'];
    const selectedTheme = theme && validThemes.includes(theme) ? theme : 'card';

    try {
        const result = await pool.query(
            'INSERT INTO topics (title, description, theme) VALUES ($1, $2, $3) RETURNING *',
            [title, description, selectedTheme]
        );

        res.status(201).json({
            success: true,
            message: 'Topic created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating topic',
            error: error.message
        });
    }
};

// Update topic
const updateTopic = async (req, res) => {
    const { id } = req.params;
    const { title, description, theme } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    // Validate theme - now accepting the short values
    const validThemes = ['card', 'dark', 'purple'];
    const selectedTheme = theme && validThemes.includes(theme) ? theme : 'card';

    try {
        const result = await pool.query(
            'UPDATE topics SET title = $1, description = $2, theme = $3 WHERE id = $4 RETURNING *',
            [title, description, selectedTheme, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        res.json({
            success: true,
            message: 'Topic updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating topic',
            error: error.message
        });
    }
};

// Delete topic
const deleteTopic = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM topics WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        res.json({
            success: true,
            message: 'Topic deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting topic',
            error: error.message
        });
    }
};

module.exports = {
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic
};
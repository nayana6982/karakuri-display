// const pool = require('../config/database');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs').promises;

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadDir = `uploads/${req.body.context || 'general'}`;
//     try {
//       await fs.mkdir(uploadDir, { recursive: true });
//       cb(null, uploadDir);
//     } catch (error) {
//       cb(error);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedImages = /jpeg|jpg|png|gif|webp/;
//   const allowedVideos = /mp4|avi|mov|wmv|flv|webm/;
//   const extname = allowedImages.test(path.extname(file.originalname).toLowerCase()) ||
//                   allowedVideos.test(path.extname(file.originalname).toLowerCase());
  
//   if (extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only image and video files are allowed'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 100 * 1024 * 1024 // 100MB limit
//   },
//   fileFilter: fileFilter
// });

// // ==================== PARTS CRUD ====================

// const createPart = async (req, res) => {
//   try {
//     const { name } = req.body;
    
//     if (!name) {
//       return res.status(400).json({ error: 'Part name is required' });
//     }

//     const result = await pool.query(
//       'INSERT INTO parts (name) VALUES ($1) RETURNING *',
//       [name]
//     );

//     res.status(201).json({
//       message: 'Part created successfully',
//       part: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error creating part:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getAllParts = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM parts ORDER BY id');
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching parts:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getPartById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('SELECT * FROM parts WHERE id = $1', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching part:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const updatePart = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;

//     if (!name) {
//       return res.status(400).json({ error: 'Part name is required' });
//     }

//     const result = await pool.query(
//       'UPDATE parts SET name = $1 WHERE id = $2 RETURNING *',
//       [name, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part not found' });
//     }

//     res.json({
//       message: 'Part updated successfully',
//       part: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error updating part:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const deletePart = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Delete associated media files first
//     const mediaResult = await pool.query(
//       'SELECT file_path FROM media_files WHERE part_id = $1',
//       [id]
//     );
    
//     for (const media of mediaResult.rows) {
//       try {
//         await fs.unlink(media.file_path);
//       } catch (fileError) {
//         console.warn('Could not delete file:', media.file_path);
//       }
//     }

//     const result = await pool.query('DELETE FROM parts WHERE id = $1 RETURNING *', [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part not found' });
//     }

//     res.json({ message: 'Part deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting part:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // ==================== PART FUNCTIONS CRUD ====================

// const createPartFunction = async (req, res) => {
//   try {
//     const { part_id, description } = req.body;

//     if (!part_id || !description) {
//       return res.status(400).json({ error: 'Part ID and description are required' });
//     }

//     // Check if part exists
//     const partExists = await pool.query('SELECT id FROM parts WHERE id = $1', [part_id]);
//     if (partExists.rows.length === 0) {
//       return res.status(404).json({ error: 'Part not found' });
//     }

//     const result = await pool.query(
//       'INSERT INTO part_functions (part_id, description) VALUES ($1, $2) RETURNING *',
//       [part_id, description]
//     );

//     res.status(201).json({
//       message: 'Part function created successfully',
//       function: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error creating part function:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getPartFunctions = async (req, res) => {
//   try {
//     const { part_id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM part_functions WHERE part_id = $1 ORDER BY id',
//       [part_id]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching part functions:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getPartFunctionById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('SELECT * FROM part_functions WHERE id = $1', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part function not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching part function:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const updatePartFunction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;

//     if (!description) {
//       return res.status(400).json({ error: 'Description is required' });
//     }

//     const result = await pool.query(
//       'UPDATE part_functions SET description = $1 WHERE id = $2 RETURNING *',
//       [description, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part function not found' });
//     }

//     res.json({
//       message: 'Part function updated successfully',
//       function: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error updating part function:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const deletePartFunction = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Delete associated media files first
//     const mediaResult = await pool.query(
//       'SELECT file_path FROM media_files WHERE function_id = $1',
//       [id]
//     );
    
//     for (const media of mediaResult.rows) {
//       try {
//         await fs.unlink(media.file_path);
//       } catch (fileError) {
//         console.warn('Could not delete file:', media.file_path);
//       }
//     }

//     const result = await pool.query('DELETE FROM part_functions WHERE id = $1 RETURNING *', [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part function not found' });
//     }

//     res.json({ message: 'Part function deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting part function:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // ==================== PART DEFECTS CRUD ====================

// const createPartDefect = async (req, res) => {
//   try {
//     const { part_id, description } = req.body;

//     if (!part_id || !description) {
//       return res.status(400).json({ error: 'Part ID and description are required' });
//     }

//     // Check if part exists
//     const partExists = await pool.query('SELECT id FROM parts WHERE id = $1', [part_id]);
//     if (partExists.rows.length === 0) {
//       return res.status(404).json({ error: 'Part not found' });
//     }

//     const result = await pool.query(
//       'INSERT INTO part_defects (part_id, description) VALUES ($1, $2) RETURNING *',
//       [part_id, description]
//     );

//     res.status(201).json({
//       message: 'Part defect created successfully',
//       defect: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error creating part defect:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getPartDefects = async (req, res) => {
//   try {
//     const { part_id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM part_defects WHERE part_id = $1 ORDER BY id',
//       [part_id]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching part defects:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getPartDefectById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('SELECT * FROM part_defects WHERE id = $1', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part defect not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching part defect:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const updatePartDefect = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;

//     if (!description) {
//       return res.status(400).json({ error: 'Description is required' });
//     }

//     const result = await pool.query(
//       'UPDATE part_defects SET description = $1 WHERE id = $2 RETURNING *',
//       [description, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part defect not found' });
//     }

//     res.json({
//       message: 'Part defect updated successfully',
//       defect: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error updating part defect:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const deletePartDefect = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Delete associated media files first
//     const mediaResult = await pool.query(
//       'SELECT file_path FROM media_files WHERE defect_id = $1',
//       [id]
//     );
    
//     for (const media of mediaResult.rows) {
//       try {
//         await fs.unlink(media.file_path);
//       } catch (fileError) {
//         console.warn('Could not delete file:', media.file_path);
//       }
//     }

//     const result = await pool.query('DELETE FROM part_defects WHERE id = $1 RETURNING *', [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Part defect not found' });
//     }

//     res.json({ message: 'Part defect deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting part defect:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // ==================== MEDIA FILES CRUD ====================

// const uploadMedia = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: 'No files uploaded' });
//     }

//     const { part_id, function_id, defect_id, context, alt_text } = req.body;

//     if (!part_id || !context) {
//       return res.status(400).json({ error: 'Part ID and context are required' });
//     }

//     const validContexts = [
//       'part_drawing', 'assembly_video', 'function_image', 
//       'function_video', 'defect_image', 'defect_video'
//     ];

//     if (!validContexts.includes(context)) {
//       return res.status(400).json({ error: 'Invalid context' });
//     }

//     const uploadedFiles = [];

//     for (const file of req.files) {
//       const mediaType = file.mimetype.startsWith('image/') ? 'image' : 'video';
      
//       const result = await pool.query(
//         `INSERT INTO media_files (file_name, file_path, alt_text, media_type, context, part_id, function_id, defect_id) 
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
//         [
//           file.originalname,
//           file.path,
//           alt_text || null,
//           mediaType,
//           context,
//           part_id,
//           function_id || null,
//           defect_id || null
//         ]
//       );

//       uploadedFiles.push(result.rows[0]);
//     }

//     res.status(201).json({
//       message: 'Media files uploaded successfully',
//       files: uploadedFiles
//     });
//   } catch (error) {
//     console.error('Error uploading media:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };





// const getMediaByPart = async (req, res) => {
//   try {
//     const { part_id } = req.params;
//     const { context } = req.query;

//     let query = 'SELECT * FROM media_files WHERE part_id = $1';
//     const params = [part_id];

//     if (context) {
//       query += ' AND context = $2';
//       params.push(context);
//     }

//     query += ' ORDER BY id';

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching media:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getMediaByFunction = async (req, res) => {
//   try {
//     const { function_id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM media_files WHERE function_id = $1 ORDER BY id',
//       [function_id]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching function media:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getMediaByDefect = async (req, res) => {
//   try {
//     const { defect_id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM media_files WHERE defect_id = $1 ORDER BY id',
//       [defect_id]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching defect media:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getMediaById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('SELECT * FROM media_files WHERE id = $1', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Media file not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching media:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const updateMediaAltText = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { alt_text } = req.body;

//     const result = await pool.query(
//       'UPDATE media_files SET alt_text = $1 WHERE id = $2 RETURNING *',
//       [alt_text, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Media file not found' });
//     }

//     res.json({
//       message: 'Media alt text updated successfully',
//       media: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error updating media alt text:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const deleteMedia = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const result = await pool.query('SELECT * FROM media_files WHERE id = $1', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Media file not found' });
//     }

//     const media = result.rows[0];
    
//     // Delete physical file
//     try {
//       await fs.unlink(media.file_path);
//     } catch (fileError) {
//       console.warn('Could not delete physical file:', media.file_path);
//     }

//     // Delete from database
//     await pool.query('DELETE FROM media_files WHERE id = $1', [id]);

//     res.json({ message: 'Media file deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting media:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // ==================== COMPLEX QUERIES ====================

// const getCompletePartData = async (req, res) => {
//   try {
//     const { part_id } = req.params;

//     // Get part details
//     const partResult = await pool.query('SELECT * FROM parts WHERE id = $1', [part_id]);
    
//     if (partResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Part not found' });
//     }

//     const part = partResult.rows[0];

//     // Get functions with their media
//     const functionsResult = await pool.query(`
//       SELECT pf.*, 
//              json_agg(
//                json_build_object(
//                  'id', mf.id,
//                  'file_name', mf.file_name,
//                  'file_path', mf.file_path,
//                  'alt_text', mf.alt_text,
//                  'media_type', mf.media_type,
//                  'context', mf.context
//                ) ORDER BY mf.id
//              ) FILTER (WHERE mf.id IS NOT NULL) as media
//       FROM part_functions pf
//       LEFT JOIN media_files mf ON pf.id = mf.function_id
//       WHERE pf.part_id = $1
//       GROUP BY pf.id
//       ORDER BY pf.id
//     `, [part_id]);

//     // Get defects with their media
//     const defectsResult = await pool.query(`
//       SELECT pd.*, 
//              json_agg(
//                json_build_object(
//                  'id', mf.id,
//                  'file_name', mf.file_name,
//                  'file_path', mf.file_path,
//                  'alt_text', mf.alt_text,
//                  'media_type', mf.media_type,
//                  'context', mf.context
//                ) ORDER BY mf.id
//              ) FILTER (WHERE mf.id IS NOT NULL) as media
//       FROM part_defects pd
//       LEFT JOIN media_files mf ON pd.id = mf.defect_id
//       WHERE pd.part_id = $1
//       GROUP BY pd.id
//       ORDER BY pd.id
//     `, [part_id]);

//     // Get part-level media (drawings and assembly videos)
//     const partMediaResult = await pool.query(`
//       SELECT * FROM media_files 
//       WHERE part_id = $1 AND function_id IS NULL AND defect_id IS NULL
//       ORDER BY context, id
//     `, [part_id]);

//     res.json({
//       part: part,
//       functions: functionsResult.rows,
//       defects: defectsResult.rows,
//       partMedia: partMediaResult.rows
//     });
//   } catch (error) {
//     console.error('Error fetching complete part data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
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
// };




const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = `uploads/${req.body.context || 'general'}`;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImages = /jpeg|jpg|png|gif|webp/;
  const allowedVideos = /mp4|avi|mov|wmv|flv|webm/;
  const extname = allowedImages.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedVideos.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: fileFilter
});

// ==================== PARTS CRUD ====================

const createPart = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Part name is required' });
    }

    const result = await pool.query(
      'INSERT INTO parts (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json({
      message: 'Part created successfully',
      part: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating part:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllParts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parts ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPartById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM parts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching part:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Part name is required' });
    }

    const result = await pool.query(
      'UPDATE parts SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    res.json({
      message: 'Part updated successfully',
      part: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating part:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePart = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete associated part drawing files
    const drawingsResult = await pool.query(
      'SELECT file_path FROM part_drawings WHERE part_id = $1',
      [id]
    );
    
    for (const drawing of drawingsResult.rows) {
      try {
        await fs.unlink(drawing.file_path);
      } catch (fileError) {
        console.warn('Could not delete file:', drawing.file_path);
      }
    }

    // Delete associated assembly video files
    const videosResult = await pool.query(
      'SELECT file_path FROM assembly_videos WHERE part_id = $1',
      [id]
    );
    
    for (const video of videosResult.rows) {
      try {
        await fs.unlink(video.file_path);
      } catch (fileError) {
        console.warn('Could not delete file:', video.file_path);
      }
    }

    // Delete associated function media files
    const functionsResult = await pool.query(
      'SELECT image_file_path, video_file_path FROM part_functions WHERE part_id = $1',
      [id]
    );
    
    for (const func of functionsResult.rows) {
      if (func.image_file_path) {
        try {
          await fs.unlink(func.image_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', func.image_file_path);
        }
      }
      if (func.video_file_path) {
        try {
          await fs.unlink(func.video_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', func.video_file_path);
        }
      }
    }

    // Delete associated defect media files
    const defectsResult = await pool.query(
      'SELECT image_file_path, video_file_path FROM part_defects WHERE part_id = $1',
      [id]
    );
    
    for (const defect of defectsResult.rows) {
      if (defect.image_file_path) {
        try {
          await fs.unlink(defect.image_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', defect.image_file_path);
        }
      }
      if (defect.video_file_path) {
        try {
          await fs.unlink(defect.video_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', defect.video_file_path);
        }
      }
    }

    const result = await pool.query('DELETE FROM parts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    res.json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Error deleting part:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== PART FUNCTIONS CRUD ====================

const createPartFunction = async (req, res) => {
  try {
    const { part_id, description } = req.body;

    if (!part_id || !description) {
      return res.status(400).json({ error: 'Part ID and description are required' });
    }

    // Check if part exists
    const partExists = await pool.query('SELECT id FROM parts WHERE id = $1', [part_id]);
    if (partExists.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    const result = await pool.query(
      'INSERT INTO part_functions (part_id, description) VALUES ($1, $2) RETURNING *',
      [part_id, description]
    );

    res.status(201).json({
      message: 'Part function created successfully',
      function: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating part function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPartFunctions = async (req, res) => {
  try {
    const { part_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM part_functions WHERE part_id = $1 ORDER BY id',
      [part_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching part functions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPartFunctionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM part_functions WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part function not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching part function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePartFunction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const result = await pool.query(
      'UPDATE part_functions SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part function not found' });
    }

    res.json({
      message: 'Part function updated successfully',
      function: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating part function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePartFunction = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the function to delete associated media files
    const functionResult = await pool.query(
      'SELECT image_file_path, video_file_path FROM part_functions WHERE id = $1',
      [id]
    );
    
    if (functionResult.rows.length > 0) {
      const func = functionResult.rows[0];
      
      if (func.image_file_path) {
        try {
          await fs.unlink(func.image_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', func.image_file_path);
        }
      }
      
      if (func.video_file_path) {
        try {
          await fs.unlink(func.video_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', func.video_file_path);
        }
      }
    }

    const result = await pool.query('DELETE FROM part_functions WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part function not found' });
    }

    res.json({ message: 'Part function deleted successfully' });
  } catch (error) {
    console.error('Error deleting part function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== PART DEFECTS CRUD ====================

const createPartDefect = async (req, res) => {
  try {
    const { part_id, description } = req.body;

    if (!part_id || !description) {
      return res.status(400).json({ error: 'Part ID and description are required' });
    }

    // Check if part exists
    const partExists = await pool.query('SELECT id FROM parts WHERE id = $1', [part_id]);
    if (partExists.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    const result = await pool.query(
      'INSERT INTO part_defects (part_id, description) VALUES ($1, $2) RETURNING *',
      [part_id, description]
    );

    res.status(201).json({
      message: 'Part defect created successfully',
      defect: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating part defect:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPartDefects = async (req, res) => {
  try {
    const { part_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM part_defects WHERE part_id = $1 ORDER BY id',
      [part_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching part defects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPartDefectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM part_defects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part defect not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching part defect:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePartDefect = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const result = await pool.query(
      'UPDATE part_defects SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part defect not found' });
    }

    res.json({
      message: 'Part defect updated successfully',
      defect: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating part defect:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePartDefect = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the defect to delete associated media files
    const defectResult = await pool.query(
      'SELECT image_file_path, video_file_path FROM part_defects WHERE id = $1',
      [id]
    );
    
    if (defectResult.rows.length > 0) {
      const defect = defectResult.rows[0];
      
      if (defect.image_file_path) {
        try {
          await fs.unlink(defect.image_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', defect.image_file_path);
        }
      }
      
      if (defect.video_file_path) {
        try {
          await fs.unlink(defect.video_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', defect.video_file_path);
        }
      }
    }

    const result = await pool.query('DELETE FROM part_defects WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part defect not found' });
    }

    res.json({ message: 'Part defect deleted successfully' });
  } catch (error) {
    console.error('Error deleting part defect:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== PART DRAWINGS CRUD ====================

const uploadPartDrawing = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { part_id, alt_text } = req.body;

    if (!part_id) {
      return res.status(400).json({ error: 'Part ID is required' });
    }

    const result = await pool.query(
      'INSERT INTO part_drawings (part_id, file_name, file_path, alt_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [part_id, req.file.originalname, req.file.path, alt_text || null]
    );

    res.status(201).json({
      message: 'Part drawing uploaded successfully',
      drawing: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading part drawing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPartDrawings = async (req, res) => {
  try {
    const { part_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM part_drawings WHERE part_id = $1 ORDER BY id',
      [part_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching part drawings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePartDrawing = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM part_drawings WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part drawing not found' });
    }

    const drawing = result.rows[0];
    
    // Delete physical file
    try {
      await fs.unlink(drawing.file_path);
    } catch (fileError) {
      console.warn('Could not delete physical file:', drawing.file_path);
    }

    // Delete from database
    await pool.query('DELETE FROM part_drawings WHERE id = $1', [id]);

    res.json({ message: 'Part drawing deleted successfully' });
  } catch (error) {
    console.error('Error deleting part drawing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== ASSEMBLY VIDEOS CRUD ====================

const uploadAssemblyVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { part_id, alt_text } = req.body;

    if (!part_id) {
      return res.status(400).json({ error: 'Part ID is required' });
    }

    const result = await pool.query(
      'INSERT INTO assembly_videos (part_id, file_name, file_path, alt_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [part_id, req.file.originalname, req.file.path, alt_text || null]
    );

    res.status(201).json({
      message: 'Assembly video uploaded successfully',
      video: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading assembly video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAssemblyVideos = async (req, res) => {
  try {
    const { part_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM assembly_videos WHERE part_id = $1 ORDER BY id',
      [part_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assembly videos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAssemblyVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM assembly_videos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assembly video not found' });
    }

    const video = result.rows[0];
    
    // Delete physical file
    try {
      await fs.unlink(video.file_path);
    } catch (fileError) {
      console.warn('Could not delete physical file:', video.file_path);
    }

    // Delete from database
    await pool.query('DELETE FROM assembly_videos WHERE id = $1', [id]);

    res.json({ message: 'Assembly video deleted successfully' });
  } catch (error) {
    console.error('Error deleting assembly video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== FUNCTION MEDIA CRUD ====================

const uploadFunctionMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { function_id, media_type, alt_text } = req.body;

    if (!function_id || !media_type) {
      return res.status(400).json({ error: 'Function ID and media type are required' });
    }

    if (!['image', 'video'].includes(media_type)) {
      return res.status(400).json({ error: 'Media type must be either image or video' });
    }

    const updateFields = media_type === 'image' ? 
      'image_file_name = $1, image_file_path = $2, image_alt_text = $3' :
      'video_file_name = $1, video_file_path = $2, video_alt_text = $3';

    const result = await pool.query(
      `UPDATE part_functions SET ${updateFields} WHERE id = $4 RETURNING *`,
      [req.file.originalname, req.file.path, alt_text || null, function_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Function not found' });
    }

    res.status(201).json({
      message: `Function ${media_type} uploaded successfully`,
      function: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading function media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFunctionMedia = async (req, res) => {
  try {
    const { function_id, media_type } = req.params;

    if (!['image', 'video'].includes(media_type)) {
      return res.status(400).json({ error: 'Media type must be either image or video' });
    }

    const selectField = media_type === 'image' ? 'image_file_path' : 'video_file_path';
    const updateFields = media_type === 'image' ? 
      'image_file_name = NULL, image_file_path = NULL, image_alt_text = NULL' :
      'video_file_name = NULL, video_file_path = NULL, video_alt_text = NULL';

    // Get the current file path
    const result = await pool.query(
      `SELECT ${selectField} FROM part_functions WHERE id = $1`,
      [function_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Function not found' });
    }

    const filePath = result.rows[0][selectField];

    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.warn('Could not delete physical file:', filePath);
      }
    }

    // Update database to remove file references
    await pool.query(
      `UPDATE part_functions SET ${updateFields} WHERE id = $1`,
      [function_id]
    );

    res.json({ message: `Function ${media_type} deleted successfully` });
  } catch (error) {
    console.error('Error deleting function media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== DEFECT MEDIA CRUD ====================

const uploadDefectMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { defect_id, media_type, alt_text } = req.body;

    if (!defect_id || !media_type) {
      return res.status(400).json({ error: 'Defect ID and media type are required' });
    }

    if (!['image', 'video'].includes(media_type)) {
      return res.status(400).json({ error: 'Media type must be either image or video' });
    }

    const updateFields = media_type === 'image' ? 
      'image_file_name = $1, image_file_path = $2, image_alt_text = $3' :
      'video_file_name = $1, video_file_path = $2, video_alt_text = $3';

    const result = await pool.query(
      `UPDATE part_defects SET ${updateFields} WHERE id = $4 RETURNING *`,
      [req.file.originalname, req.file.path, alt_text || null, defect_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Defect not found' });
    }

    res.status(201).json({
      message: `Defect ${media_type} uploaded successfully`,
      defect: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading defect media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteDefectMedia = async (req, res) => {
  try {
    const { defect_id, media_type } = req.params;

    if (!['image', 'video'].includes(media_type)) {
      return res.status(400).json({ error: 'Media type must be either image or video' });
    }

    const selectField = media_type === 'image' ? 'image_file_path' : 'video_file_path';
    const updateFields = media_type === 'image' ? 
      'image_file_name = NULL, image_file_path = NULL, image_alt_text = NULL' :
      'video_file_name = NULL, video_file_path = NULL, video_alt_text = NULL';

    // Get the current file path
    const result = await pool.query(
      `SELECT ${selectField} FROM part_defects WHERE id = $1`,
      [defect_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Defect not found' });
    }

    const filePath = result.rows[0][selectField];

    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.warn('Could not delete physical file:', filePath);
      }
    }

    // Update database to remove file references
    await pool.query(
      `UPDATE part_defects SET ${updateFields} WHERE id = $1`,
      [defect_id]
    );

    res.json({ message: `Defect ${media_type} deleted successfully` });
  } catch (error) {
    console.error('Error deleting defect media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== COMPLEX QUERIES ====================

const getCompletePartData = async (req, res) => {
  try {
    const { part_id } = req.params;

    // Get part details
    const partResult = await pool.query('SELECT * FROM parts WHERE id = $1', [part_id]);
    
    if (partResult.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    const part = partResult.rows[0];

    // Get functions with their media
    const functionsResult = await pool.query(
      'SELECT * FROM part_functions WHERE part_id = $1 ORDER BY id',
      [part_id]
    );

    // Get defects with their media
    const defectsResult = await pool.query(
      'SELECT * FROM part_defects WHERE part_id = $1 ORDER BY id',
      [part_id]
    );

    // Get part drawings
    const drawingsResult = await pool.query(
      'SELECT * FROM part_drawings WHERE part_id = $1 ORDER BY id',
      [part_id]
    );

    // Get assembly videos
    const videosResult = await pool.query(
      'SELECT * FROM assembly_videos WHERE part_id = $1 ORDER BY id',
      [part_id]
    );

    res.json({
      part: part,
      functions: functionsResult.rows,
      defects: defectsResult.rows,
      drawings: drawingsResult.rows,
      assemblyVideos: videosResult.rows
    });
  } catch (error) {
    console.error('Error fetching complete part data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
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
  getCompletePartData};
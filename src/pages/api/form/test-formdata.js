// pages/api/form/test-formdata.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Nonaktifkan bodyParser bawaan
export const config = {
  api: { bodyParser: false },
};

// Pastikan folder tmp ada
const uploadDir = path.join(process.cwd(), '/tmp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  console.log('Test FormData API dipanggil');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Setup formidable dengan opsi yang lebih toleran
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  try {
    const parseForm = () => new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Test parsing error:", err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const { fields, files } = await parseForm();
    
    console.log('Test - Form fields received:', fields);
    console.log('Test - Files received:', Object.keys(files));

    // Prepare detailed response with all received data
    const fileDetails = {};
    
    for (const [key, value] of Object.entries(files)) {
      const fileInfo = Array.isArray(value) ? value[0] : value;
      fileDetails[key] = {
        name: fileInfo.originalFilename || fileInfo.name || 'unnamed',
        size: fileInfo.size,
        type: fileInfo.mimetype || fileInfo.type || 'unknown',
        lastModified: fileInfo.lastModifiedDate?.toISOString() || 'unknown'
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Test FormData berhasil diterima',
      fields: fields,
      files: fileDetails,
      headers: {
        contentType: req.headers['content-type'],
        contentLength: req.headers['content-length']
      }
    });
  } catch (error) {
    console.error('TEST FORMDATA ERROR:', error);
    return res.status(500).json({ 
      message: 'Terjadi kesalahan saat test FormData.', 
      error: error.message,
      stack: error.stack
    });
  }
}
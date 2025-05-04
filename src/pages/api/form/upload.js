import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

// Disable default bodyParser
export const config = {
  api: { bodyParser: false },
};

// Configure upload directory
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Configure formidable
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowEmptyFiles: false,
    filename: (name, ext, part, form) => {
      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      return `${part.name || 'file'}-${uniqueSuffix}${ext}`;
    }
  });

  try {
    // Parse form data
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Validate form ID
    const formId = fields.formId?.[0] || fields.formId;
    if (!formId) {
      return res.status(400).json({ message: 'ID form tidak ditemukan' });
    }

    // Validate file
    const file = files.dokumenPersyaratan?.[0] || files.dokumenPersyaratan;
    if (!file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      // Delete invalid file
      if (file.filepath) {
        fs.unlinkSync(file.filepath);
      }
      return res.status(400).json({ message: 'Tipe file tidak valid' });
    }

    // Create relative path for database
    const relativePath = `/uploads/${path.basename(file.filepath)}`;

    // Connect to database
    await prisma.$connect();

    // Update form in database
    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: {
        dokumenPersyaratan: relativePath,
        namaFileAsli: file.originalFilename || 'document'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Upload berhasil',
      filePath: relativePath,
      originalName: file.originalFilename
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: 'Terjadi kesalahan saat upload',
      error: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}
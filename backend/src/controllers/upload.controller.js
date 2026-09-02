import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { sendSuccess, sendError } from '../utils/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target images directory at root (/tmp for Vercel/serverless environments)
const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'images')
  : path.resolve(__dirname, '../../../images');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  // Gracefully handle read-only file systems in serverless runtimes
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e4);
    cb(null, `upload_${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Sadece JPG, PNG, WEBP veya GIF formatında görsel yükleyebilirsiniz.'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
}).single('file');

export async function uploadImage(req, res) {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return sendError(res, 400, 'UPLOAD_ERROR', err.message || 'Dosya yükleme hatası.');
    }

    if (!req.file) {
      return sendError(res, 400, 'NO_FILE', 'Lütfen bilgisayarınızdan bir fotoğraf seçiniz.');
    }

    const relativePath = `images/${req.file.filename}`;

    return sendSuccess(res, {
      imageUrl: relativePath,
      filename: req.file.filename,
      size: req.file.size
    }, 201, 'Fotoğraf başarıyla yüklendi.');
  });
}

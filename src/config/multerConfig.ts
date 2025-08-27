import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.path.includes('events')
      ? 'Uploads/events'
      : 'Uploads/gifts';
    ensureDirExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const prefix = req.path.includes('events') ? 'event' : 'gift';
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${prefix}_${Date.now()}_${sanitizedName}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Увеличен лимит до 10 МБ
    fields: 10, // Лимит на количество текстовых полей
    files: 1,
  },
}).single('image');

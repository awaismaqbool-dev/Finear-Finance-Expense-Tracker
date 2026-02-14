import multer from "multer";
import path from "path";
import fs from 'fs';
const uploadDir = 'uploadImages/';

// Agar folder nahi hai toh bana do
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// 1. Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique name taake agar do log 'profile.jpg' upload karein toh overwrite na ho
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    },
});

export const upload = multer({ storage });
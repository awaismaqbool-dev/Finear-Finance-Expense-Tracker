import multer from "multer";
import path from "path";

// 1. Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploadImages/"); // Folder path sahi rakho
    },
    filename: (req, file, cb) => {
        // Unique name taake agar do log 'profile.jpg' upload karein toh overwrite na ho
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    },
});

export const upload = multer({ storage });
const multer = require("multer");
const fs = require("fs");
const path = require("path");



const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"), 
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    },
});

const upload = multer({ storage: storage });
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const musicUploader = (req, res, next) => {
    upload.single("song")(req, res, async (err) => { 
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "rythm_musics",
            });
            req.body.music = result.secure_url; 

            fs.unlink(req.file.path, (unlinkErr) => { 
                if (unlinkErr) {
                    console.log("Error in unlinking the file ", unlinkErr);
                }
            });
            next();
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error uploading file to Cloudinary",
            });
        }
    });
};

module.exports = musicUploader;

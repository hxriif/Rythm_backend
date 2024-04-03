const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});



const upload = multer({ storage: storage });



const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});





const imageuploader = (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "no file uploaded" });
        }
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "rythm_images",
            });
            req.body.image = result.secure_url;

            fs.unlink(req.file.path, (unlinker) => {
                if (unlinker) {
                    console.log("Error in unlinking the image ");
                }
            });
            next();
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error uploading file to clodinary",
            });
        }
    });
};

module.exports = imageuploader;
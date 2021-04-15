const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    folder: 'project-module2-repo', // folder that will be created inside Cloudinary
    resource_type: 'image', // only images allowed
    allowed_formats: ['jpg', 'png', 'jpeg'],
    use_filename: true,
    unique_filename: true, // will add random characters to the filename to guarantee unique file names
  },
});

//                        storage: storage
const uploadCloud = multer({ storage });

module.exports = uploadCloud;

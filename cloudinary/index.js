//Multer:
//Multer is a middleware for handling multipart/form-data, which is used for uploading files. It is commonly used with Express.js applications to handle file uploads.

//multer-storage-cloudinary:
//This package acts as a bridge between Multer and Cloudinary. It allows you to use Cloudinary as a storage backend for files uploaded through Multer.

//When you use Multer to handle file uploads, you need to specify a storage engine that defines where the uploaded files will be stored. Multer's default storage engine stores files on the local file system. However, with CloudinaryStorage, you can configure Multer to store files directly in your Cloudinary account.
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Configures the Cloudinary instance with your Cloudinary account details.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
//Creates a new instance of CloudinaryStorage with specific configuration options.
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg','png', 'jpg']
    }
    
})

module.exports = {
    cloudinary,
    storage
}


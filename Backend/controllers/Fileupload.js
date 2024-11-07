const File = require("../Models/File");
const cloudinary = require("cloudinary").v2;

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

// Upload file to Cloudinary function
async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    console.log("Temp file path", file.tempFilePath);

    if (quality) {
        options.quality = quality;
    }

    options.resource_type = "auto"; // Automatically detect file type (image, pdf, etc.)
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Image or PDF upload handler
exports.fileUpload = async (req, res) => {
    try {
        // Fetch data from the request
        const { name, tags, email } = req.body;
        console.log("Name is:", name);

        const file = req.files.file; // Accept file with a generic name
        console.log("File details:", file);

        // Validation
        const supportedTypes = ["jpg", "jpeg", "png", "pdf"]; // Include "pdf" in supported types
        const fileType = file.name.split('.').pop().toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'File format not supported',
            });
        }

        console.log("Uploading to Cloudinary");
        const response = await uploadFileToCloudinary(file, "YourFolderName");
        console.log("Cloudinary Response:", response);

        // Save to database
        const fileData = await File.create({
            name,
            tags,
            email,
            fileUrl: response.secure_url,
            fileType,
        });

        res.json({
            success: true,
            fileUrl: response.secure_url,
            message: 'File successfully uploaded',
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

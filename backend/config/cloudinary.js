import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

let configured = false;

if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
    console.log("Cloudinary configured");
} else {
    console.warn("Cloudinary not configured — image uploads will use local paths");
}

export async function uploadToCloudinary(filePath, folder = "medicare") {
    if (!configured) {
        // Return the local path as the URL when Cloudinary is not configured
        return { secure_url: `/uploads/${filePath.split(/[\\/]/).pop()}`, public_id: null };
    }
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder });
        // Clean up temp file
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}

export async function deleteFromCloudinary(publicId) {
    if (!configured || !publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.warn("Cloudinary delete warning:", error?.message || error);
    }
}

export default cloudinary;

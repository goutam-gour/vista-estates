import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath, folder = "properties") => {
  const isCloudinaryConfigured =
    Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
    Boolean(process.env.CLOUDINARY_API_KEY) &&
    process.env.CLOUDINARY_API_KEY !== "your_api_key";

  if (!isCloudinaryConfigured) {
    const filename = filePath.split(/[\\/]/).pop();
    return `/uploads/${filename}`;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `estatify/${folder}`,
      resource_type: "image",
    });

    // Remove local temp file after upload
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      // ignore unlink error
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error, using local path:", error.message);
    const filename = filePath.split(/[\\/]/).pop();
    return `/uploads/${filename}`;
  }
};

export default cloudinary;
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
      return;
    }

    const url = new URL(imageUrl);
    const uploadPath = url.pathname.split("/upload/")[1];

    if (!uploadPath) return;

    const publicId = uploadPath
      .replace(/^v\d+\//, "")
      .replace(/\.[^/.]+$/, "");

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary delete result:", result);
    return result;

  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};
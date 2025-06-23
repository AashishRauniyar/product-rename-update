// import { NextResponse } from "next/server";
// import { readFile } from "fs/promises";
// import path from "path";

// // Define the upload directory getter function
// const getUploadDir = () => {
//   const isProduction = process.env.NODE_ENV === "production";
//   return isProduction
//     ? process.env.UPLOAD_DIR ?? "/tmp/uploads"
//     : path.join(process.cwd(), "public", "uploads");
// };

// export async function GET(
//   request: Request,
//   context: { params: Promise<{ folder: string; filename: string }> }
// ): Promise<NextResponse> {
//   // Await the dynamic route params
//   const { folder, filename } = await context.params;

//   // Security check to prevent directory traversal attacks
//   if (folder.includes("..") || filename.includes("..")) {
//     return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//   }

//   // Validate allowed folders
//   const allowedFolders = ["old_images", "new_images", "badge_images"];
//   if (!allowedFolders.includes(folder)) {
//     return NextResponse.json({ error: "Folder not allowed" }, { status: 403 });
//   }

//   try {
//     // Get the base upload directory
//     const baseDir = getUploadDir();

//     // Full path to the requested file
//     const filePath = path.join(baseDir, folder, filename);

//     // Read the file
//     const fileBuffer = await readFile(filePath);

//     // Determine content type based on file extension
//     const ext = path.extname(filename).toLowerCase();
//     let contentType = "application/octet-stream"; // Default

//     if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
//     else if (ext === ".png") contentType = "image/png";
//     else if (ext === ".gif") contentType = "image/gif";
//     else if (ext === ".webp") contentType = "image/webp";
//     else if (ext === ".svg") contentType = "image/svg+xml";

//     // Return the image with the appropriate content type
//     return new NextResponse(fileBuffer, {
//       headers: {
//         "Content-Type": contentType,
//         "Cache-Control": "public, max-age=31536000", // Cache for 1 year
//       },
//     });
//   } catch (error) {
//     console.error(`Error serving image ${folder}/${filename}:`, error);
//     return NextResponse.json({ error: "Image not found" }, { status: 404 });
//   }
// }

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Define the upload directory getter function
const getUploadDir = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction
    ? process.env.UPLOAD_DIR ?? "/tmp/uploads"
    : path.join(process.cwd(), "public", "uploads");
};

export async function GET(
  request: Request,
  context: { params: Promise<{ folder: string; filename: string }> }
): Promise<NextResponse> {
  // Await the dynamic route params
  const { folder, filename } = await context.params;

  // Security check to prevent directory traversal attacks
  if (folder.includes("..") || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate allowed folders
  const allowedFolders = [
    "old_images",
    "new_images",
    "badge_images",
    "extra_badge_1",
    "extra_badge_2",
  ];

  if (!allowedFolders.includes(folder)) {
    return NextResponse.json({ error: "Folder not allowed" }, { status: 403 });
  }

  try {
    // Get the base upload directory
    const baseDir = getUploadDir();

    // Full path to the requested file
    const filePath = path.join(baseDir, folder, filename);

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream"; // Default

    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".svg") contentType = "image/svg+xml";

    // Return the image with the appropriate content type
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error(`Error serving image ${folder}/${filename}:`, error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}

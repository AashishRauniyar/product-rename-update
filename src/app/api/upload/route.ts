/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @typescript-eslint/no-unused-vars */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { NextResponse } from "next/server";
// // import { initializeDatabase, insertProduct } from "@/lib/models";
// // import fs from "fs";
// // import path from "path";
// // import db from "@/lib/db";

// // // Use /tmp in production for a writable directory; fallback to public/uploads in development.
// // const uploadDir =
// //   process.env.NODE_ENV === "production"
// //     ? path.join("/tmp", "uploads")
// //     : path.join(process.cwd(), "public", "uploads");

// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }

// // export async function POST(req: Request) {
// //   // Initialize the database/table if needed.
// //   await initializeDatabase();

// //   const formData = await req.formData();
// //   const old_name = formData.get("old_name") as string;
// //   const new_name = formData.get("new_name") as string;
// //   const description = formData.get("description") as string;
// //   const nextRedirectUrl = formData.get("next_redirect_url") as string;
// //   const theme = formData.get("theme") as string; // Expected "dark" or "light"

// //   const oldImages: string[] = [];
// //   const newImages: string[] = [];

// //   // Process file entries.
// //   for (const entry of formData.entries()) {
// //     const [key, value] = entry;
// //     if (value instanceof File) {
// //       // Generate a unique file name.
// //       const fileName = `${Date.now()}_${value.name}`;
// //       // Build the local file path.
// //       const localFilePath = path.join(uploadDir, fileName);
// //       // Read file as a buffer.
// //       const buffer = await value.arrayBuffer();
// //       fs.writeFileSync(localFilePath, Buffer.from(buffer));

// //       // Build the public URL using your environment variable.
// //       const fileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/uploads/${fileName}`;
// //       if (key === "old_images") {
// //         oldImages.push(fileUrl);
// //       } else if (key === "new_images") {
// //         newImages.push(fileUrl);
// //       }
// //     }
// //   }

// //   try {
// //     // Insert product with an empty generated_link field.
// //     const { id } = await insertProduct(
// //       old_name,
// //       new_name,
// //       description,
// //       oldImages,
// //       newImages,
// //       nextRedirectUrl,
// //       theme,
// //       "" // initially empty
// //     );
// //     // Generate a slug from old_name (e.g., "Old Product" -> "old-product").
// //     const slug = old_name.toLowerCase().trim().replace(/\s+/g, "-");
// //     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");
// //     const generatedLink = `${siteUrl}/product/${slug}-${id}`;

// //     // Update the product record with the generated link.
// //     await db.query("UPDATE products SET generated_link = ? WHERE id = ?", [
// //       generatedLink,
// //       id,
// //     ]);

// //     return NextResponse.json({
// //       message: "Batch upload successful",
// //       generatedLink,
// //     });
// //   } catch (error: any) {
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }
// // import { NextResponse } from "next/server";
// // import { initializeDatabase, insertProduct } from "@/lib/models";
// // import cloudinary from "@/lib/cloudinary";
// // import db from "@/lib/db";

// // export async function POST(req: Request) {
// //   await initializeDatabase();

// //   const formData = await req.formData();
// //   const old_name = formData.get("old_name") as string;
// //   const new_name = formData.get("new_name") as string;
// //   const description = formData.get("description") as string;
// //   const nextRedirectUrl = formData.get("next_redirect_url") as string;
// //   const theme = formData.get("theme") as string;

// //   const oldImages: string[] = [];
// //   const newImages: string[] = [];

// //   // Upload files to Cloudinary
// //   for (const entry of formData.entries()) {
// //     const [key, value] = entry;
// //     if (value instanceof File) {
// //       const buffer = await value.arrayBuffer();
// //       const uploadPromise = new Promise<string>((resolve, reject) => {
// //         const uploadStream = cloudinary.uploader.upload_stream(
// //           {
// //             folder: "uploads", // Folder in Cloudinary
// //             public_id: `${Date.now()}_${value.name}`, // Custom file name
// //           },
// //           (error, result) => {
// //             if (error) {
// //               console.error("Cloudinary Error:", error);
// //               reject("Image upload failed");
// //             } else if (result) {
// //               resolve(result.secure_url); // Use secure URL for HTTPS
// //             }
// //           }
// //         );
// //         uploadStream.end(Buffer.from(buffer));
// //       });

// //       const uploadedImageUrl = await uploadPromise;

// //       if (key === "old_images") {
// //         oldImages.push(uploadedImageUrl);
// //       } else if (key === "new_images") {
// //         newImages.push(uploadedImageUrl);
// //       }
// //     }
// //   }

// //   try {
// //     const { id } = await insertProduct(
// //       old_name,
// //       new_name,
// //       description,
// //       oldImages,
// //       newImages,
// //       nextRedirectUrl,
// //       theme,
// //       ""
// //     );

// //     const slug = old_name.toLowerCase().trim().replace(/\s+/g, "-");
// //     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");
// //     const generatedLink = `${siteUrl}/product/${slug}-${id}`;

// //     await db.query("UPDATE products SET generated_link = ? WHERE id = ?", [
// //       generatedLink,
// //       id,
// //     ]);

// //     return NextResponse.json({
// //       message: "Batch upload successful",
// //       generatedLink,
// //     });
// //   } catch (error: any) {
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }

// import { NextResponse } from "next/server";
// import { initializeDatabase, insertProduct } from "@/lib/models";
// import cloudinary from "@/lib/cloudinary";
// import db from "@/lib/db";

// export async function POST(req: Request) {
//   await initializeDatabase();

//   const formData = await req.formData();

//   // Basic fields
//   const old_name = formData.get("old_name") as string;
//   const new_name = formData.get("new_name") as string;
//   const description = formData.get("description") as string;
//   const nextRedirectUrl = formData.get("next_redirect_url") as string;
//   const theme = formData.get("theme") as string;

//   // New fields from original request
//   const rename_reason = formData.get("rename_reason") as string;
//   let metadata = {};
//   try {
//     const metadataStr = formData.get("metadata") as string;
//     if (metadataStr) {
//       metadata = JSON.parse(metadataStr);
//     }
//   } catch (e) {
//     console.error("Error parsing metadata JSON:", e);
//   }

//   // Handle description points (max 4)
//   const description_points: string[] = [];
//   for (let i = 1; i <= 4; i++) {
//     const point = formData.get(`description_point_${i}`) as string;
//     if (point && point.trim()) {
//       description_points.push(point.trim());
//     }
//   }

//   // Alternative way to get description points if submitted as JSON
//   try {
//     const pointsJson = formData.get("description_points") as string;
//     if (pointsJson) {
//       const parsed = JSON.parse(pointsJson);
//       if (Array.isArray(parsed)) {
//         // Only take up to 4 points
//         description_points.splice(
//           0,
//           description_points.length,
//           ...parsed.slice(0, 4)
//         );
//       }
//     }
//   } catch (e) {
//     // If parsing fails, keep using the individually collected points
//     console.error("Error parsing description points JSON:", e);
//   }

//   // SEO fields from new request
//   const page_title = (formData.get("page_title") as string) || "";
//   const meta_description = (formData.get("meta_description") as string) || "";
//   const seo_title = (formData.get("seo_title") as string) || "";

//   // Popup content fields from new request
//   const popup_title = (formData.get("popup_title") as string) || "";
//   const popup_content = (formData.get("popup_content") as string) || "";

//   // Redirect timer
//   const redirectTimerStr = formData.get("redirect_timer") as string;
//   const redirectTimer = redirectTimerStr ? parseInt(redirectTimerStr, 10) : 0;

//   // Image collections
//   const oldImages: string[] = [];
//   const newImages: string[] = [];
//   let badgeImageUrl: string | null = null;

//   // Upload files to Cloudinary
//   for (const entry of formData.entries()) {
//     const [key, value] = entry;
//     if (value instanceof File) {
//       const buffer = await value.arrayBuffer();
//       const uploadPromise = new Promise<string>((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "uploads", // Folder in Cloudinary
//             public_id: `${Date.now()}_${value.name}`, // Custom file name
//           },
//           (error, result) => {
//             if (error) {
//               console.error("Cloudinary Error:", error);
//               reject("Image upload failed");
//             } else if (result) {
//               resolve(result.secure_url); // Use secure URL for HTTPS
//             }
//           }
//         );
//         uploadStream.end(Buffer.from(buffer));
//       });

//       const uploadedImageUrl = await uploadPromise;

//       if (key === "old_images") {
//         oldImages.push(uploadedImageUrl);
//       } else if (key === "new_images") {
//         newImages.push(uploadedImageUrl);
//       } else if (key === "badge_image") {
//         badgeImageUrl = uploadedImageUrl;
//       }
//     }
//   }

//   try {
//     const { id } = await insertProduct(
//       old_name,
//       new_name,
//       description,
//       description_points,
//       metadata,
//       rename_reason,
//       oldImages,
//       newImages,
//       badgeImageUrl,
//       nextRedirectUrl,
//       redirectTimer,
//       theme,
//       "", // generatedLink (will be updated after)
//       page_title,
//       meta_description,
//       seo_title,
//       popup_title,
//       popup_content
//     );

//     // Generate a slug-based URL
//     const slug = old_name.toLowerCase().trim().replace(/\s+/g, "-");
//     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
//     const cleanSiteUrl = siteUrl.replace(/\/$/, "");
//     const generatedLink = `${cleanSiteUrl}/product/${slug}-${id}`;

//     // Update the product with the generated link
//     await db.query("UPDATE products SET generated_link = ? WHERE id = ?", [
//       generatedLink,
//       id,
//     ]);

//     return NextResponse.json({
//       message: "Product created successfully",
//       id,
//       generatedLink,
//       old_name,
//       new_name,
//       description_points,
//       metadata,
//       rename_reason,
//       oldImagesCount: oldImages.length,
//       newImagesCount: newImages.length,
//       hasBadge: badgeImageUrl !== null,
//     });
//   } catch (error: any) {
//     console.error("Error creating product:", error);
//     return NextResponse.json(
//       {
//         error: error.message,
//         details: "Failed to create product",
//       },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { initializeDatabase, insertProduct } from "@/lib/models";
// import db from "@/lib/db";
// import fs from "fs";
// import path from "path";
// import { writeFile, mkdir } from "fs/promises";

// // Define the base upload directory (outside public folder for production)
// // This approach works better for deployed environments
// const getUploadDir = () => {
//   // For production, use a dedicated uploads directory at the project root
//   // For development, you can use public folder for easy testing
//   const isProduction = process.env.NODE_ENV === "production";

//   if (isProduction) {
//     // Use a directory that your hosting provider allows writing to
//     // For example, in Vercel you might use /tmp
//     // For other hosts, check their documentation for writeable directories
//     return process.env.UPLOAD_DIR || "/tmp/uploads";
//   } else {
//     // In development, can use public dir
//     return path.join(process.cwd(), "public", "uploads");
//   }
// };

// // Function to ensure directory exists
// async function ensureDir(dirPath: string) {
//   try {
//     await mkdir(dirPath, { recursive: true });
//   } catch (error) {
//     if ((error as any).code !== "EEXIST") {
//       throw error;
//     }
//   }
// }

// // Function to save file to storage
// async function saveFile(file: File, folderName: string) {
//   // Get base upload directory
//   const baseUploadDir = getUploadDir();

//   // Create specific folder path
//   const folderPath = path.join(baseUploadDir, folderName);

//   // Ensure the directory exists
//   await ensureDir(folderPath);

//   // Generate unique filename
//   const fileExtension = file.name.split(".").pop();
//   const fileName = `${Date.now()}_${Math.random()
//     .toString(36)
//     .substring(2, 15)}.${fileExtension}`;
//   const filePath = path.join(folderPath, fileName);

//   // Get file buffer and write to disk
//   const buffer = Buffer.from(await file.arrayBuffer());
//   await writeFile(filePath, buffer);

//   // Store the relative path plus the configured BASE_URL for database
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
//   return `${baseUrl}/api/images/${folderName}/${fileName}`;
// }

// export async function POST(req: Request) {
//   await initializeDatabase();

//   const formData = await req.formData();

//   // Basic fields
//   const old_name = formData.get("old_name") || "";
//   const new_name = formData.get("new_name") || "";
//   const description = formData.get("description") || "";
//   const nextRedirectUrl = formData.get("next_redirect_url") || "";
//   const theme = formData.get("theme") || "";

//   // New fields from original request
//   const rename_reason = formData.get("rename_reason") || "";
//   let metadata = {};
//   try {
//     const metadataStr = formData.get("metadata");
//     if (metadataStr) {
//       metadata = JSON.parse(metadataStr as string);
//     }
//   } catch (e) {
//     console.error("Error parsing metadata JSON:", e);
//   }

//   // Handle description points (max 4)
//   const description_points = [];
//   for (let i = 1; i <= 4; i++) {
//     const point = formData.get(`description_point_${i}`);
//     if (typeof point === "string" && point?.trim()) {
//       if (typeof point === "string") {
//         description_points.push(point.trim());
//       }
//     }
//   }

//   // Alternative way to get description points if submitted as JSON
//   try {
//     const pointsJson = formData.get("description_points");
//     if (pointsJson) {
//       const parsed = JSON.parse(typeof pointsJson === "string" ? pointsJson : "[]");
//       if (Array.isArray(parsed)) {
//         // Only take up to 4 points
//         description_points.splice(
//           0,
//           description_points.length,
//           ...parsed.slice(0, 4)
//         );
//       }
//     }
//   } catch (e) {
//     // If parsing fails, keep using the individually collected points
//     console.error("Error parsing description points JSON:", e);
//   }

//   // SEO fields from new request
//   const page_title = formData.get("page_title") || "";
//   const meta_description = formData.get("meta_description") || "";
//   const seo_title = formData.get("seo_title") || "";

//   // Popup content fields from new request
//   const popup_title = formData.get("popup_title") || "";
//   const popup_content = formData.get("popup_content") || "";

//   // Redirect timer
//   const redirectTimerStr = formData.get("redirect_timer");
//   const redirectTimer = redirectTimerStr ? parseInt(redirectTimerStr as string, 10) : 0;

//   // Image collections
//   const oldImages = [];
//   const newImages = [];
//   let badgeImageUrl = null;

//   // Upload files to storage folders
//   for (const entry of formData.entries()) {
//     const [key, value] = entry;
//     if (value instanceof File) {
//       try {
//         if (key === "old_images") {
//           const imagePath = await saveFile(value, "old_images");
//           oldImages.push(imagePath);
//         } else if (key === "new_images") {
//           const imagePath = await saveFile(value, "new_images");
//           newImages.push(imagePath);
//         } else if (key === "badge_image") {
//           const imagePath = await saveFile(value, "badge_images");
//           badgeImageUrl = imagePath;
//         }
//       } catch (error) {
//         console.error(`Error saving file ${key}:`, error);
//         return NextResponse.json(
//           {
//             error: "File upload failed",
//             details: `Error saving ${key} to disk`,
//           },
//           { status: 500 }
//         );
//       }
//     }
//   }

//   try {
//     // Call the insertProduct function - it returns { result, id }
//     const response = await insertProduct(
//       old_name as string,
//       new_name as string,
//       description as string,
//       description_points,
//       metadata,
//       rename_reason as string,
//       oldImages,
//       newImages,
//       badgeImageUrl,
//       nextRedirectUrl as string,
//       redirectTimer,
//       theme as string,
//       "", // generatedLink (will be updated after)
//       page_title as string,
//       meta_description as string,
//       seo_title as string,
//       popup_title as string,
//       popup_content as string
//     );

//     console.log("Insert response:", response);

//     // Get the UUID from the response
//     const id = response.id;

//     // Validate the ID
//     if (!id) {
//       console.error("Invalid ID returned:", response);
//       throw new Error("Failed to get valid product ID from database");
//     }

//     // Generate a slug-based URL
//     const slug = (old_name as string).toLowerCase().trim().replace(/\s+/g, "-");
//     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
//     const cleanSiteUrl = siteUrl.replace(/\/$/, "");
//     const generatedLink = `${cleanSiteUrl}/product/${slug}-${id}`;

//     console.log("Generated link:", generatedLink);
//     console.log("Product ID:", id);

//     // Update the product with the generated link
//     await db.query("UPDATE products SET generated_link = ? WHERE id = ?", [
//       generatedLink,
//       id,
//     ]);

//     return NextResponse.json({
//       message: "Product created successfully",
//       id,
//       generatedLink,
//       old_name,
//       new_name,
//       description_points,
//       metadata,
//       rename_reason,
//       oldImagesCount: oldImages.length,
//       newImagesCount: newImages.length,
//       hasBadge: badgeImageUrl !== null,
//     });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return NextResponse.json(
//       {
//         error: (error instanceof Error ? error.message : "Unknown error"),
//         details: "Failed to create product",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { initializeDatabase, insertProduct } from "@/lib/models";
import db from "@/lib/db";
import fs from "fs";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

// Define a file-like interface for the FormData file objects
interface FileObject {
  name: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

// Define the base upload directory (outside public folder for production)
// This approach works better for deployed environments
const getUploadDir = () => {
  // For production, use a dedicated uploads directory at the project root
  // For development, you can use public folder for easy testing
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Use a directory that your hosting provider allows writing to
    // For example, in Vercel you might use /tmp
    return process.env.UPLOAD_DIR || "/tmp/uploads";
  } else {
    // In development, can use public dir
    return path.join(process.cwd(), "public", "uploads");
  }
};

// Function to ensure directory exists
async function ensureDir(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as any).code !== "EEXIST") {
      throw error;
    }
  }
}

// Function to save file to storage
async function saveFile(file: FileObject, folderName: string) {
  // Get base upload directory
  const baseUploadDir = getUploadDir();

  // Create specific folder path
  const folderPath = path.join(baseUploadDir, folderName);

  // Ensure the directory exists
  await ensureDir(folderPath);

  // Generate unique filename
  const fileExtension = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 15)}.${fileExtension}`;
  const filePath = path.join(folderPath, fileName);

  // Get file buffer and write to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Store the relative path plus the configured BASE_URL for database
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  return `${baseUrl}/api/images/${folderName}/${fileName}`;
}

export async function POST(req: Request) {
  await initializeDatabase();

  const formData = await req.formData();

  // Basic fields
  const old_name = formData.get("old_name") || "";
  const new_name = formData.get("new_name") || "";
  const category_id = formData.get("category_id") || "";
  const nextRedirectUrl = formData.get("next_redirect_url") || "";
  const theme = formData.get("theme") || "";
  const domain = formData.get("domain") || "";

  // SEO fields
  const page_title = formData.get("page_title") || "";
  const meta_description = formData.get("meta_description") || "";
  const seo_title = formData.get("seo_title") || "";

  // Popup title only (content removed as requested)
  const popup_title = formData.get("popup_title") || "";

  // New fields: extra badges
  const extra_badge_1 = formData.get("extra_badge_1") || "";
  const extra_badge_2 = formData.get("extra_badge_2") || "";

  // Redirect timer
  const redirectTimerStr = formData.get("redirect_timer");
  const redirectTimer = redirectTimerStr
    ? parseInt(redirectTimerStr as string, 10)
    : 0;

  // Image collections
  const oldImages = [];
  const newImages = [];
  let badgeImageUrl = null;
  let extraBadge1Url = null;
  let extraBadge2Url = null;

  // Handle existing images for duplication
  const oldImagesExisting = formData.get("old_images_existing");
  const newImagesExisting = formData.get("new_images_existing");
  const badgeImageExisting = formData.get("badge_image_existing");
  const extraBadge1Existing = formData.get("extra_badge_1_existing");
  const extraBadge2Existing = formData.get("extra_badge_2_existing");

  // Parse existing images if provided
  if (oldImagesExisting) {
    try {
      const parsedOldImages = JSON.parse(oldImagesExisting as string);
      if (Array.isArray(parsedOldImages)) {
        oldImages.push(...parsedOldImages);
      }
    } catch (error) {
      console.error("Error parsing existing old images:", error);
    }
  }

  if (newImagesExisting) {
    try {
      const parsedNewImages = JSON.parse(newImagesExisting as string);
      if (Array.isArray(parsedNewImages)) {
        newImages.push(...parsedNewImages);
      }
    } catch (error) {
      console.error("Error parsing existing new images:", error);
    }
  }

  // Set existing badge images
  if (badgeImageExisting && typeof badgeImageExisting === 'string' && badgeImageExisting.trim()) {
    badgeImageUrl = badgeImageExisting as string;
  }

  if (extraBadge1Existing && typeof extraBadge1Existing === 'string' && extraBadge1Existing.trim()) {
    extraBadge1Url = extraBadge1Existing as string;
  }

  if (extraBadge2Existing && typeof extraBadge2Existing === 'string' && extraBadge2Existing.trim()) {
    extraBadge2Url = extraBadge2Existing as string;
  }

  // Upload files to storage folders
  for (const entry of formData.entries()) {
    const [key, value] = entry;
    // Check if value is a file-like object (has name, size, and stream properties)
    if (value && typeof value === 'object' && 'name' in value && 'size' in value && typeof (value as any).stream === 'function') {
      try {
        const fileObject = value as FileObject;
        if (key === "old_images") {
          const imagePath = await saveFile(fileObject, "old_images");
          oldImages.push(imagePath);
        } else if (key === "new_images") {
          const imagePath = await saveFile(fileObject, "new_images");
          newImages.push(imagePath);
        } else if (key === "badge_image") {
          const imagePath = await saveFile(fileObject, "badge_images");
          console.log("Saved badge image to path:", imagePath);

          badgeImageUrl = imagePath;
        } else if (key === "extra_badge_1_image") {
          const imagePath = await saveFile(fileObject, "extra_badge_1");
          extraBadge1Url = imagePath;
        } else if (key === "extra_badge_2_image") {
          const imagePath = await saveFile(fileObject, "extra_badge_2");
          extraBadge2Url = imagePath;
        }
      } catch (error) {
        console.error(`Error saving file ${key}:`, error);
        return NextResponse.json(
          {
            error: "File upload failed",
            details: `Error saving ${key} to disk`,
          },
          { status: 500 }
        );
      }
    }
  }

  try {
    // Validate category_id
    if (!category_id) {
      return NextResponse.json(
        { error: "Category selection is required" },
        { status: 400 }
      );
    }

    // Call the insertProduct function - it returns { result, id }
    const response = await insertProduct(
      old_name as string,
      new_name as string,
      category_id as string,
      oldImages,
      newImages,
      badgeImageUrl,
      extraBadge1Url, // New parameter for extra badge 1
      extraBadge2Url, // New parameter for extra badge 2
      nextRedirectUrl as string,
      redirectTimer,
      theme as string,
      "", // generatedLink (will be updated after)
      meta_description as string,
      seo_title as string,
      domain as string
    );

    console.log("Insert response:", response);

    // Get the UUID from the response
    const id = response.id;

    // Validate the ID
    if (!id) {
      console.error("Invalid ID returned:", response);
      throw new Error("Failed to get valid product ID from database");
    }

    // Generate a slug-based URL
    const slug = (old_name as string).toLowerCase().trim().replace(/\s+/g, "-");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const cleanSiteUrl = siteUrl.replace(/\/$/, "");
    const generatedLink = `${cleanSiteUrl}/product/${slug}-${id}`;

    console.log("Generated link:", generatedLink);
    console.log("Product ID:", id);

    // Update the product with the generated link
    await db.query("UPDATE products SET generated_link = ? WHERE id = ?", [
      generatedLink,
      id,
    ]);

    return NextResponse.json({
      message: "Product created successfully",
      id,
      generatedLink,
      old_name,
      new_name,
      category_id,
      oldImagesCount: oldImages.length,
      newImagesCount: newImages.length,
      hasBadge: badgeImageUrl !== null,
      hasExtraBadge1: extraBadge1Url !== null,
      hasExtraBadge2: extraBadge2Url !== null,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

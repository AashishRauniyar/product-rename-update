

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { updateProduct, getProductById, deleteProduct } from "@/lib/models";

// ✅ GET: Fetch a product by ID.
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    // Extract the full UUID if we have a partial ID
    let productId = id;

    // If ID includes dashes, it might be a full UUID
    if (id.includes("-")) {
      productId = id;
    }
    // If ID is the last part of a UUID (no dashes)
    else if (id.length < 36) {
      // Try to find the product with partial ID matching
      const [possibleProducts] = await db.query(
        "SELECT * FROM products WHERE id LIKE ?",
        [`%${id}`]
      );

      if (Array.isArray(possibleProducts) && possibleProducts.length > 0) {
        productId = (possibleProducts as any[])[0].id;
      }
    }

    console.log("Looking for product with ID:", productId);

    // Use the getProductById function which includes category information
    const product = await getProductById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update a product by ID.
// export async function PUT(
//   request: Request,
//   context: { params: Promise<{ id: string }> }
// ): Promise<NextResponse> {
//   const { id } = await context.params;
//   try {
//     // Use formData() because the request payload is multipart/form-data.
//     const formData = await request.formData();
//     const old_name = formData.get("old_name") as string;
//     const new_name = formData.get("new_name") as string;
//     const description = formData.get("description") as string;
//     const next_redirect_url =
//       (formData.get("next_redirect_url") as string) || "";
//     const redirect_timer = parseInt(
//       (formData.get("redirect_timer") as string) || "0",
//       10
//     );
//     const theme = (formData.get("theme") as string) || "light";

//     // Get additional fields if they exist
//     const page_title = (formData.get("page_title") as string) || "";
//     const meta_description = (formData.get("meta_description") as string) || "";
//     const seo_title = (formData.get("seo_title") as string) || "";
//     const popup_title = (formData.get("popup_title") as string) || "";
//     const popup_content = (formData.get("popup_content") as string) || "";
//     const rename_reason = (formData.get("rename_reason") as string) || "";

//     // Process description points
//     let description_points = [];
//     try {
//       const description_points_json = formData.get(
//         "description_points"
//       ) as string;
//       if (description_points_json) {
//         description_points = JSON.parse(description_points_json);
//       } else {
//         // Try to collect individual points
//         for (let i = 1; i <= 4; i++) {
//           const point = formData.get(`description_point_${i}`) as string;
//           if (point && point.trim()) {
//             description_points.push(point);
//           }
//         }
//       }
//     } catch (e) {
//       console.error("Error parsing description points:", e);
//     }

//     // Process metadata
//     let metadata = {};
//     try {
//       const metadataStr = formData.get("metadata") as string;
//       if (metadataStr) {
//         metadata = JSON.parse(metadataStr);
//       }
//     } catch (e) {
//       console.error("Error parsing metadata:", e);
//     }

//     // Regenerate the generated_link based on new old_name.
//     const slug = old_name.toLowerCase().trim().replace(/\s+/g, "-");
//     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
//     const cleanSiteUrl = siteUrl.replace(/\/$/, "");
//     const generated_link = `${cleanSiteUrl}/product/${slug}-${id}`;

//     await db.query(
//       `UPDATE products
//        SET old_name = ?, 
//            new_name = ?, 
//            description = ?, 
//            description_points = ?, 
//            metadata = ?, 
//            rename_reason = ?, 
//            next_redirect_url = ?, 
//            redirect_timer = ?, 
//            theme = ?, 
//            generated_link = ?,
//            page_title = ?,
//            meta_description = ?,
//            seo_title = ?,
//            popup_title = ?,
//            popup_content = ?
//        WHERE id = ?`,
//       [
//         old_name,
//         new_name,
//         description,
//         JSON.stringify(description_points),
//         JSON.stringify(metadata),
//         rename_reason,
//         next_redirect_url,
//         redirect_timer,
//         theme,
//         generated_link,
//         page_title,
//         meta_description,
//         seo_title,
//         popup_title,
//         popup_content,
//         id,
//       ]
//     );

//     return NextResponse.json({
//       message: "Product updated",
//       id,
//       generated_link,
//     });
//   } catch (error: any) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to update product",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    // Use formData() because the request payload is multipart/form-data.
    const formData = await request.formData();
    
    // Extract all possible fields from formData
    const updates: any = {};
    
    // Process text fields
    const textFields = [
      'old_name', 'new_name', 'category_id', 'next_redirect_url', 
      'theme', 'page_title', 'meta_description', 'seo_title', 
      'popup_title', 'popup_content', 'rename_reason', 'badge_image_url',
      'extra_badge_1', 'extra_badge_2', 'domain'
    ];
    
    for (const field of textFields) {
      const value = formData.get(field);
      if (value !== null) {
        updates[field] = value as string;
      }
    }
    
    // Process numeric fields
    if (formData.has('redirect_timer')) {
      updates.redirect_timer = parseInt(formData.get('redirect_timer') as string || '0', 10);
    }
    
    if (formData.has('total_clicks')) {
      updates.total_clicks = parseInt(formData.get('total_clicks') as string || '0', 10);
    }
    

    
    // Handle images
    const old_images_existing = formData.get('old_images_existing');
    if (old_images_existing) {
      updates.old_images = JSON.parse(old_images_existing as string);
    }
    
    const new_images_existing = formData.get('new_images_existing');
    if (new_images_existing) {
      updates.new_images = JSON.parse(new_images_existing as string);
    }
    
    // TODO: Handle file uploads for images if needed
    // This would require additional processing and storage logic
    
    // Generate the link if old_name is provided
    if (updates.old_name && updates.old_name.trim()) {
      const slug = updates.old_name.toLowerCase().trim().replace(/\s+/g, "-");
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const cleanSiteUrl = siteUrl.replace(/\/$/, "");
      updates.generated_link = `${cleanSiteUrl}/product/${slug}-${id}`;
      
      console.log(`🔗 Link regenerated for product ${id}:`);
      console.log(`   Old name: "${updates.old_name}"`);
      console.log(`   New link: "${updates.generated_link}"`);
    }
    
    // Use the updateProduct function to update the product
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await updateProduct(id, updates);
    
    return NextResponse.json({
      message: "Product updated",
      id,
      generated_link: updates.generated_link,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        error: "Failed to update product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a product by ID.
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    await deleteProduct(id);

    return NextResponse.json({
      message: "Product deleted",
      id,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        error: "Failed to delete product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

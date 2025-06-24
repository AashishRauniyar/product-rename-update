/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RowDataPacket } from "mysql2/promise";
import db from "./db";
import { v4 as uuidv4 } from "uuid";

export async function initializeDatabase() {
  try {
    // Create categories table first (referenced by products)
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        description_points TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table with category_id reference
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id CHAR(36) PRIMARY KEY,
        old_images TEXT,
        new_images TEXT,
        old_name VARCHAR(255),
        new_name VARCHAR(255),
        category_id CHAR(36) DEFAULT NULL,
        badge_image_url VARCHAR(255) DEFAULT NULL,
        extra_badge_1 VARCHAR(255) DEFAULT NULL,
        extra_badge_2 VARCHAR(255) DEFAULT NULL,
        next_redirect_url VARCHAR(255) DEFAULT NULL,
        redirect_timer INT DEFAULT 0,
        theme VARCHAR(50) DEFAULT 'light',
        generated_link VARCHAR(255) DEFAULT NULL,
        meta_description TEXT,
        seo_title VARCHAR(255) DEFAULT NULL,
        domain VARCHAR(255) DEFAULT NULL,
        total_clicks INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Add category_id column to existing products table if it doesn't exist
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS category_id CHAR(36) DEFAULT NULL
    `).catch(() => {
      // Column might already exist, ignore error
    });

    // Add domain column to existing products table if it doesn't exist
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS domain VARCHAR(255) DEFAULT NULL
    `).catch(() => {
      // Column might already exist, ignore error
    });

    // Add foreign key constraint if it doesn't exist
    await db.query(`
      ALTER TABLE products 
      ADD CONSTRAINT fk_products_category 
      FOREIGN KEY (category_id) REFERENCES categories(id)
    `).catch(() => {
      // Constraint might already exist, ignore error
    });

    // Remove description and description_points columns from products as they'll come from categories
    await db.query(`
      ALTER TABLE products 
      DROP COLUMN IF EXISTS description
    `).catch(() => {
      // Column might not exist, ignore error
    });

    await db.query(`
      ALTER TABLE products 
      DROP COLUMN IF EXISTS description_points
    `).catch(() => {
      // Column might not exist, ignore error
    });

    // Create table for tracking visits
    await db.query(`
      CREATE TABLE IF NOT EXISTS visit_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id CHAR(36),
        ip_address VARCHAR(45),
        country VARCHAR(100),
        visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE KEY unique_visit (product_id, ip_address)
      )
    `);

    console.log("✅ Database tables are ready");
  } catch (error) {
    console.error("❌ Error creating/updating tables:", error);
  }
}

export async function insertProduct(
  old_name: string,
  new_name: string,
  category_id: string, // Now mandatory - category selection required
  old_images: string[],
  new_images: string[],
  badge_image_url: string | null,
  extra_badge_1: string | null,
  extra_badge_2: string | null,
  nextRedirectUrl: string,
  redirectTimer: number,
  theme: string,
  generatedLink: string,
  meta_description: string,
  seo_title: string,
  domain: string | null = null
) {
  const id = uuidv4();

  // Validate that category exists
  const category = await getCategoryById(category_id);
  if (!category) {
    throw new Error("Invalid category selected. Please choose a valid category.");
  }

  // SQL column list must exactly match the order of the values array below
  const sql = `
    INSERT INTO products (
      id,
      old_images,
      new_images,
      old_name,
      new_name,
      category_id,
      badge_image_url,
      extra_badge_1,
      extra_badge_2,
      next_redirect_url,
      redirect_timer,
      theme,
      generated_link,
      meta_description,
      seo_title,
      domain
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    JSON.stringify(old_images),
    JSON.stringify(new_images),
    old_name,
    new_name,
    category_id,
    badge_image_url,
    extra_badge_1,
    extra_badge_2,
    nextRedirectUrl,
    redirectTimer,
    theme,
    generatedLink,
    meta_description,
    seo_title,
    domain,
  ];

  try {
    const [result] = await db.query(sql, params);
    return { result, id };
  } catch (error) {
    console.error("❌ Error inserting product:", error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const [rows] = (await db.query(`
      SELECT p.*, c.name as category_name, c.description, c.description_points
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id])) as [RowDataPacket[], any];
    
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const product = rows[0];
    
    // Parse JSON columns back to native types
    product.old_images = JSON.parse(product.old_images as string);
    product.new_images = JSON.parse(product.new_images as string);
    product.description_points = JSON.parse(product.description_points || "[]");
    
    return product;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    throw error;
  }
}

export async function getProductBySlug(slug: string) {
  const match = slug.match(
    /-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
  );
  if (!match) return null;
  return getProductById(match[1]);
}

export async function updateProduct(
  id: string,
  updates: {
    old_name?: string;
    new_name?: string;
    category_id?: string;
    old_images?: string[];
    new_images?: string[];
    badge_image_url?: string;
    extra_badge_1?: string;
    extra_badge_2?: string;
    next_redirect_url?: string;
    redirect_timer?: number;
    theme?: string;
    generated_link?: string;
    meta_description?: string;
    seo_title?: string;
    domain?: string;
    total_clicks?: number;
  }
) {
  try {
    // Validate category if being updated
    if (updates.category_id) {
      const category = await getCategoryById(updates.category_id);
      if (!category) {
        throw new Error("Invalid category selected. Please choose a valid category.");
      }
    }

    const cols: string[] = [];
    const vals: any[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cols.push(`${key} = ?`);
        vals.push(
          Array.isArray(value) || typeof value === "object"
            ? JSON.stringify(value)
            : value
        );
      }
    }
    vals.push(id);
    const sql = `UPDATE products SET ${cols.join(", ")} WHERE id = ?`;
    const [result] = await db.query(sql, vals);
    return result;
  } catch (error) {
    console.error("❌ Error updating product:", error);
    throw error;
  }
}

export async function getAllProducts(limit = 100, offset = 0) {
  try {
    const [rows] = (await db.query(
      `SELECT p.id, p.old_name, p.new_name, p.created_at, p.generated_link, p.total_clicks, p.domain, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    )) as [RowDataPacket[], any];
    return rows;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw error;
  }
}

export async function getProductCount() {
  try {
    const [rows] = (await db.query(
      "SELECT COUNT(*) as count FROM products"
    )) as [RowDataPacket[], any];
    return rows[0].count;
  } catch (error) {
    console.error("❌ Error counting products:", error);
    throw error;
  }
}

export async function recordVisit(
  productId: string,
  ipAddress: string,
  country: string
) {
  try {
    await db.query(
      "UPDATE products SET total_clicks = total_clicks + 1 WHERE id = ?",
      [productId]
    );
    try {
      await db.query(
        "INSERT INTO visit_stats (product_id, ip_address, country) VALUES (?, ?, ?)",
        [productId, ipAddress, country]
      );
    } catch {
      // ignore unique constraint violation
    }
    return true;
  } catch (error) {
    console.error("❌ Error recording visit:", error);
    throw error;
  }
}

export async function getVisitStats(productId: string) {
  try {
    const [clickRows] = (await db.query(
      "SELECT total_clicks FROM products WHERE id = ?",
      [productId]
    )) as [RowDataPacket[], any];
    const [uniqueRows] = (await db.query(
      "SELECT COUNT(*) as unique_visitors FROM visit_stats WHERE product_id = ?",
      [productId]
    )) as [RowDataPacket[], any];
    const [countryRows] = (await db.query(
      "SELECT country, COUNT(*) as count FROM visit_stats WHERE product_id = ? GROUP BY country ORDER BY count DESC",
      [productId]
    )) as [RowDataPacket[], any];

    return {
      totalClicks: clickRows[0]?.total_clicks || 0,
      uniqueVisitors: uniqueRows[0]?.unique_visitors || 0,
      countries: countryRows,
    };
  } catch (error) {
    console.error("❌ Error getting visit stats:", error);
    throw error;
  }
}

// Delete Product
export async function deleteProduct(id: string) {
  try {
    console.log("🗑️ Deleting product with ID:", id);
    
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    console.log("✅ Product deleted successfully");
    return result;
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    throw error;
  }
}

// ===== CATEGORY MANAGEMENT FUNCTIONS =====

export async function insertCategory(
  name: string,
  description: string,
  description_points: string[] // max 4 entries
) {
  const id = uuidv4();
  const limitedPoints = description_points.slice(0, 4);

  const sql = `
    INSERT INTO categories (
      id,
      name,
      description,
      description_points
    ) VALUES (?, ?, ?, ?)
  `;

  const params = [
    id,
    name,
    description,
    JSON.stringify(limitedPoints),
  ];

  try {
    const [result] = await db.query(sql, params);
    return { result, id };
  } catch (error) {
    console.error("❌ Error inserting category:", error);
    throw error;
  }
}

export async function getAllCategories() {
  try {
    const [rows] = (await db.query(
      `SELECT id, name, description, description_points, created_at,
       (SELECT COUNT(*) FROM products WHERE category_id = categories.id) as product_count
       FROM categories
       ORDER BY created_at DESC`
    )) as [RowDataPacket[], any];
    
    // Parse JSON columns back to native types
    return rows.map(category => ({
      ...category,
      description_points: JSON.parse(category.description_points || "[]")
    }));
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    throw error;
  }
}

export async function getCategoryById(id: string) {
  try {
    const [rows] = (await db.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ])) as [RowDataPacket[], any];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const category = rows[0];
    // Parse JSON columns back to native types
    category.description_points = JSON.parse(category.description_points || "[]");
    return category;
  } catch (error) {
    console.error("❌ Error fetching category:", error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  updates: {
    name?: string;
    description?: string;
    description_points?: string[];
  }
) {
  try {
    const cols: string[] = [];
    const vals: any[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cols.push(`${key} = ?`);
        vals.push(
          Array.isArray(value) ? JSON.stringify(value.slice(0, 4)) : value
        );
      }
    }
    vals.push(id);
    const sql = `UPDATE categories SET ${cols.join(", ")} WHERE id = ?`;
    const [result] = await db.query(sql, vals);
    return result;
  } catch (error) {
    console.error("❌ Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    // First check if category has linked products
    const [productRows] = (await db.query(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [id]
    )) as [RowDataPacket[], any];
    
    const productCount = productRows[0].count;
    if (productCount > 0) {
      throw new Error(`Cannot delete category. It is assigned to ${productCount} product(s). Please reassign the products to a different category first.`);
    }

    // Delete category if no products are linked
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
    return result;
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    throw error;
  }
}

export async function getCategoryProductCount(id: string) {
  try {
    const [rows] = (await db.query(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [id]
    )) as [RowDataPacket[], any];
    return rows[0].count;
  } catch (error) {
    console.error("❌ Error getting category product count:", error);
    throw error;
  }
}

// ===== UPDATED PRODUCT FUNCTIONS =====

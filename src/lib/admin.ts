

/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "./db"; // Ensure this points to your actual database connection
import bcrypt from "bcryptjs";

/**
 * Initializes the admin database by creating the users table if it doesn't exist.
 */
export async function initializeAdminDatabase() {
  try {
    // SQL query to create the users table if it doesn't already exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Users table is ready");
    return true;
  } catch (error) {
    console.error("❌ Error creating users table:", error);
    // Don't throw the error, but return false to indicate failure
    return false;
  }
}

/**
 * Retrieves a user by username.
 * @param username - The username to look up.
 * @returns The user record(s) from the database.
 */
export async function getUserByUsername(username: string) {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows;
  } catch (error) {
    console.error("❌ Error getting user by username:", error);
    return []; // Return empty array instead of null to avoid type errors
  }
}

/**
 * Seeds a default admin user if none exists.
 * This is useful for development or first-time deployment.
 */
export async function seedAdminUser() {
  try {
    const initialized = await initializeAdminDatabase(); // Ensure the table is initialized
    if (!initialized) {
      console.error("❌ Failed to initialize database, skipping admin seeding");
      return;
    }

    const existingUsers = await getUserByUsername("admin");

    if (!existingUsers || (existingUsers as any[]).length === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD ?? "admin123"; // Default password for dev environment
      const adminuser = process.env.ADMIN_USERNAME ?? "admin"; // Default admin username

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Insert the admin user with the hashed password
      await db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [adminuser, hashedPassword, "admin"]
      );
      console.log(
        "✅ Default admin user created (username: admin, password: admin123)"
      );
    } else {
      console.log("✅ Admin user already exists, skipping creation");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    // Don't throw the error, just log it
  }
}

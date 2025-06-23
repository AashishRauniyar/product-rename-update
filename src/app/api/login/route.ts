

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { initializeAdminDatabase, getUserByUsername } from "@/lib/admin";
import bcrypt from "bcryptjs";

// Do NOT seed admin user on module initialization - this causes errors
// The seeding should happen only through API calls or controlled initialization

export async function POST(request: Request) {
  try {
    // Ensure the users table exists
    await initializeAdminDatabase();

    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Retrieve user by username
    const users = await getUserByUsername(username);
    if (!users || (users as any[]).length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const user = (users as any[])[0];

    // Compare the provided password with the stored hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid || user.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Successful login: set a session cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("session", "admin-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day (in seconds)
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}

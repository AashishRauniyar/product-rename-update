import { NextRequest, NextResponse } from "next/server";
import { insertCategory, getAllCategories, initializeDatabase } from "@/lib/models";

// Initialize database
initializeDatabase();

// GET - List all categories
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, description_points } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Category description is required" },
        { status: 400 }
      );
    }

    if (!description_points || !Array.isArray(description_points) || description_points.length === 0) {
      return NextResponse.json(
        { error: "At least one description point is required" },
        { status: 400 }
      );
    }

    // Create category
    const result = await insertCategory(
      name.trim(),
      description.trim(),
      description_points.filter(point => point && point.trim()).slice(0, 4)
    );

    return NextResponse.json(
      { message: "Category created successfully", id: result.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating category:", error);
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
} 
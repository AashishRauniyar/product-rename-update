import { NextRequest, NextResponse } from "next/server";
import { getCategoryById, updateCategory, deleteCategory, getCategoryProductCount } from "@/lib/models";

// GET - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("❌ Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, description_points } = body;

    // Check if category exists
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Prepare updates object
    const updates: {
      name?: string;
      description?: string;
      description_points?: string[];
    } = {};
    
    if (name && name.trim()) {
      updates.name = name.trim();
    }
    
    if (description && description.trim()) {
      updates.description = description.trim();
    }
    
    if (description_points && Array.isArray(description_points)) {
      updates.description_points = description_points
        .filter(point => point && point.trim())
        .slice(0, 4);
    }

    // Update category
    await updateCategory(id, updates);

    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating category:", error);
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if category exists
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get product count for this category
    const productCount = await getCategoryProductCount(id);
    
    if (productCount > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete category. It is assigned to ${productCount} product(s). Please reassign the products to a different category first.`,
          productCount: productCount
        },
        { status: 409 }
      );
    }

    // Delete category
    await deleteCategory(id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    
    if (error && typeof error === 'object' && 'message' in error && 
        typeof error.message === 'string' && error.message.includes("Cannot delete category")) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
} 
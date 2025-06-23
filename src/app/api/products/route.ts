import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [products] = await db.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.description as category_description,
        c.description_points as category_description_points
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

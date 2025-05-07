import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/database/repository/user-repository";

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await UserRepository.findAll();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const user = await UserRepository.create(userData);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
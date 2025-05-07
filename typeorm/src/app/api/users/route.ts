import { NextRequest, NextResponse } from "next/server";
import { CreateUserInteractor } from "@/usecases/create-user.usecase";
import { serverUserGateway } from "./server-user-gateway";

// Create instances of interactors
const createUserInteractor = new CreateUserInteractor(serverUserGateway);

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await serverUserGateway.getUsers();
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
    const user = await createUserInteractor.execute(userData);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

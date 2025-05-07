import { NextRequest, NextResponse } from "next/server";
import { UpdateUserInteractor } from "../../_core/usecases/update-user.usecase";
import { ServerUserGateway } from "../server-user-gateway";

// Create instances of gateways and interactors
const serverUserGateway = new ServerUserGateway();
const updateUserInteractor = new UpdateUserInteractor(serverUserGateway);

// Import the DeleteUserUseCase implementation
import { DeleteUserInteractor } from "../../_core/usecases/delete-user.usecase";
const deleteUserInteractor = new DeleteUserInteractor(serverUserGateway);

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    try {
      const user = await serverUserGateway.getUserById(id);
      return NextResponse.json(user);
    } catch {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const userData = await request.json();

    try {
      const updatedUser = await updateUserInteractor.execute(id, userData);
      return NextResponse.json(updatedUser);
    } catch {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    try {
      await deleteUserInteractor.execute(id);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

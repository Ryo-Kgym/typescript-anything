"use client";

import { useState } from "react";
import { User } from "@/database/entity/user";
import deleteUserInteractor from "@/usecases/delete-user.usecase";

interface UserListProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onRefresh: () => void;
}

export default function UserList({ users, loading, onEdit, onRefresh }: UserListProps) {
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle delete button click
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteUserInteractor.execute(id);

      // Refresh the user list
      onRefresh();
      setError("");
    } catch (err) {
      setError("Error deleting user");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  First Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900 font-medium">{user.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900 font-medium">{user.firstName}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900 font-medium">{user.lastName}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900 font-medium">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      disabled={deleteLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

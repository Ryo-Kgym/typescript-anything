"use client";

import { useState, useEffect } from "react";
import { User } from "../app/api/database/entity/user";
import { UserFormData } from "../app/api/_core/usecases/types";

interface UserFormProps {
  user?: User;
  isEditing: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function UserForm({ user, isEditing, onSuccess, onCancel }: UserFormProps) {
  // State for form data
  const [formData, setFormData] = useState<UserFormData>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    isActive: true,
  });

  // State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      });
    } else {
      resetForm();
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isActive: formData.isActive,
      };

      let response;

      if (isEditing && formData.id) {
        // Update existing user using fetch
        response = await fetch(`/api/users/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else {
        // Create new user using fetch
        response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form and notify parent component
      resetForm();
      onSuccess();
      setError("");
    } catch (err) {
      setError(isEditing ? "Error updating user" : "Error creating user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      isActive: true,
    });
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit User" : "Create User"}
      </h2>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700 text-sm font-bold" htmlFor="isActive">
              Active
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : isEditing ? "Update User" : "Create User"}
          </button>
          {isEditing && onCancel && (
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

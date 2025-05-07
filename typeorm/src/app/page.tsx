"use client";

import { useState, useEffect } from "react";
import { User } from "@/database/entity/user";
import UserForm from "@/components/user-form";
import UserList from "@/components/user-list";

export default function Home() {
  // State for users list
  const [users, setUsers] = useState<User[]>([]);

  // State for selected user (for editing)
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for loading
  const [loading, setLoading] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  // Handle form success (create/update)
  const handleFormSuccess = () => {
    loadUsers();
    setIsEditing(false);
    setSelectedUser(undefined);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedUser(undefined);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">TypeORM CRUD Example</h1>

      {/* User Form */}
      <UserForm 
        user={selectedUser}
        isEditing={isEditing}
        onSuccess={handleFormSuccess}
        onCancel={handleCancelEdit}
      />

      {/* Users List */}
      <UserList 
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onRefresh={loadUsers}
      />
    </div>
  );
}

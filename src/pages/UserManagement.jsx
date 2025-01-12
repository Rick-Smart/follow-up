import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  getAllUsers,
  updateUserAttributes,
  setSupervisor,
  deleteUser,
  getUsersByRole,
} from "../utils/userManagementController";
import { USER_ROLES } from "../utils/controller";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      const role = localStorage.getItem("userRole");
      if (isMounted) {
        setHasAccess(
          [
            USER_ROLES.ADMIN,
            USER_ROLES.DIRECTOR,
            USER_ROLES.SR_OPERATIONS_MANAGER,
            USER_ROLES.OPERATIONS_MANAGER,
          ].includes(role)
        );
      }
    };

    const loadData = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        const supervisorsData = await getUsersByRole(
          USER_ROLES.OPERATIONS_MANAGER
        );

        if (isMounted) {
          setUsers(usersData);
          setSupervisors(supervisorsData);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAccess();
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedAttributes) => {
    try {
      await updateUserAttributes(editingUser.id, updatedAttributes);
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...updatedAttributes } : u
        )
      );
      setEditingUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSetSupervisor = async (userId, supervisorId) => {
    try {
      await setSupervisor(userId, supervisorId);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, supervisorId } : u))
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (!hasAccess) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Access" title="Restricted" />
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Admin" title="User Management" />
        <div className="p-4 mb-4 text-gray-700">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Admin" title="User Management" />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supervisor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.name || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                        className="border rounded p-1"
                      />
                    ) : (
                      user.name || "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.supervisorId || ""}
                      onChange={(e) =>
                        handleSetSupervisor(user.id, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="">Select Supervisor</option>
                      {supervisors.map((supervisor) => (
                        <option key={supervisor.id} value={supervisor.id}>
                          {supervisor.name} ({supervisor.role})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateUser({ name: editingUser.name })
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

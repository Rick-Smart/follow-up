import React, { useState } from "react";
import { Header } from "../components";
import { makeAdmin } from "../utils/tempController";
import { getCurrentUser } from "../utils/authController";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMakeAdmin = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = getCurrentUser();
      if (!user || typeof user.uid !== "string") {
        throw new Error("No valid user found");
      }

      const success = await makeAdmin(user.uid);
      if (success) {
        setSuccess(true);
        // Reload the page to update the UI with new permissions
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Dashboard" title="Profile" />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Testing Features</h2>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
            Your role has been updated to Admin. Page will reload...
          </div>
        )}

        <button
          onClick={handleMakeAdmin}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Updating..." : "Make Me Admin (Testing Only)"}
        </button>

        <p className="mt-2 text-sm text-gray-500">
          Note: This is a temporary feature for testing purposes only.
        </p>
      </div>
    </div>
  );
};

export default Profile;

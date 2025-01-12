import { getUserById } from "./userController.js"; // Added .js extension

// Test fetching a user by ID
const testFetchUser = async (userId) => {
  try {
    const user = await getUserById(userId);
    console.log("Fetched User:", user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

// Replace 'testUserId' with an actual user ID to test
testFetchUser("08571MqzlQNRsdsT6TZdnDUAOSx1");

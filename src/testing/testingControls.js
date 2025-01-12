// import { createNewUserCollection } from "../utils/userController";
// import { USER_ROLES } from "../utils/userController";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { fireStore } from "../firebase";

// // List of roles excluding Admin
// const TEST_ROLES = Object.values(USER_ROLES).filter(
//   (role) => role !== USER_ROLES.ADMIN
// );

// // Generate random email
// const generateEmail = () => {
//   const randomString = Math.random().toString(36).substring(7);
//   return `testuser${randomString}@valorglobal.com`;
// };

// // Generate random name
// const generateName = () => {
//   const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily"];
//   const lastNames = [
//     "Smith",
//     "Johnson",
//     "Williams",
//     "Brown",
//     "Jones",
//     "Garcia",
//   ];
//   const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//   const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//   return `${firstName} ${lastName}`;
// };

// // Generate random role (excluding Admin)
// const generateRole = () => {
//   return TEST_ROLES[Math.floor(Math.random() * TEST_ROLES.length)];
// };

// // Create a single test user
// const createTestUser = async () => {
//   const auth = getAuth();
//   const email = generateEmail();
//   const password = "Test123!";

//   try {
//     // Create auth user
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // Create user collection with random data
//     await createNewUserCollection(user, generateRole(), {
//       name: generateName(),
//       active: true,
//     });

//     return user;
//   } catch (error) {
//     console.error("Error creating test user:", error);
//     throw error;
//   }
// };

// // Generate multiple test users
// export const generateTestUsers = async (count = 10) => {
//   const users = [];

//   for (let i = 0; i < count; i++) {
//     try {
//       const user = await createTestUser();
//       users.push(user);
//       console.log(`Created test user: ${user.email}`);
//     } catch (error) {
//       console.error("Error generating test users:", error);
//     }
//   }

//   return users;
// };

// // Clear all test users
// export const clearTestUsers = async () => {
//   // Note: This would require implementing a function to delete users
//   // from both Firebase Authentication and Firestore
//   console.log("Clear test users functionality not yet implemented");
// };

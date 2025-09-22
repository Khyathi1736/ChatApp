import bcrypt from 'bcrypt';
import { createUser, deleteUser, getUserByUsername } from '../models/userModel.js';

// Signup new user
export async function signup(username, password) {
  let success = true;
  let error = false;
  let message = 'Signup successful';
  let userData = null;

  try {
    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser.data) {
      return {
        success: false,
        error: true,
        message: 'Username already taken. Choose another one.',
        userData: null
      };
    }

    // Create new user
    const user = await createUser(username, password);
    userData = { userId: user.data.user_id, username: user.data.user_name };
    message = `Signup successful! Your ID: ${user.data.user_id}`;

    return { success, error, message, userData };
  } catch (err) {
    console.error('Signup error:', err.message);
    return {
      success: false,
      error: true,
      message: 'Internal error during signup.',
      userData: null
    };
  }
}


// Login existing user
export async function signin(username, password) {
  let success = true;
  let error = false;
  let message = 'Success';
  let userData = null;

  try {
    const user = await getUserByUsername(username);
    // check user exists or not
    if (!user.data) {
      return { success: false, error: true, message: 'User not found.', userData: null };
    }

    // validating password
    const match = await bcrypt.compare(password, user.data.password);
    if (!match) {
      return { success: false, error: true, message: 'Invalid password.', userData: null };
    }

    // Login successful
    userData = { id: user.data.user_id, username: user.data.user_name };
    message = `Login successful! Welcome, ${user.data.user_name}`;
    return { success, error, message, userData };
  } catch (err) {
    return { success: false, error: true, message: 'Internal error.', userData: null };
  }
}

export async function removeUser(userId) {
  try {
    const result = await deleteUser(userId);
    if (result.message == 'User not found') {
      return { success: false, error: true, message: 'User not found', userData: null };
    }
    return {
      success: true,
      error: false,
      message: 'User deleted successfully',
      data: result.data
    };

  } catch (err) {
    return {
      success: true,
      error: false,
      message: 'Internal Error Occured',
      data: null
    };
  }
}



import pool from "../config/db.js";
import bcrypt from "bcrypt";
const saltRounds = 10;


// to insert new user to database
export async function createUser(userName, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = `
      INSERT INTO users (user_name, password)
      VALUES ($1, $2)
      RETURNING user_id, user_name, created_at
    `;
    const res = await pool.query(query, [userName, hashedPassword]);
    return {
      success: true,
      error: false,
      message: 'User created successfully',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error creating user: ' + err.message,
      data: null
    };
  }
}

// find user by username
export async function getUserByUsername(userName) {
  try {
    const query = 'SELECT * FROM users WHERE user_name=$1';
    const res = await pool.query(query, [userName]);
    if (!res.rows[0]) {
      return {
        success: false,
        error: true,
        message: 'User not found',
        data: null
      };
    }
    return {
      success: true,
      error: false,
      message: 'User found',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error fetching user: ' + err.message,
      data: null
    };
  }
}


// find user by id
export async function getUserById(id) {
  try {
    const query = 'SELECT * FROM users WHERE user_id=$1 and is_active=TRUE';
    const res = await pool.query(query, [id]);
    if (!res.rows[0]) {
      return {
        success: false,
        error: true,
        message: 'User not found',
        data: null
      };
    }
    return {
      success: true,
      error: false,
      message: 'User found',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error fetching user: ' + err.message,
      data: null
    };
  }
}

// soft delete user
export async function deleteUser(userId) {
  try {
    const isUserExist = await getUserById(userId);
    if (!isUserExist.data) {
      return {
        success: true,
        error: false,
        message: 'User not found',
        data: null
      };
    }
    const query = `
    UPDATE users
    SET is_active=false
    WHERE user_id=$1
    RETURNING user_id, is_active
    `;
    const res = await pool.query(query, [userId]);
    return {
      success: true,
      error: false,
      message: 'User deleted successfully',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error deleting user: ' + err.message,
      data: null
    };
  }
}






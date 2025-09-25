import pool from "../config/db.js";
import bcrypt, { hash } from 'bcrypt';
const saltRounds = 10;

// to create room
export async function createRoom(roomId, password, createdBy) {
  try {
    const room = await getRoomByRoomId(roomId);
    if (room.data) {
      return {
        success: false,
        error: true,
        message: 'Room id already exists',
        data: null
      };
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const query = `
      INSERT INTO rooms (room_id, password, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, room_id, created_by, created_at
    `;
    const res = await pool.query(query, [roomId, hashedPassword, createdBy]);

    return {
      success: true,
      error: false,
      message: 'Room created successfully',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error creating room: ' + err.message,
      data: null
    };
  }
}


// Get room by room_id
export async function getRoomByRoomId(roomId) {
  try {
    const query = 'SELECT * FROM rooms WHERE room_id = $1';
    const res = await pool.query(query, [roomId]);

    if (!res.rows[0]) {
      return {
        success: false,
        error: true,
        message: 'Room not found',
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: 'Room found',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error fetching room: ' + err.message,
      data: null
    };
  }
}


// validating before joining room
export async function verifyRoomPassword(roomId, password) {
  try {
    const roomRes = await getRoomByRoomId(roomId);
    const room = roomRes.data;

    if (!room || !room.is_active) {
      return {
        success: false,
        error: true,
        message: 'Room does not exist or is closed',
        data: { hasRoom: false, hasPassword: false, validPassword: false }
      };
    }

    if (!room.password) {
      return {
        success: true,
        error: false,
        message: 'Room has no password',
        data: { hasRoom: true, hasPassword: false, validPassword: true }
      };
    }

    const match = await bcrypt.compare(password, room.password);
    return {
      success: true,
      error: false,
      message: match ? 'Password correct, Joined Room' : 'Invalid password',
      data: { hasRoom: true, hasPassword: true, validPassword: match }
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error verifying password: ' + err.message,
      data: null
    };
  }
}


// to end room 
export async function endRoom(roomId) {
  try {
    const query = 'UPDATE rooms SET is_active = FALSE WHERE room_id = $1 and is_active=TRUE RETURNING *';
    const res = await pool.query(query, [roomId]);

    if (!res.rows[0]) {
      return {
        success: false,
        error: true,
        message: 'Room not found or already closed',
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: 'Room closed successfully',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error ending room: ' + err.message,
      data: null
    };
  }
}


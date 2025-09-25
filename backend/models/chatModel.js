import pool from "../config/db.js";


// To save messages
export async function saveMessage(roomId, userId, message) {
  try {
    const roomRes = await pool.query(
      'SELECT room_id, is_active FROM rooms WHERE room_id=$1',
      [roomId]
    );
    const room = roomRes.rows[0];

    if (!room) {
      return {
        success: false,
        error: true,
        message: 'Room not found',
        data: null
      };
    }

    if (!room.is_active) {
      return {
        success: false,
        error: true,
        message: 'Room is closed',
        data: null
      };
    }

    const query = `
      INSERT INTO messages (room_id, user_id, message)
      VALUES ($1, $2, $3)
      RETURNING message_id, room_id, user_id, message, created_at
    `;
    const res = await pool.query(query, [roomId, userId, message]);

    return {
      success: true,
      error: false,
      message: 'Message sent successfully',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error saving message: ' + err.message,
      data: null
    };
  }
}


// Get all messages by roomId.
export async function getMessagesByRoomId(roomId) {
  try {
    const query = `
      SELECT m.message_id, m.user_id, u.user_name, m.message, m.created_at
      FROM messages m
      JOIN rooms r ON m.room_id = r.room_id
      JOIN users u ON m.user_id = u.user_id
      WHERE r.room_id = $1 AND m.is_deleted = FALSE
      ORDER BY m.created_at ASC
    `;
    const res = await pool.query(query, [roomId]);

    return {
      success: true,
      error: false,
      message: 'Messages fetched successfully',
      data: res.rows
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error fetching messages: ' + err.message,
      data: null
    };
  }
}


// soft delete message
export async function deleteMessage(messageId, userId) {
  try {
    const query = `
      UPDATE messages
      SET is_deleted = TRUE
      WHERE message_id = $1 AND user_id = $2 and is_deleted=FALSE
      RETURNING message_id, user_id, is_deleted, created_at
    `;
    const res = await pool.query(query, [messageId, userId]);

    if (!res.rows[0]) {
      return {
        success: false,
        error: true,
        message: 'Message not found',
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: 'Message deleted successfully',
      data: res.rows[0]
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: 'Error deleting message: ' + err.message,
      data: null
    };
  }
}

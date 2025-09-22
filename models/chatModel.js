import pool from "../config/db.js";

export async function saveMessage(roomId, userId, message) {
    try {
        let roomAvailable = true;
        let roomOpen = true;
        let data = null;
        const roomRes = await pool.query('select room_id,is_active from rooms where room_id=$1', [roomId]);

        const room = roomRes.rows[0];
        if (!room) {
            roomAvailable = false;
            roomOpen = false;
            return { roomAvailable, roomOpen, data };
        }
        if (!room.is_active) {
            roomOpen = false
            return { roomAvailable, roomOpen, data };
        }

        const query = 'insert into messages(room_id,user_id,message) values($1,$2,$3) Returning message_id,room_id,user_id,message,created_at';

        const values = [roomId, userId, message];
        const res = await pool.query(query, values);
        data = res.rows[0];
        return { roomAvailable, roomOpen, data };
    } catch (err) {
        throw err;
    }
}

export async function getMessagesByRoomId(roomId) {
    try {
        const query = `
            SELECT m.message_id, m.user_id, u.user_name, m.message, m.created_at
            FROM messages m
            JOIN rooms r ON m.room_id = r.room_id
            JOIN users u ON m.user_id = u.user_id
            WHERE r.room_id = $1 and m.is_deleted=False
            ORDER BY m.created_at    ASC
            `;
        const res = await pool.query(query, [roomId]);
        return res.rows;
    } catch (err) {
        throw err;
    }
}


// soft delete message
export async function deleteMessage(messageId, userId) {
    try {
        const query = `
      UPDATE messages
      SET is_deleted = TRUE
      WHERE message_id = $1 AND user_id = $2
      RETURNING message_id, user_id, is_deleted, created_at`
        const res = await pool.query(query, [messageId, userId]);
        return res.rows[0];
    } catch (err) {
        throw err;
    }
}

(async () => {
    const res = await getMessagesByRoomId(1234);
    console.log(res);
})();
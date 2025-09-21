import pool from "../config/db.js";
import bcrypt, { hash } from 'bcrypt';
const saltRounds = 10;


// function to create room 
export async function createRoom(roomId, password, createdBy) {
    try {
        const room = await getRoomByRoomId(roomId);
        let roomExists=false;
        let roomCreated=false;
        if (room) {
            roomExists=true;
            return {roomExists,roomCreated};
        }
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }
        const query = 'insert into rooms(room_id,password,created_by) values($1,$2,$3) Returning id,room_id,created_by,created_at';
        const values = [roomId, hashedPassword, createdBy];
        const res = await pool.query(query, values);
        roomCreated=true;
        return {roomExists,roomCreated,room:res.rows[0]};
    } catch (err) {
        throw err;
    }
}


// Get room by room_id
export async function getRoomByRoomId(roomId) {
    try {
        const query = 'SELECT * FROM rooms WHERE room_id = $1';
        const res = await pool.query(query, [roomId]);
        return res.rows[0];
    } catch (err) {
        throw err;
    }
}

export async function verifyRoomPassword(roomId, password) {
    try {
        let hasRoom = true;
        let hasPassword = true;
        let validPassword = false;
        const room = await getRoomByRoomId(roomId);

        // if room not there.
        if (!room || !room.is_active) {
            hasRoom = false;
            hasPassword = false;
            return { hasRoom, hasPassword, validPassword }
        }
        // if room has no password
        if (!room.password) {
            hasPassword = false;
            validPassword = true;
            return { hasRoom, hasPassword, validPassword };
        }
        // else valid room password
        else {
            const match = await bcrypt.compare(password, room.password);
            validPassword = match;
        }
        return { hasRoom, hasPassword, validPassword };

    } catch (err) {
        throw err;
    }
}

// to end room 
export async function endRoom(roomId) {
    try {
        const res = await pool.query(
            'UPDATE rooms SET is_active = FALSE WHERE room_id = $1 RETURNING *',
            [roomId]
        );
        return res.rows[0];
    } catch (err) {
        throw err;
    }
}

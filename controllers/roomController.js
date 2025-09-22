import { 
  createRoom, 
  verifyRoomPassword, 
  endRoom, 
  getRoomByRoomId 
} from "../models/roomModel.js";

// room creatin controller
export async function createNewRoom(roomId, password, createdBy) {
  try {
    const result = await createRoom(roomId, password, createdBy);

    if (result.message=='Room id already exists') {
      return {
        success: false,
        error: true,
        message: "Room ID already exists",
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: "Room created successfully",
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "Internal error while creating room",
      data: null
    };
  }
}


// Get room details
export async function fetchRoomById(roomId) {
  try {
    const room = await getRoomByRoomId(roomId);

    if (!room.data) {
      return {
        success: false,
        error: true,
        message: "Room not found",
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: "Room fetched successfully",
      data: room.data
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "Internal error while fetching room",
      data: null
    };
  }
}


// Verify password before joining a room
export async function joinRoom(roomId, password) {
  try {
    const result = await verifyRoomPassword(roomId, password);

    if (!result.data.hasRoom) {
      return {
        success: false,
        error: true,
        message: "Room not found or closed",
        data: result.data
      };
    }

    if (result.data.hasPassword && !result.data.validPassword) {
      return {
        success: false,
        error: true,
        message: "Invalid password",
        data: result.data
      };
    }

    return {
      success: true,
      error: false,
      message: "Joined room successfully",
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "Internal error while joining room",
      data: null
    };
  }
}


// End a room (soft close)
export async function closeRoom(roomId) {
  try {
    const result = await endRoom(roomId);

    if (!result.data) {
      return {
        success: false,
        error: true,
        message: "Room not found or already closed",
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: "Room closed successfully",
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "Internal error while closing room",
      data: null
    };
  }
}


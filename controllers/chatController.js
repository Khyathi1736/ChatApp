import { saveMessage, getMessagesByRoomId, deleteMessage } from "../models/chatModel.js";

// Send a message
export async function sendMessage(roomId, userId, message) {
  try {
    const result = await saveMessage(roomId, userId, message);

    if (result.message=='Room not found') {
      return {
        success: false,
        error: true,
        message: "Room not found",
        data: null
      };
    }

    if (result.message=='Room is closed') {
      return {
        success: false,
        error: true,
        message: "Room is closed",
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: "Message sent successfully",
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "Internal error while sending message",
      data: null
    };
  }
}


// Fetch all messages from a room
export async function fetchMessagesByroomId(roomId) {
  try {
    const result = await getMessagesByRoomId(roomId);
    return {
      success: true,
      error: false,
      message: "Messages fetched successfully",
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "Internal error while fetching messages",
      data: null
    };
  }
}


// Delete (soft delete) a message
export async function removeMessage(messageId, userId) {
  try {
    const result = await deleteMessage(messageId, userId);

    if (!result.data) {
      return {
        success: false,
        error: true,
        message: "Message not found",
        data: null
      };
    }

    return {
      success: true,
      error: false,
      message: "Message deleted successfully",
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "Internal error while deleting message",
      data: null
    };
  }
}

(async ()=>{
    const res=await removeMessage(20,1);
    console.log(res);
})();
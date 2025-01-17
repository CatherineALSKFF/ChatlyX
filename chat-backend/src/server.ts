import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

// Define Client, Message, and Room Types
type Client = {
  id: string;
  username: string;
  socket: WebSocket;
  roomId?: string;
};

type Message = {
  id: string;
  timestamp: number;
  text: string;
  user: string;
  roomId: string;
  edited?: boolean;
  deleted?: boolean;
};

type Room = {
  id: string;
  name: string;
  messages: Message[];
  participants: string[];
  unreadCount: number;
};

const PORT = 8080;
const server = new WebSocketServer({ port: PORT });

let clients: Client[] = [];
let rooms: Room[] = [];

// Initialize the default "Main Chat" room
const mainChatRoom: Room = {
  id: uuidv4(),
  name: 'Main Chat',
  messages: [],
  participants: [],
  unreadCount: 0,
};
rooms.push(mainChatRoom);

server.on('connection', (socket: WebSocket) => {
  const clientId = uuidv4();
  const client: Client = { id: clientId, username: '', socket };
  clients.push(client);

  console.log(`Client connected: ${clientId}`);

  // Automatically add the user to the default "Main Chat" room
  joinRoom(clientId, mainChatRoom.id);

  socket.on('message', (data: string) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'set-username': {
          handleSetUsername(clientId, message.username, socket);
          break;
        }

        case 'create-room': {
          createRoom(message.roomName);
          break;
        }

        case 'join-room': {
          joinRoom(clientId, message.roomId);
          break;
        }

        case 'new-message': {
          handleNewMessage(clientId, message.text, socket);
          break;
        }

        case 'edit-message': {
          handleEditOrDeleteMessage('edit', clientId, message, socket);
          break;
        }

        case 'delete-message': {
          handleEditOrDeleteMessage('delete', clientId, message, socket);
          break;
        }

        default: {
          socket.send(JSON.stringify({ type: 'error', message: 'Unsupported action.' }));
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
    }
  });

  socket.on('close', () => {
    handleDisconnect(clientId);
  });

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
});

// 🔄 Helper Functions

function handleSetUsername(clientId: string, username: string, socket: WebSocket) {
  const user = clients.find((c) => c.id === clientId);
  if (user) {
    if (!username.trim()) {
      socket.send(JSON.stringify({ type: 'error', message: 'Username cannot be empty.' }));
      return;
    }

    if (clients.some((c) => c.username === username)) {
      socket.send(JSON.stringify({ type: 'error', message: 'Username already taken.' }));
      return;
    }

    user.username = username.trim();
    broadcastToRoom(user.roomId!, {
      type: 'participants-updated',
      participants: getParticipantsInRoom(user.roomId!),
    });
  }
}

function createRoom(roomName: string) {
  const roomId = uuidv4();
  const newRoom: Room = {
    id: roomId,
    name: roomName,
    messages: [],
    participants: [],
    unreadCount: 0,
  };
  rooms.push(newRoom);

  broadcast({
    type: 'room-list-updated',
    rooms: rooms.map((room) => ({
      id: room.id,
      name: room.name,
      unreadCount: room.unreadCount,
    })),
  });
}

function joinRoom(clientId: string, roomId: string) {
  const user = clients.find((c) => c.id === clientId);
  const room = rooms.find((r) => r.id === roomId);

  if (!user || !room) return;

  // Remove the user from the previous room
  if (user.roomId) {
    const previousRoom = rooms.find((r) => r.id === user.roomId);
    if (previousRoom) {
      previousRoom.participants = previousRoom.participants.filter(id => id !== clientId);
      broadcastToRoom(previousRoom.id, {
        type: 'room-participants-updated',
        participants: getParticipantsInRoom(previousRoom.id),
      });
    }
  }

  // Add user to the new room
  user.roomId = roomId;
  room.participants.push(clientId);

  user.socket.send(
    JSON.stringify({
      type: 'room-joined',
      roomId: room.id,
      roomName: room.name,
      messages: room.messages,
      participants: getParticipantsInRoom(room.id),
    })
  );

  broadcastToRoom(room.id, {
    type: 'room-participants-updated',
    participants: getParticipantsInRoom(room.id),
  });
}

function handleNewMessage(clientId: string, text: string, socket: WebSocket) {
  const user = clients.find((c) => c.id === clientId);
  if (!user || !user.roomId) {
    socket.send(JSON.stringify({ type: 'error', message: 'You must join a room first.' }));
    return;
  }

  const room = rooms.find((r) => r.id === user.roomId);
  if (!room) {
    socket.send(JSON.stringify({ type: 'error', message: 'Room not found.' }));
    return;
  }

  const newMessage: Message = {
    id: uuidv4(),
    timestamp: Date.now(),
    text: text.trim(),
    user: user.username,
    roomId: room.id,
  };

  room.messages.push(newMessage);
  room.unreadCount += 1;

  broadcastToRoom(room.id, {
    type: 'new-message',
    ...newMessage,
  });
}

function handleEditOrDeleteMessage(action: 'edit' | 'delete', clientId: string, message: any, socket: WebSocket) {
  const user = clients.find((c) => c.id === clientId);
  if (!user || !user.roomId) {
    socket.send(JSON.stringify({ type: 'error', message: 'You must join a room first.' }));
    return;
  }

  const room = rooms.find((r) => r.id === user.roomId);
  if (!room) return;

  const targetMessage = room.messages.find((msg) => msg.id === message.id);
  if (targetMessage && targetMessage.user === user.username) {
    if (action === 'edit') {
      targetMessage.text = message.text.trim();
      targetMessage.edited = true;
    } else if (action === 'delete') {
      targetMessage.deleted = true;
    }

    broadcastToRoom(user.roomId, {
      type: `${action}-message`,
      id: targetMessage.id,
      text: targetMessage.text,
    });
  }
}

function handleDisconnect(clientId: string) {
  clients = clients.filter((client) => client.id !== clientId);
  rooms.forEach((room) => {
    room.participants = room.participants.filter(id => id !== clientId);
  });
}

function getParticipantsInRoom(roomId: string) {
  return rooms.find((r) => r.id === roomId)?.participants.map((id) => {
    const participant = clients.find((c) => c.id === id);
    return participant ? { id: participant.id, username: participant.username } : null;
  }) || [];
}

function broadcast(data: any) {
  clients.forEach((client) => {
    client.socket.send(JSON.stringify(data));
  });
}

function broadcastToRoom(roomId: string, data: any) {
  rooms.find((r) => r.id === roomId)?.participants.forEach((clientId) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) client.socket.send(JSON.stringify(data));
  });
}

console.log(`WebSocket server running on ws://localhost:${PORT}`);

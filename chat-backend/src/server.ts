import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

type Client = {
  id: string;
  username: string;
  socket: WebSocket;
  roomId?: string; // Room the user is currently in
};

type Message = {
  id: string;
  timestamp: number;
  text: string;
  user: string;
  edited?: boolean;
  deleted?: boolean;
};

type Room = {
  id: string;
  name: string;
  messages: Message[];
  participants: string[]; // List of client IDs
  unreadCount: number; // Count of unread messages
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
  mainChatRoom.participants.push(clientId);
  client.roomId = mainChatRoom.id;

  // Notify the new user about the default room
  socket.send(
    JSON.stringify({
      type: 'room-joined',
      roomId: mainChatRoom.id,
      roomName: mainChatRoom.name,
      messages: mainChatRoom.messages,
      participants: mainChatRoom.participants.map((id) => {
        const participant = clients.find((c) => c.id === id);
        return participant ? { id: participant.id, username: participant.username } : null;
      }),
    })
  );

  // Notify all participants in the room about the updated participant list
  broadcastToRoom(mainChatRoom.id, {
    type: 'room-participants-updated',
    participants: mainChatRoom.participants.map((id) => {
      const participant = clients.find((c) => c.id === id);
      return participant ? { id: participant.id, username: participant.username } : null;
    }),
  });

  socket.on('message', (data: string) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'set-username': {
          const user = clients.find((c) => c.id === clientId);
          if (user) {
            if (!message.username.trim()) {
              socket.send(JSON.stringify({ type: 'error', message: 'Username cannot be empty.' }));
              return;
            }

            if (clients.some((c) => c.username === message.username)) {
              socket.send(JSON.stringify({ type: 'error', message: 'Username already taken.' }));
              return;
            }

            user.username = message.username.trim();
            broadcast({
              type: 'participants-updated',
              participants: clients.map((c) => ({ id: c.id, username: c.username })),
            });
          }
          break;
        }

        case 'create-room': {
          const roomId = uuidv4();
          const newRoom: Room = {
            id: roomId,
            name: message.roomName,
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
          break;
        }

        case 'join-room': {
          const room = rooms.find((r) => r.id === message.roomId);
          if (!room) {
            socket.send(JSON.stringify({ type: 'error', message: 'Room not found.' }));
            return;
          }

          if (!room.participants.includes(clientId)) {
            room.participants.push(clientId);
          }

          const user = clients.find((c) => c.id === clientId);
          if (user) user.roomId = message.roomId;

          room.unreadCount = 0; // Reset unread count when someone joins the room

          socket.send(
            JSON.stringify({
              type: 'room-joined',
              roomId: room.id,
              roomName: room.name,
              messages: room.messages,
              participants: room.participants.map((id) => {
                const participant = clients.find((c) => c.id === id);
                return participant ? { id: participant.id, username: participant.username } : null;
              }),
            })
          );

          broadcastToRoom(room.id, {
            type: 'room-participants-updated',
            participants: room.participants.map((id) => {
              const participant = clients.find((c) => c.id === id);
              return participant ? { id: participant.id, username: participant.username } : null;
            }),
          });

          broadcast({
            type: 'room-list-updated',
            rooms: rooms.map((room) => ({
              id: room.id,
              name: room.name,
              unreadCount: room.unreadCount,
            })),
          });
          break;
        }

        case 'new-message': {
          const user = clients.find((c) => c.id === clientId);
          if (!user || !user.roomId) {
            socket.send(
              JSON.stringify({ type: 'error', message: 'You must join a room first.' })
            );
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
            text: message.text.trim(),
            user: user.username,
          };

          room.messages.push(newMessage);
          room.unreadCount += 1; // Increment unread count

          broadcastToRoom(user.roomId, { type: 'new-message', ...newMessage });
          broadcast({
            type: 'room-list-updated',
            rooms: rooms.map((room) => ({
              id: room.id,
              name: room.name,
              unreadCount: room.unreadCount,
            })),
          });
          break;
        }

        // Other cases for editing and deleting messages...


                case 'edit-message': {
          const user = clients.find((c) => c.id === clientId);
          if (!user || !user.roomId) {
            socket.send(
              JSON.stringify({ type: 'error', message: 'You must join a room first.' })
            );
            return;
          }

          const room = rooms.find((r) => r.id === user.roomId);
          if (!room) {
            socket.send(JSON.stringify({ type: 'error', message: 'Room not found.' }));
            return;
          }

          const msgToEdit = room.messages.find((msg) => msg.id === message.id);
          if (msgToEdit && msgToEdit.user === user.username) {
            msgToEdit.text = message.text.trim();
            msgToEdit.edited = true;
            broadcastToRoom(user.roomId, {
              type: 'edit-message',
              id: msgToEdit.id,
              text: msgToEdit.text,
            });
          } else {
            socket.send(JSON.stringify({ type: 'error', message: 'You cannot edit this message.' }));
          }
          break;
        }

        case 'delete-message': {
          const user = clients.find((c) => c.id === clientId);
          if (!user || !user.roomId) {
            socket.send(
              JSON.stringify({ type: 'error', message: 'You must join a room first.' })
            );
            return;
          }

          const room = rooms.find((r) => r.id === user.roomId);
          if (!room) {
            socket.send(JSON.stringify({ type: 'error', message: 'Room not found.' }));
            return;
          }

          const msgToDelete = room.messages.find((msg) => msg.id === message.id);
          if (msgToDelete && msgToDelete.user === user.username) {
            msgToDelete.deleted = true;
            broadcastToRoom(user.roomId, {
              type: 'delete-message',
              id: msgToDelete.id,
            });
          } else {
            socket.send(JSON.stringify({ type: 'error', message: 'You cannot delete this message.' }));
          }
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
    const userIndex = clients.findIndex((client) => client.id === clientId);
    if (userIndex !== -1) {
      const user = clients[userIndex];
      if (user.roomId) {
        const room = rooms.find((r) => r.id === user.roomId);
        if (room) {
          room.participants = room.participants.filter((id) => id !== clientId);
          broadcastToRoom(room.id, {
            type: 'room-participants-updated',
            participants: room.participants.map((id) => {
              const participant = clients.find((c) => c.id === id);
              return participant ? { id: participant.id, username: participant.username } : null;
            }),
          });
        }
      }

      clients.splice(userIndex, 1);
      broadcast({
        type: 'participants-updated',
        participants: clients.map((c) => ({ id: c.id, username: c.username })),
      });
    }
    console.log(`Client disconnected: ${clientId}`);
  });

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
});

function broadcast(data: any) {
  clients.forEach((client) => {
    client.socket.send(JSON.stringify(data));
  });
}

function broadcastToRoom(roomId: string, data: any) {
  const room = rooms.find((r) => r.id === roomId);
  if (room) {
    room.participants.forEach((clientId) => {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        client.socket.send(JSON.stringify(data));
      }
    });
  }
}

console.log(`WebSocket server running on ws://localhost:${PORT}`);

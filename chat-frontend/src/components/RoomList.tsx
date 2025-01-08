import React from 'react';

type Room = {
  id: string;
  name: string;
  unreadCount: number;
};

type RoomListProps = {
  rooms: Room[];
  currentRoom: Room | null;
  joinRoom: (roomId: string) => void;
  createRoom: () => void;
  newRoomName: string;
  setNewRoomName: (name: string) => void;
};

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  currentRoom,
  joinRoom,
  createRoom,
  newRoomName,
  setNewRoomName,
}) => {
  return (
    <div>
      <h2>Available Rooms</h2>
      <input
        type="text"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        placeholder="Room name"
      />
      <button onClick={createRoom}>Create Room</button>
      {rooms.map((room) => (
        <div key={room.id}>
          <p>
            {room.name} {room.unreadCount > 0 && `(${room.unreadCount} new)`}
          </p>
          <button onClick={() => joinRoom(room.id)}>Join</button>
        </div>
      ))}
    </div>
  );
};

export default RoomList;

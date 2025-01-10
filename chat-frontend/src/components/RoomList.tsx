import React, { useState } from 'react';
import styles from '../styles/components/RoomList.module.css';

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
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  return (
    <div className={styles.roomList} aria-labelledby="chat-rooms-heading">
      <div className={styles.title}>
        Chat Rooms
        <img
          src="/icons/plus-icon-light.svg"
          alt="Add Room"
          className={styles.addIcon}
          onClick={() => setIsCreatingRoom((prev) => !prev)}
          aria-label="Add a new chat room"
        />
      </div>
      <hr className={styles.separator} />

      {isCreatingRoom && (
        <div className={styles.createRoom}>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name"
            className={styles.roomInput}
            aria-label="Enter new room name"
          />
          <button onClick={createRoom} className={styles.createRoomButton} aria-label="Create chat room">
            Create
          </button>
        </div>
      )}

      <ul className={styles.list} aria-label="List of available chat rooms">
        {rooms.map((room) => (
          <li
            key={room.id}
            className={`${styles.listItem} ${
              currentRoom?.id === room.id ? styles.active : ''
            }`}
            onClick={() => joinRoom(room.id)}
            role="button"
            aria-pressed={currentRoom?.id === room.id}
        aria-label={`Join ${room.name} room ${
          room.unreadCount > 0 ? `, ${room.unreadCount} new messages` : ''
        }`}
          >
            {room.name}
            {room.unreadCount > 0 && currentRoom?.id !== room.id && (
              <span className={styles.unread} >({room.unreadCount} new)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;

import React from 'react';
import styles from '../styles/components/Sidebar.module.css';

type SidebarProps = {
  rooms: { id: string; name: string; unreadCount: number }[];
  participants: { id: string; username: string }[];
  currentRoom: { id: string; name: string } | null;
  joinRoom: (roomId: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ rooms, participants, currentRoom, joinRoom }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>ChatlyX</div>
      <div className={styles.section}>
        <h3>Rooms</h3>
        <ul className={styles.list}>
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`${styles.listItem} ${currentRoom?.id === room.id ? styles.active : ''}`}
              onClick={() => joinRoom(room.id)}
            >
              {room.name}
              {room.unreadCount > 0 && <span className={styles.unread}>({room.unreadCount} new)</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <h3>Participants</h3>
        <ul className={styles.list}>
          {participants.map((participant) => (
            <li key={participant.id} className={styles.participant}>
              {participant.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

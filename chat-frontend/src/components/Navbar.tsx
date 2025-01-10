import React from 'react';
import styles from '../styles/components/Navbar.module.css';

type Room = {
  id: string;
  name: string;
  unreadCount: number;
};

type Participant = {
  id: string;
  username: string;
};

type NavbarProps = {
  currentRoom: Room | null;
  participants: Participant[];
  view: 'participants' | 'chat';
  setView: (view: 'participants' | 'chat') => void;
  toggleRoomList: () => void;
  
};

const Navbar: React.FC<NavbarProps> = ({
  currentRoom,
  view,
  setView,
  toggleRoomList,
  participants,
}) => {
  return (
    <div className={styles.navbar} aria-label="Main navigation bar">
      <div className={styles.title}>CHATLY X</div>
      <div className={styles.roomName} onClick={toggleRoomList} aria-label="Toggle room list" >
        {currentRoom?.name || 'No Room Selected'}
        <img
          src="/icons/arrow-icon.svg"
          alt="Toggle Room List"
          className={styles.arrowIcon}
          aria-label="Dropdown to view or create chat rooms"
          
        />
      </div>
      <div className={styles.navButtons}>
        <span
          className={`${styles.navButton} ${styles.left} ${
            view === 'participants' ? styles.active : ''
          }`}
          onClick={() => setView('participants')}
          aria-label="Switch to participants view"
        >
          Participants ({participants.filter(p => p.username).length})
        </span>
        <span
          className={`${styles.navButton} ${styles.right} ${
            view === 'chat' ? styles.active : ''
          }`}
          onClick={() => setView('chat')}
          aria-label="Switch to chat view"
        >
          Chat
        </span>
      </div>
    </div>
  );
};

export default Navbar;

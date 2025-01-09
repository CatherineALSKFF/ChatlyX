import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/components/MessageList.module.css';

type Message = {
  id: string;
  timestamp: number;
  text: string;
  user: string;
  edited?: boolean;
  deleted?: boolean;
};

type MessageListProps = {
  messages: Message[];
  startEditingMessage: (id: string, text: string) => void;
  deleteMessage: (id: string) => void;
  editingMessageId: string | null;
  editingText: string;
  setEditingText: (text: string) => void;
  saveEditedMessage: () => void;
  currentUsername: string;
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  startEditingMessage,
  deleteMessage,
  editingMessageId,
  editingText,
  setEditingText,
  saveEditedMessage,
  currentUsername,
}) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.messageList} ref={messageListRef}>
      {messages.map((msg) => {
        const isCurrentUser = msg.user === currentUsername;
        const rowClass = isCurrentUser
          ? styles.currentUserRow
          : styles.otherUserRow;

        return (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${rowClass} ${
              visibleMenuId === msg.id ? 'showMenu' : ''
            }`}
          >
            <img
              src="/icons/menu-icon.svg"
              alt="Menu"
              className={styles.menuIcon}
              onClick={() =>
                setVisibleMenuId((prevId) => (prevId === msg.id ? null : msg.id))
              }
            />
            {visibleMenuId === msg.id && (
              <div className={styles.menuOptions}>
                <button onClick={() => startEditingMessage(msg.id, msg.text)}>
                  Edit
                </button>
                <button onClick={() => deleteMessage(msg.id)}>Delete</button>
              </div>
            )}
            <div
              className={`${styles.message} ${
                isCurrentUser ? styles.currentUser : styles.otherUser
              }`}
            >
              {editingMessageId === msg.id ? (
                <div className={styles.editContainer}>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className={styles.editInput}
                  />
                  <button
                    onClick={saveEditedMessage}
                    className={styles.saveButton}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingText('')}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p className={styles.senderName}>{msg.user}</p>
                  <p className={styles.messageContent}>
                    {msg.deleted ? (
                      <span className={styles.deletedMessage}>
                        Message deleted
                      </span>
                    ) : (
                      msg.text
                    )}
                    {msg.edited && (
                      <span className={styles.editedTag}> (edited)</span>
                    )}
                  </p>
                  <div className={styles.timestampHover}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;

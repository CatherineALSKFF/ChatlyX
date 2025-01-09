import React from 'react';
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
  return (
    <div className={styles.messageList}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`${styles.message} ${
            msg.user === currentUsername ? styles.currentUser : styles.otherUser
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
              <button onClick={saveEditedMessage} className={styles.saveButton}>
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
                  <span className={styles.deletedMessage}>Message deleted</span>
                ) : (
                  msg.text
                )}
                {msg.edited && <span className={styles.editedTag}> (edited)</span>}
              </p>
              <p className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {msg.user === currentUsername && !msg.deleted && (
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => startEditingMessage(msg.id, msg.text)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;

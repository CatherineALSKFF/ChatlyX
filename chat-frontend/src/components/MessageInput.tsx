import React, { useState } from 'react';
import styles from '../styles/components/MessageInput.module.css';

type MessageInputProps = {
  sendMessage: (text: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className={styles.messageInput}
          aria-label="Message input field"
        />
        <img
          src="/icons/send-icon.svg"
          alt="Send"
          className={styles.sendIcon}
          onClick={handleSend}
          aria-label="Send message"
        />
      </div>
    </div>
  );
};

export default MessageInput;

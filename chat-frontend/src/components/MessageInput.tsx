import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import styles from '../styles/components/MessageInput.module.css';

type MessageInputProps = {
  sendMessage: (text: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        {/* Emoji Icon */}
        <img
          src="/icons/emoji-icon.svg"
          alt="Emoji Picker"
          className={styles.emojiIcon}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className={styles.emojiPicker}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* Send Icon */}
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

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageInput from '../MessageInput';

describe('MessageInput Component', () => {
  it('renders input and send button', () => {
    render(<MessageInput sendMessage={jest.fn()} />);

    const inputElement = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('img', { name: /send message/i });

    expect(inputElement).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<MessageInput sendMessage={jest.fn()} />);

    const inputElement = screen.getByPlaceholderText('Type a message...');

    fireEvent.change(inputElement, { target: { value: 'Hello World' } });
    expect(inputElement).toHaveValue('Hello World');
  });

  it('calls sendMessage when clicking send icon', () => {
    const mockSendMessage = jest.fn();
    render(<MessageInput sendMessage={mockSendMessage} />);

    const inputElement = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('img', { name: /send message/i });

    fireEvent.change(inputElement, { target: { value: 'Test Message' } });
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith('Test Message');
    expect(inputElement).toHaveValue('');
  });

  it('calls sendMessage when pressing Enter', () => {
    const mockSendMessage = jest.fn();
    render(<MessageInput sendMessage={mockSendMessage} />);

    const inputElement = screen.getByPlaceholderText('Type a message...');

    fireEvent.change(inputElement, { target: { value: 'Test Enter' } });
    fireEvent.keyPress(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockSendMessage).toHaveBeenCalledWith('Test Enter');
    expect(inputElement).toHaveValue('');
  });

  it('does not call sendMessage if input is empty', () => {
    const mockSendMessage = jest.fn();
    render(<MessageInput sendMessage={mockSendMessage} />);

    const sendButton = screen.getByRole('img', { name: /send message/i });
    fireEvent.click(sendButton);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});

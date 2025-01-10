import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

const mockJoinRoom = jest.fn();
const mockCreateRoom = jest.fn();
const mockSetNewRoomName = jest.fn();

const mockRooms = [
  { id: '1', name: 'General', unreadCount: 2 },
  { id: '2', name: 'Random', unreadCount: 0 },
];

const mockParticipants = [
  { id: '1', username: 'Alice' },
  { id: '2', username: 'Bob' },
];

const setup = (currentRoomId: string | null = null) => {
  render(
    <Sidebar
      rooms={mockRooms}
      participants={mockParticipants}
      currentRoom={mockRooms.find((room) => room.id === currentRoomId) || null}
      joinRoom={mockJoinRoom}
      createRoom={mockCreateRoom}
      newRoomName=""
      setNewRoomName={mockSetNewRoomName}
      currentUsername="Alice"
    />
  );
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('renders the Sidebar with rooms and participants', () => {
    setup();

    // Check for the title
    expect(screen.getByText('CHATLY X')).toBeInTheDocument();

    // Check that rooms are rendered
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Random')).toBeInTheDocument();

    // Check that participants are rendered
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('displays unread message count for rooms', () => {
    setup();

    expect(screen.getByText('(2 new)')).toBeInTheDocument();
  });

  it('calls joinRoom when a room is clicked', () => {
    setup();

    const generalRoom = screen.getByRole('button', { name: /join general room/i });
    fireEvent.click(generalRoom);

    expect(mockJoinRoom).toHaveBeenCalledTimes(1);
    expect(mockJoinRoom).toHaveBeenCalledWith('1');
  });

  it('toggles the room creation input when the plus icon is clicked', () => {
    setup();

    const addRoomButton = screen.getByLabelText('Create a new chat room');
    fireEvent.click(addRoomButton);

    // Check if the input and create button are visible
    expect(screen.getByLabelText('Room name input')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm room creation')).toBeInTheDocument();
  });

  it('calls createRoom when the create button is clicked', () => {
    setup();

    const addRoomButton = screen.getByLabelText('Create a new chat room');
    fireEvent.click(addRoomButton);

    const input = screen.getByLabelText('Room name input');
    const createButton = screen.getByLabelText('Confirm room creation');

    fireEvent.change(input, { target: { value: 'New Room' } });
    fireEvent.click(createButton);

    expect(mockSetNewRoomName).toHaveBeenCalledWith('New Room');
    expect(mockCreateRoom).toHaveBeenCalledTimes(1);
  });

  it('highlights the active room', () => {
    setup('1'); // General room is the active one

    const activeRoom = screen.getByRole('button', { name: /join general room/i });
    expect(activeRoom).toHaveClass('active');
  });
});

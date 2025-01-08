import React from 'react';

type Participant = {
  id: string;
  username: string;
};

type ParticipantsListProps = {
  participants: Participant[];
};

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  return (
    <div>
      <h3>Participants</h3>
      {participants.map((p) => (
        <p key={p.id}>{p.username}</p>
      ))}
    </div>
  );
};

export default ParticipantsList;

import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../lib/firebase";

type MessageProps = {
  user: string;
  message: {
    message?: string;
    photoURL?: string;
    timestamp?: number;
    user?: string;
  };
};

export const Message = ({ user, message }: MessageProps) => {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user === userLoggedIn?.email ? Sender : Receiver;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp
            ? new Intl.DateTimeFormat("en-GB", { timeStyle: "short" }).format(
                message.timestamp
              )
            : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
};

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 10px 20px;
  border-radius: 35px;
  margin-bottom: 10px;
  min-width: 60px;
  max-width: 600px;
  position: relative;
  text-align: right;
  color: black;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #00c781;
`;

const Receiver = styled(MessageElement)`
  background-color: #777777;
  text-align: left;
  margin-left: 2em;
`;

const Timestamp = styled.span`
  color: #202020;
  /* padding: 10px; */
  font-size: 9px;
`;

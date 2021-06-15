import { useState, useRef } from "react";
import { Avatar } from "grommet";
import { MoreVertical, Emoji } from "grommet-icons";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../lib/firebase";
import { Message } from "./Message";
import firebase from "firebase";
import { getRecipientEmail } from "../lib/getRecipientEmail";
import TimeAgo from "timeago-react";
import { Drawer } from "./Drawer";

type ChatScreenProps = {
  chat: {
    id: string;
    users: [string, string];
  };
  messages: string;
};

export const ChatScreen = ({ chat, messages }: ChatScreenProps) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const endOfMessagesRef = useRef(null);

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id as string)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const [input, setInput] = useState("");

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => {
        return (
          <Message key={message.id} user={message.user} message={message} />
        );
      });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // update last seen
    db.collection("users").doc(user?.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(router.query.id as string)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user?.photoURL,
      });
    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Container>
      <Header>
        {recipient ? (
          <RecipientAvatar src={recipient?.photoURL} />
        ) : (
          <RecipientAvatar>
            {recipientEmail ? recipientEmail[0] : "A"}
          </RecipientAvatar>
        )}
        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last Active:
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active ...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <Drawer />
        </HeaderIcons>
      </Header>
      <MessageContainer>
        <StartOFMessage />
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
      </InputContainer>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  border: 1px solid transparent;
`;

const HeaderIcons = styled.div`
  align-items: center;
  justify-content: flex-end;
  margin: 0 300px 0 auto;
  height: 100%;

  @media (max-width: 1000px) {
    margin: 0 0 0 auto;
  }
`;

const Header = styled.div`
  position: fixed;
  width: 100%;
  background: #131313;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 10px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid black;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const MessageContainer = styled.div`
  max-width: 90%;
`;

const EndOfMessage = styled.div`
  margin-top: 210px;
`;

const StartOFMessage = styled.div`
  margin-bottom: 90px;
`;

const InputContainer = styled.form`
  display: flex;
  padding: 20px 0;
  position: fixed;
  bottom: 0;
  background-color: #000000;
  z-index: 1;
  width: 100%;
  padding-right: 6em;

  @media (max-width: 1000px) {
    padding-right: initial;
    align-items: center;
    justify-content: center;
  }
`;

const Input = styled.input`
  outline: 0;
  border: none;
  border-radius: 30px;
  padding: 20px;
  height: 100%;
  background-color: #333333;
  color: #d3d3d3;
  font-size: 1.2em;
  width: calc(90% - 400px);
  margin-left: 35px;

  @media (max-width: 1000px) {
    margin-left: initial;
    width: calc(90%);
  }
`;

const RecipientAvatar = styled(Avatar)`
  background: black;
`;

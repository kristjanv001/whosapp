import styled from "styled-components";
import Head from "next/head";
import { SideBar } from "../../components/SideBar";
import { ChatScreen } from "../../components/ChatScreen";
import { GetServerSideProps } from "next";
import { db, auth } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRecipientEmail } from "../../lib/getRecipientEmail";
import firebase from "firebase";

type ChatProps = {
  chat: {
    id: string;
    users: [string, string];
  };
  messages: string;
};

export default function Chat({ chat, messages }: ChatProps) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <SideBar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ref = db.collection("chats").doc(context.query.id as string);

  // prep the messages
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages: { id: string }[] = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages: { id: string; timestamp?: any }) => {
      console.log(messages);
      return {
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
      };
    });

  // prep the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
};

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

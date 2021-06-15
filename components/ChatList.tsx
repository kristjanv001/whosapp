import { ChatInstance } from "./ChatInstance";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";

export const ChatList = () => {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  return (
    <Container>
      {chatsSnapshot?.docs.map((chat) => {
        return (
          <ChatInstance key={chat.id} id={chat.id} users={chat.data().users} />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  /* margin-top: 3em; */
`;

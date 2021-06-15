import styled from "styled-components";
import { Avatar } from "grommet";
import { User } from "grommet-icons";
import { getRecipientEmail } from "../lib/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

type ChatInstanceProps = {
  id: string;
  users: firebase.User[];
};

export const ChatInstance = ({ id, users }: ChatInstanceProps) => {
  const [user] = useAuthState(auth);
  const [recipientSnapShot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
  const recipient = recipientSnapShot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);
  const router = useRouter();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL}>?</UserAvatar>
      ) : (
        <UserAvatar>{recipientEmail ? recipientEmail[0] : "A"}</UserAvatar>
      )}

      <p>{recipientEmail || "anonymous"}</p>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px 0;
  word-break: break-all;
  margin: 10px 0;
  transition: all 300ms ease;

  :hover {
    background-color: #7d4cdb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px 15px 5px;
  background-color: #2b2b2b;
  color: white;
`;

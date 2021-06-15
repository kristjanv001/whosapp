import { Avatar } from "grommet";
import { StartNewChat } from "./StartNewChat";
import styled from "styled-components";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChatList } from "./ChatList";

export const SideBar = () => {
  const [user] = useAuthState(auth);
  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <UserAvatar onClick={() => auth.signOut()} src={user?.photoURL!} />
        </Header>
      </HeaderWrapper>
      <StartNewChat />
      <ChatList />
    </Container>
  );
};

const Container = styled.div`
  background: #131313;
  min-height: 100vh;
  width: 500px;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  margin-bottom: 2em;

  top: 0;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
`;
export const UserAvatar = styled(Avatar)`
  cursor: pointer;
  border: 1px solid gray;

  :hover {
    opacity: 0.8;
  }
`;

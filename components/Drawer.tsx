import styled from "styled-components";
import { useState } from "react";
import { MoreVertical } from "grommet-icons";
import { HeaderWrapper, Header, UserAvatar } from "./SideBar";
import { StartNewChat } from "./StartNewChat";
import { ChatList } from "./ChatList";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const Drawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [user] = useAuthState(auth);

  return (
    <>
      <MoreBtn onClick={() => setOpenDrawer(!openDrawer)} />

      <MenuContainer openDrawer={openDrawer}>
        <HeaderWrapper>
          <Header>
            <UserAvatar onClick={() => auth.signOut()} src={user?.photoURL!} />
          </Header>
        </HeaderWrapper>
        <StartNewChat />
        <ChatList />
      </MenuContainer>
    </>
  );
};

const MoreBtn = styled(MoreVertical)`
  height: 100%;
  margin: 5px;

  &:hover {
    cursor: pointer;
    fill: #ebebeb;
  }

  @media (min-width: 1000px) {
    display: none;
  }
`;

const MenuContainer = styled.nav<{ openDrawer: boolean }>`
  width: 50%;
  width: 250px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  background: #131313;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ openDrawer }) =>
    openDrawer ? "translateX(0)" : "translateX(-100%)"};

  @media (min-width: 1000px) {
    display: none;
  }
`;

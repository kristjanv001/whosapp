import styled from "styled-components";
import Head from "next/head";
import { Button } from "grommet";
import { auth, googleAuthProvider } from "../lib/firebase";

export default function Login() {
  const signIn = () => {
    auth.signInWithPopup(googleAuthProvider).catch((err) => console.error(err));
  };

  const signInAnon = () => {
    auth
      .signInAnonymously()
      .then(() => {
        // Signed in..
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
        <Button onClick={signIn} primary label="Sign in with Google" />

        <AnonButton onClick={signInAnon}> Sign in anonymously </AnonButton>
      </LoginContainer>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: #1b1b1b;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #3d138d;
  border-radius: 5px;
  color: black;
  box-shadow: 20px 10px;
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 999px;
  margin-bottom: 50px;
`;

const AnonButton = styled.button`
  border: none;
  outline: none;
  background: none;
  margin-top: 2em;
  color: #aa85e9;
  font-weight: 500;
  cursor: pointer;
  padding: 5px;
`;

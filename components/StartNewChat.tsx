import { useState } from "react";
import { Box, Button, Layer, Text, TextInput, Form, FormField } from "grommet";
import { FormClose } from "grommet-icons";
import * as EmailValidator from "email-validator";
import styled from "styled-components";
import { db, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

export const StartNewChat = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [currentUser] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", currentUser?.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const onSubmit = () => {
    if (
      EmailValidator.validate(value) &&
      !chatAlreadyExists(value) &&
      value !== currentUser?.email
    ) {
      try {
        db.collection("chats").add({
          users: [currentUser?.email, value],
        });
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
  };

  const chatAlreadyExists = (recipientEmail: string): boolean => {
    if (chatsSnapshot) {
      return !!chatsSnapshot.docs.find(
        (chat) =>
          chat
            .data()
            .users.find(
              (user: typeof currentUser) => user?.email === recipientEmail
            )?.length > 0
      );
    }
    return false;
  };

  const onClose = () => setOpen(false);
  const onOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Box fill align="center" justify="center" gap="medium">
        <SideBarBtn primary label="Start a new Chat" onClick={onOpen} />
      </Box>
      {open && (
        <Layer full={false}>
          <Box
            background="dark-1"
            pad="medium"
            gap="small"
            width={{ min: "medium" }}
            height={{ min: "small" }}
            fill
          >
            <Button alignSelf="end" icon={<FormClose />} onClick={onClose} />
            <Text>
              Enter the email address of the user you want to chat with.
            </Text>
            <Form onReset={() => setValue("")} onSubmit={onSubmit}>
              <FormField name="email" htmlFor="text-input-id" label="Email">
                <TextInput
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  id="text-input-id"
                  name="email"
                />
              </FormField>
              <Box direction="row" gap="medium">
                <Button type="submit" primary label="Submit" />
                <Button type="reset" label="Reset" />
              </Box>
            </Form>
          </Box>
        </Layer>
      )}
    </div>
  );
};

const SideBarBtn = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 0px;
  margin-bottom: 10px;
`;

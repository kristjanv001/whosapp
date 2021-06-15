import { FirebaseUser } from "./firebase";

export const getRecipientEmail = (
  users: string[],
  userLoggedIn: FirebaseUser
) => users?.filter((user) => user !== userLoggedIn.email)[0];

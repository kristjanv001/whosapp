import { FirebaseUser } from "./firebase";

export const getRecipientEmail = (
  users: string[],
  userLoggedIn: FirebaseUser | null | undefined
) => users?.filter((user) => user !== userLoggedIn?.email)[0];

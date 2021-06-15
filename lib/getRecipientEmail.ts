export const getRecipientEmail = (users, userLoggedIn) =>
  users?.filter((user) => user !== userLoggedIn.email)[0];

const createUser = async (data) => {
  try {
    const email = data.email;
    const password = data.password;

    admin
      .auth()
      .createUser({
        email: email,
        password: password,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        res.send("Successfully created new user:", userRecord.uid);
      })
      .catch((error) => {
        res.send("Error creating new user:", error);
      });
  } catch (error) {
    throw error;
  }
};

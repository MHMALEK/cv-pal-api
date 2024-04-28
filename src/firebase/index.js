const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./cvpal-bf782-firebase-adminsdk-5obj2-ea1c9e1193.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

async function authenticate(req, res, next) {
  const idToken = req.headers.authorization?.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = await User.findByPk(decodedToken.uid);
    if (!req.user) {
      req.user = await User.create({
        id: decodedToken.uid,
        email: decodedToken.email,
      });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}
exports.authenticate = authenticate;
exports.firebaseAdmin = firebaseAdmin;

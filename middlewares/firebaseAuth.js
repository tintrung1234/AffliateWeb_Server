const admin = require("firebase-admin");

// Khởi tạo Firebase Admin
const serviceAccount = require("../path/to/webblog-fcb1c-firebase-adminsdk-fbsvc-b4fe31bd29.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // có uid, email, v.v.
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = firebaseAuth;

import jwt from "jsonwebtoken";
const SECRET_KEY = "JWTseecretis12"; // Change this to your actual secret key

export const authenticateToken = (req, res, next) => {
  const { token } = req.cookies;
  const { username } = req.body;
  console.log(username);
  if (!token) {
    return res.status(401).json({ message: "Login First" });
  }

  jwt.verify(token, SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Set the user from the token to the request object
    req.user = user;
    next();
  });
};

export const localVariable = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

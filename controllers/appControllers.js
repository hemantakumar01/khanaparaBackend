const UserModle = require("../module/User.module.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const DataSchema = require("../module/pushDataSchema.js");

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
async function register(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;
    let user = await UserModle.findOne({ email });
    console.log(user);
    console.log(user.length);
    if (!user) {
      console.log(user);
      const hasedPassword = await bcrypt.hash(password, 10);
      user = await UserModle.create({
        email,
        password: hasedPassword,
        firstName,
        lastName,
      });
      const token = jwt.sign();
      res.status(201).send({ user, message: "User Created successfully" });
    } else {
      return res.status(404).send({ message: "User already exists" });
    }
  } catch (error) {
    console.log("This is Error");
    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModle.findOne({ email });
    if (!user) return res.status(404).send({ msg: "user not exist" });

    const isPasswordVerified = await bcrypt.compare(password, user.password);
    if (!isPasswordVerified)
      return res.status(400).send({ msg: "Password not matched" });
    const token = jwt.sign({ userId: user._id }, "JWTseecretis12", {
      expiresIn: "1h",
    });
    res
      .status(201)
      .cookie("token", token, { expiresIn: "1h" })
      .send({ msg: "Login Success" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Catch error" });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
async function getUser(req, res) {
  const { username } = req.params;
  if (!username) return res.status(400).send({ msg: "User Not Found" });
  try {
    const user = await UserModle.findOne({ username }).select("-password");
    if (!user) res.status(400).send({ msg: "User not Found" });
    res.status(200).send({ user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Error in Catch" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "id" : "<userid>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
async function updateUser(req, res) {
  try {
    const id = req.query.id;
    if (id) {
      const body = req.body;
      // update data
      const newData = await UserModle.findByIdAndUpdate(id, body, {
        new: true,
      });
      res.status(200).send({ msg: "Updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
}

/** GET: http://localhost:8080/api/generateOTP */
async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "OTP Verified" });
  }
  return res.status(400).send({ msg: "Invalid OTP" });
}

// Successfully redirect the user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Access Granted" });
  }
  return res.status(440).send({ msg: "Session Expired" });
}

// Update the password when we have a valid session
/** PUT: http://localhost:8080/api/resetPassword */
async function resetPassword(req, res) {
  try {
    // if (!req.app.locals.resetSession)
    //   return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    try {
      const hasedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await UserModle.findOneAndUpdate(
        { username },
        { $set: { password: hasedPassword } },
        { new: true }
      ); // Return the updated document
      if (!updatedUser) return res.status(400).send({ msg: "User Not found" });
      req.app.locals.resetSession = false; // Reset session
      return res.status(200).send({ msg: "Updated Successfully" });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
};

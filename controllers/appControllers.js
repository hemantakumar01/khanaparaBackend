import UserModle from "../module/User.module.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import DataSchema from "../module/pushDataSchema.js";

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
export async function register(req, res) {
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
      return res.status(404).send({ message: "User already exist" });
    }
  } catch (error) {
    console.log("This is Errroer");

    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModle.findOne({ email });
    if (!user) return res.status(404).send({ msg: "user not exist" });

    const isPasswordVerifed = await bcrypt.compare(password, user.password);
    if (!isPasswordVerifed)
      return res.status(400).send({ msg: "Pasword not matched" });
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
export async function getUser(req, res) {
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
export async function updateUser(req, res) {
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
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "OTP Verifyed" });
  }
  return res.status(400).send({ msg: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Access Granted" });
  }
  return res.status(440).send({ msg: "Session Expired" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
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
      req.app.locals.resetSession = false; // reset session
      return res.status(200).send({ msg: "Updated Succesfully" });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

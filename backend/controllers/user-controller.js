const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../schema/user");
const HttpError = require("../models/http-error");

const getUserById = async (req, res, next) => {
  let hasUser;

  try {
    hasUser = await User.findById(req.params.uid);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!hasUser) {
    return next(
      new HttpError("Could not find the user for the provided id.", 404)
    );
  }

  res.json({ user: hasUser.toObject({ getters: true }) }).status(200);
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again", 500));
  }

  if (hasUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const createUser = new User({
    name,
    email,
    password: hashPassword,
  });

  try {
    await createUser.save();
  } catch (error) {
    return next(
      new HttpError("Could not signed up, something went wrong.", 500)
    );
  }

  res.json({ user: createUser.toObject({ getters: true }) }).status(201);
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { email, password } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again", 500));
  }

  if (!hasUser) {
    return next(new HttpError("Invalid credentials, please valid email.", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, hasUser.password);
  } catch (err) {
    return next(new HttpError("Could not logged in, please try later.", 500));
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, please valid password.", 401)
    );
  }

  res.json({ user: hasUser.toObject({ getters: true }) }).status(200);
};

exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;

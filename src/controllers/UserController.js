const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendSuccessResponse, sendErrorResponse } = require("../helper/apiResponse");
const { generateToken } = require("../helper/generateToken");


exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    const result = users.map((item) => {
      let newItem = item.toObject();
      delete newItem.password;
      return newItem;
    });
    return sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return sendErrorResponse(res, "User with this email already exists", 409, "fail");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let newUser = new User({ ...req.body, password: hashedPassword });
    let result = await newUser.save();
    result = result.toObject();
    delete result.password;
    return sendSuccessResponse(res, result, 201, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

exports.getsingleUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    let result = user.toObject();
    delete result.password;
    if (!user) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    return sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    return sendSuccessResponse(res, "User deleted successfully.", 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  let updateData = req.body;

  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    updateData.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    let result = updatedUser.toObject();
    delete result.password;
    return sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

exports.logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, "User not found", 400, "fail");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendErrorResponse(res, "Incorrect password", 400, "fail");
    }
    
    const token = generateToken({ id: user._id })
    const data = user.toObject();
    delete data.password;
    return sendSuccessResponse(res, { token, data }, 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

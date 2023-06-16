const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Test = require("../models/testModel");
const request = require("request");
const fs = require("fs");

//function : adding user
const register = async (req, res) => {
  try {
    const { lastname, firstname, email, password, passwordVerify, role } =
      req.body;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]\\|;:'",.<>\/?])[A-Za-z\d!@#$%^&*()\-_=+{}[\]\\|;:'",.<>\/?]{8,}$/;

    //finding if existing user with the same email
    const existingUser = await User.findOne({
      $or: [{ email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "An account with those informations already exists" });
    }

    if (
      !email ||
      !password ||
      !passwordVerify ||
      !lastname ||
      !firstname ||
      !role
    ) {
      return res
        .status(400)
        .json({ error: "Please enter all required fields" });
    } else if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ error: "Invalid password : Password must contain ..." });
    } else if (password !== passwordVerify) {
      return res.status(400).json({ error: "Please enter the same password" });
    }

    //hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //save a new user account to database
    await new User({
      email,
      lastname,
      firstname,
      passwordHash,
      role,
      image: "",
      info: {
        data: "",
        contentType: "image/*",
      },
    }).save();

    return res.status(200).json({ message: "Registred successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in adding user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "error in getting users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    User.findByIdAndDelete({ _id: userId }, (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send({ error: "An error occurred while deleting the user." });
      } else {
        res.status(200).send({ message: "User deleted successfully." });
      }
    });
  } catch (error) {
    res.status(500).send({ error: " Ooops! error in deleting the user" });
  }
};

const getTestStatePerUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    Test.find({ createdBy: userId }).then((total) => {
      Test.find({ createdBy: userId, status: "Passed" })
        .then((passed) => {
          Test.find({
            createdBy: userId,
            status: "failed",
          }).then((failed) => {
            res.status(200).json({
              runPerUser: total.length,
              passedTests: passed.length,
              failedTests: failed.length,
            });
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error",
          });
        });
    });
  } catch (error) {}
};


const updateDataset = async (req, res) => {
  const options = {
    url: "http://127.0.0.1:5001/rapports/csv",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await new Promise((resolve, reject) => {
      request(options, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });

    res.status(200).send({ message: "Dataset updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while updating the dataset" });
  }
};


//exports
exports.register = register;
exports.getAllUsers = getAllUsers;
exports.deleteUser = deleteUser;
exports.getTestStatePerUserId = getTestStatePerUserId;
exports.updateDataset = updateDataset;

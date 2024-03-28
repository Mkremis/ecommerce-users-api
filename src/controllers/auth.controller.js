import Message from "../schemas/Message.js";
import { loginService, registerService } from "../services/auth.services.js";

export const loginController = async (req, res) => {
  try {
    const loginData = req.body;
    const isUser = req?.user;
    const loginResult = await loginService({ isUser, loginData });

    if (loginResult.fail?.isUser) {
      return res.status(404).json(new Message("fail", "User not found"));
    }

    if (loginResult.fail?.credentials) {
      return res.status(401).json(new Message("fail", "Incorrect credentials"));
    }

    if (loginResult.success) {
      res.cookie("jwt", loginResult.success.jwt, {
        httpOnly: process.env.NODE_ENV !== "development",
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json(loginResult.success.login);
    }

    return res.status(500).json(new Message("fail", "Login error"));
  } catch (error) {
    console.error(error);
    res.setStatus(500);
  }
};

export const registerController = async (req, res) => {
  try {
    let isUser = req?.user?.id;
    let registerData = req.body;

    const registerResult = await registerService({ isUser, registerData });

    if (registerResult.success) {
      return res
        .status(204)
        .json(new Message("success", "User registered successfully!"));
    }

    if (registerResult.fail?.alreadyUser) {
      return res
        .status(403)
        .json(new Message("fail", "Forbidden: User is already registered"));
    }

    return res.status(500).json(new Message("fail", "Registration error"));
  } catch (error) {
    console.error(error);
    res.setStatus(500);
  }
};

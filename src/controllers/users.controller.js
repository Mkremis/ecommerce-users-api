import Message from "../schemas/Message.js";
import {
  reloadSessionService,
  updateUserDashboardService,
  userDashboardService,
} from "../services/users.services.js";
import { encrypt } from "../utils/bcryptHandle.js";

export const getUserDashboardController = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardResult = await userDashboardService({ userId });
    if (dashboardResult.success) {
      return res.status(200).json(dashboardResult.success);
    } else {
      return res
        .status(500)
        .json(new Message("fail", "Failed to fetch user dashboard"));
    }
  } catch (error) {
    console.error(error);
    res.setStatus(500);
  }
};

export const updateUserDashboardController = async (req, res) => {
  try {
    const userData = req.body;

    const userId = req.user.id;

    if (userData.password) {
      userData.password = await encrypt(userData.password);
    }

    const dashboardResult = await updateUserDashboardService({
      userData,
      userId,
    });

    if (dashboardResult.success) {
      return res
        .status(200)
        .json(new Message("success", "User data successfully updated"));
    } else {
      return res
        .status(500)
        .json(new Message("fail", "Failed to update user dashboard"));
    }
  } catch (error) {
    console.error(error);
    res.setStatus(500);
  }
};

export const logoutController = async (req, res) => {
  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).json(new Message("success", "User logged out successfully"));
};

export const reloadSessionController = async (req, res) => {
  try {
    const userId = req.user.id;
    const reloadResult = await reloadSessionService({ userId });
    if (reloadResult.success) {
      res.status(200).json(reloadResult.success);
    } else {
      res.status(500).json(new Message("fail", "Failed to reload session"));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

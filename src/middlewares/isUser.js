// isUser.js
import dbPromise from "../index.js";

const isUser = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const db = await dbPromise;
    const response = await db.getUserByUsername({ userName });
    if (response.success) {
      req.user = {
        userName,
        id: response.success.id,
        password: response.success.password,
        email: response.success.email,
      };
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: [error.message] });
  }
};

export { isUser };

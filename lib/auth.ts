import jwt from "jsonwebtoken";

// Update createToken to include role
export const createToken = (userId: string, username: string) => {
  return jwt.sign({ userId, username}, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// Verify the token
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

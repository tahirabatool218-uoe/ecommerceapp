import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import type { Types } from "mongoose";
import User from "../models/User";
import type { ApiHandler } from "../types/api";
import type { UserRole } from "../types/express";
import type { LoginBody, RegisterBody } from "../types/requests";
import { getErrorMessage } from "../utils/errors";

type AuthData = {
  user: {
    id: Types.ObjectId;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
};

const generateToken = (userId: Types.ObjectId, role: string): string => {
  return jwt.sign(
    {
      id: userId,
      role: role
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    }
  );
};

export const registerUser: ApiHandler<AuthData, RegisterBody> = async (
  req,
  res
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required"
      });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists"
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: getErrorMessage(error)
    });
  }
};

export const loginUser: ApiHandler<AuthData, LoginBody> = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required"
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password"
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "Invalid email or password"
      });
      return;
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: getErrorMessage(error)
    });
  }
};

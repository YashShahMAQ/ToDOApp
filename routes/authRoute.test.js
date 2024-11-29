const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User")
const authRouter = require("../Routes/authRoute");

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("POST /api/auth/login", () => {
  const mockUser = {
    _id: "userId123",
    username: "testuser",
    password: "hashedPassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a token for valid credentials", async () => {
    User.findOne.mockResolvedValue(mockUser); // Mock User model
    bcrypt.compare.mockResolvedValue(true); // Mock bcrypt comparison
    jwt.sign.mockReturnValue("mockToken"); // Mock JWT token generation

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBe("mockToken");

    // Verify mocks were called with the correct arguments
    expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id, username: mockUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("should return 400 for invalid username", async () => {
    User.findOne.mockResolvedValue(null); // Simulate no user found

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "invaliduser", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
    expect(User.findOne).toHaveBeenCalledWith({ username: "invaliduser" });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test("should return 400 for invalid password", async () => {
    User.findOne.mockResolvedValue(mockUser); // Mock valid user
    bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "wrongpassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
    expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedPassword");
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test("should return 500 for server error", async () => {
    User.findOne.mockRejectedValue(new Error("Database error")); // Simulate server error

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server Error");
    expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
  });
});
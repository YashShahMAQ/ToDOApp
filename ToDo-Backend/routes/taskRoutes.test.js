const request = require("supertest");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const Task = require("../models/Task");
const taskRoutes = require("./taskRoutes");

jest.mock("../middleware/auth");
jest.mock("../models/Task");

const app = express();
app.use(express.json());
app.use("/api", taskRoutes);

describe("Task Routes", () => {
    const mockUserId = "user123";

    beforeEach(() => {
        jest.clearAllMocks();
        authMiddleware.mockImplementation((req, res, next) => {
            req.user = { id: mockUserId };
            next();
        });
    });

    describe("GET /api/tasks/:listId", () => {
        it("should return tasks for a given listId", async () => {
            const mockTasks = [
                { _id: "1", description: "Task 1", listId: "list123", userId: mockUserId },
                { _id: "2", description: "Task 2", listId: "list123", userId: mockUserId },
            ];

            Task.find.mockImplementation(() => ({
                sort: jest.fn().mockResolvedValue(mockTasks)
            }));

            const response = await request(app).get("/api/tasks/list123");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTasks);
            expect(Task.find).toHaveBeenCalledWith({ listId: "list123", userId: mockUserId });
        });

        it("should return 400 if listId is missing", async () => {
            const response = await request(app).get("/api/tasks/");

            expect(response.status).toBe(404); // Invalid route structure
        });
    });

    describe("POST /api/tasks", () => {
        it("should create a new task", async () => {
            const mockTask = { _id: "1", description: "New Task", listId: "list123", userId: mockUserId };
            Task.prototype.save = jest.fn().mockResolvedValue(mockTask);

            const response = await request(app).post("/api/tasks").send({
                listId: "list123",
                description: "New Task",
            });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockTask);
            expect(Task.prototype.save).toHaveBeenCalled();
        });

        it("should return 400 if listId or description is missing", async () => {
            const response = await request(app).post("/api/tasks").send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("List ID and Description are required");
        });

        it("should handle errors and return a 500 status code", async () => {
            Task.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

            const response = await request(app).post("/api/tasks").send({
                listId: "list123",
                description: "New Task",
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("There is an error while creating a Task");
        });
    });

    describe("PUT /api/tasks/:taskId", () => {
        it("should create a new task", async () => {
            const mockTask = {
                _id: "1",
                description: "New Task",
                listId: "list123",
                userId: mockUserId,
                save: jest.fn().mockResolvedValue({
                    _id: "1",
                    description: "New Task",
                    listId: "list123",
                    userId: mockUserId,
                }),
            };
        
            // Mock the Task constructor to return the mockTask object
            Task.mockImplementation(() => mockTask);
        
            const response = await request(app).post("/api/tasks").send({
                listId: "list123",
                description: "New Task",
            });
        
            // Assertions
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                _id: "1",
                description: "New Task",
                listId: "list123",
                userId: mockUserId,
            });
            expect(mockTask.save).toHaveBeenCalled();
        });
        
        it("should return 404 if the task is not found", async () => {
            Task.findOne.mockResolvedValue(null);

            const response = await request(app)
                .put("/api/tasks/1")
                .send({ description: "Updated Task" });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Task not found");
        });

        it("should handle errors and return a 500 status code", async () => {
            Task.findOne.mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .put("/api/tasks/1")
                .send({ description: "Updated Task" });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("There is an error while updating the Task");
        });
    });

    describe("DELETE /api/tasks/:taskId", () => {
        it("should delete an existing task", async () => {
            const mockTask = { _id: "1", description: "Task to delete", userId: mockUserId };
            Task.findOneAndDelete.mockResolvedValue(mockTask);

            const response = await request(app).delete("/api/tasks/1");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Task deleted successfully");
            expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: "1", userId: mockUserId });
        });

        it("should return 404 if the task is not found", async () => {
            Task.findOneAndDelete.mockResolvedValue(null);

            const response = await request(app).delete("/api/tasks/1");

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Task not found");
        });

        it("should handle errors and return a 500 status code", async () => {
            Task.findOneAndDelete.mockRejectedValue(new Error("Database error"));

            const response = await request(app).delete("/api/tasks/1");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("There is an error while deleting the Task");
        });
    });
});
const request = require("supertest");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const List = require("../models/List");
const listRoute = require("./listRoutes")

jest.mock("../middleware/auth");
jest.mock("../models/List");

const app = express();
app.use(express.json());
app.use("/api", listRoute);

describe("List Routes", () => {
    const mockUserId = "user123";

    beforeEach(() => {
        jest.clearAllMocks();
        authMiddleware.mockImplementation((req, res, next) => {
            req.user = { id: mockUserId };
            next();
        });
    });

    describe("GET /api/lists", () => {
        it("should return a list of to-dos for the authenticated user", async () => {

            console.log("Debugging the user id");
            const mockLists = [
                { _id: "1", name: "List 1", userId: mockUserId },
                { _id: "2", name: "List 2", userId: mockUserId },
            ];

            List.find.mockImplementation(() => ({
                sort: jest.fn().mockResolvedValue(mockLists)
            }));

            const response = await request(app).get("/api/lists");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockLists);
            expect(List.find).toHaveBeenCalledWith({ userId: mockUserId });
        });
    });

    describe("POST /api/lists", () => {
        it("should create a new list when valid data is provided", async () => {
            const mockList = { _id: "1", name: "New List", userId: mockUserId };
            List.prototype.save = jest.fn().mockResolvedValue(mockList);

            const response = await request(app)
                .post("/api/lists")
                .send({ name: "New List" });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockList);
            expect(List.prototype.save).toHaveBeenCalled();
        });

        it("should return 400 if name is missing", async () => {
            const response = await request(app).post("/api/lists").send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("List Name is required");
        });

        it("should handle errors and return a 500 status code", async () => {
            List.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

            const response = await request(app).post("/api/lists").send({ name: "New List" });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("There is an error while creating a List");
        });
    });

    describe("PUT /api/lists/:id", () => {
        it("should update an existing list", async () => {
            const mockList = {
                _id: "1",
                name: "Original List",
                userId: mockUserId,
                save: jest.fn().mockResolvedValue({ _id: "1", name: "Updated List", userId: mockUserId })
            };

            List.findOne = jest.fn().mockResolvedValue(mockList);

            const response = await request(app)
                .put("/api/lists/1")
                .send({ name: "Updated List" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ _id: "1", name: "Updated List", userId: mockUserId });
            expect(List.findOne).toHaveBeenCalledWith({ _id: "1", userId: mockUserId });
            expect(mockList.save).toHaveBeenCalled();
        });

        it("should return 404 if the list is not found", async () => {
            List.findOne.mockResolvedValue(null);

            const response = await request(app)
                .put("/api/lists/1")
                .send({ name: "Updated List" });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("List not found");
        });

        it("should return 400 if name is missing", async () => {
            const response = await request(app).put("/api/lists/1").send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("List Name is required");
        });

        it("should handle errors and return a 500 status code", async () => {
            List.findOne.mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .put("/api/lists/1")
                .send({ name: "Updated List" });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("There is an error while updating the List");
        });
    });

    describe("DELETE /api/lists/:id", () => {
        it("should delete an existing list", async () => {
            const mockList = { _id: "1", name: "List to delete", userId: mockUserId };
            List.findOneAndDelete.mockResolvedValue(mockList);

            const response = await request(app).delete("/api/lists/1");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("List deleted");
            expect(List.findOneAndDelete).toHaveBeenCalledWith({ _id: "1", userId: mockUserId });
        });

        it("should return 404 if the list is not found", async () => {
            List.findOneAndDelete.mockResolvedValue(null);

            const response = await request(app).delete("/api/lists/1");

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("List not found");
        });

        it("should handle errors and return a 500 status code", async () => {
            List.findOneAndDelete.mockRejectedValue(new Error("Database error"));

            const response = await request(app).delete("/api/lists/1");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("There is an error while deleting the List");
        });
    });
});
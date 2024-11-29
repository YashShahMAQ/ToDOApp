import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { useNavigate } from "react-router-dom";
import ListsPage from "./ListsPage";
import {
  fetchLists,
  addList,
  deleteList,
  updateList,
} from "../Services/apiService";

jest.mock("../Services/apiService");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("ListsPage Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders the component with header, button, and list items", async () => {
    fetchLists.mockResolvedValue([
      { _id: "1", name: "Test List 1" },
      { _id: "2", name: "Test List 2" },
    ]);

    render(<ListsPage />);

    expect(screen.getByText("My To-Do Lists")).toBeInTheDocument();
    expect(screen.getByText("+ Add New List")).toBeInTheDocument();

    // Wait for the lists to load
    await waitFor(() => {
      expect(screen.getByText("Test List 1")).toBeInTheDocument();
      expect(screen.getByText("Test List 2")).toBeInTheDocument();
    });
  });

  test("displays loading and error states", async () => {
    fetchLists.mockRejectedValue(new Error("Failed to fetch lists"));

    render(<ListsPage />);

    // Initially, the loading message should be shown
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Failed to load lists. Please try again.")).toBeInTheDocument();
    });
  });

  test("opens modal in 'add' mode when Add New List button is clicked", () => {
    render(<ListsPage />);

    const addButton = screen.getByText("+ Add New List");
    fireEvent.click(addButton);

    expect(screen.getByText("Save")).toBeInTheDocument(); // Modal save button
  });

  test("opens modal in 'edit' mode when Edit button is clicked", async () => {
    fetchLists.mockResolvedValue([{ _id: "1", name: "Test List" }]);

    render(<ListsPage />);

    await waitFor(() => {
      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);
    });

    expect(screen.getByDisplayValue("Test List")).toBeInTheDocument(); // Pre-filled input
  });

  test("calls handleNavigateToTask when a list is clicked", async () => {
    fetchLists.mockResolvedValue([{ _id: "1", name: "Test List" }]);

    render(<ListsPage />);

    await waitFor(() => {
      const listName = screen.getByText("Test List");
      fireEvent.click(listName);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/tasks/1", { state: { listName: "Test List" } });
  });

  test("calls handleDeleteList and removes the list from the state", async () => {
    fetchLists.mockResolvedValue([{ _id: "1", name: "Test List" }]);
    deleteList.mockResolvedValue();

    render(<ListsPage />);

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);
    });

    // Confirm the deletion
    window.confirm = jest.fn(() => true);

    await waitFor(() => {
      expect(deleteList).toHaveBeenCalledWith("1");
      expect(screen.queryByText("Test List")).not.toBeInTheDocument();
    });
  });

  test("calls handleModalSubmit to add a new list", async () => {
    addList.mockResolvedValue({ _id: "3", name: "New List" });

    render(<ListsPage />);
    const addButton = screen.getByText("+ Add New List");

    fireEvent.click(addButton); // Open modal

    const input = screen.getByPlaceholderText("Enter list name");
    fireEvent.change(input, { target: { value: "New List" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(addList).toHaveBeenCalledWith("New List");
      expect(screen.getByText("New List")).toBeInTheDocument();
    });
  });

  test("calls handleModalSubmit to edit a list", async () => {
    fetchLists.mockResolvedValue([{ _id: "1", name: "Test List" }]);
    updateList.mockResolvedValue({ _id: "1", name: "Updated List" });

    render(<ListsPage />);

    await waitFor(() => {
      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);
    });

    const input = screen.getByDisplayValue("Test List");
    fireEvent.change(input, { target: { value: "Updated List" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateList).toHaveBeenCalledWith("1", "Updated List");
      expect(screen.getByText("Updated List")).toBeInTheDocument();
    });
  });
});
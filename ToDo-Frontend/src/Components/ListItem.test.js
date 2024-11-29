import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ListItem from "./ListItem"; // Adjust the import path if necessary
import '@testing-library/jest-dom';

describe("ListItem Component", () => {
    const mockOnClick = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const defaultProps = {
        name: "Test List",
        onClick: mockOnClick,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
    };

    beforeEach(() => {
        // Reset mock functions before each test
        jest.clearAllMocks();
    });

    test("renders the component with the correct name", () => {
        render(<ListItem {...defaultProps} />);
        expect(screen.getByText("Test List")).toBeInTheDocument();
    });

    test("calls onClick when the list name is clicked", () => {
        render(<ListItem {...defaultProps} />);
        const listName = screen.getByText("Test List");
        fireEvent.click(listName);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test("calls onEdit when the Edit button is clicked", () => {
        render(<ListItem {...defaultProps} />);
        const editButton = screen.getByText("Edit");
        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    test("calls onDelete when the Delete button is clicked", () => {
        render(<ListItem {...defaultProps} />);
        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
});
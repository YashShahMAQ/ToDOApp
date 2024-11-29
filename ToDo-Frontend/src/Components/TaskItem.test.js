import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "./TaskItem";
import '@testing-library/jest-dom';

describe("TaskItem Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleCompleted = jest.fn();

  const defaultProps = {
    task: {
      _id: "1",
      description: "Test Task",
      isCompleted: false,
    },
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onToggleCompleted: mockOnToggleCompleted,
  };

  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();
  });

  test("renders the component with the correct task description", () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("renders the checkbox with the correct state", () => {
    const { rerender } = render(<TaskItem {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");

    // Initially, the checkbox should not be checked
    expect(checkbox).not.toBeChecked();

    // Rerender the component with isCompleted=true
    rerender(
      <TaskItem
        {...defaultProps}
        task={{ ...defaultProps.task, isCompleted: true }}
      />
    );
    expect(checkbox).toBeChecked();
  });

  test("calls onToggleCompleted when the checkbox is toggled", () => {
    render(<TaskItem {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(mockOnToggleCompleted).toHaveBeenCalledTimes(1);
    expect(mockOnToggleCompleted).toHaveBeenCalledWith(defaultProps.task);
  });

  test("calls onEdit when the Edit button is clicked", () => {
    render(<TaskItem {...defaultProps} />);
    const editButton = screen.getByText("Edit");

    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  test("calls onDelete when the Delete button is clicked", () => {
    render(<TaskItem {...defaultProps} />);
    const deleteButton = screen.getByText("Delete");

    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
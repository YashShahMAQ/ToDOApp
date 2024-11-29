import React from "react";

const TaskItem = ({ task, onEdit, onDelete, onToggleCompleted }) => {
    return (
        <div className="task-item">
            <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => onToggleCompleted(task)}
            />
            <span>
                {task.description}
            </span>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
        </div>
    );
};

export default TaskItem;
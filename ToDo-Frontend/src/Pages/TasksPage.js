import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TaskItem from "../Components/TaskItem";
import AddEditTaskModal from "../Components/AddEditTaskModal";
import { fetchTasks, addTask, updateTask, deleteTask } from "../Services/apiService";

import "../Styles/TasksPage.css";


const TasksPage = () => {
    const { listId } = useParams();
    console.log("listId from useParams:", listId); // Debugging log
    const location = useLocation();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const listName = location.state?.listName || "Tasks";

    useEffect(() => {
        loadTasks();
    }, [listId]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            console.log("Fetching tasks for listId:", listId); // Debugging log
            const tasks = await fetchTasks(listId);
            setTasks(tasks);
            setLoading(false);
        } catch (err) {
            setError("Failed to load tasks. Please try again.");
            setLoading(false);
        }
    };

    const handleAddTask = () => {
        setModalType("add");
        setCurrentTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setModalType("edit");
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleToggleCompleted = async (task) => {
        try {
            const updatedTask = await updateTask(task._id, {
                description: task.description,
                isCompleted: !task.isCompleted
            });

            setTasks((prev) => prev.map((t) => t._id === task._id ? updatedTask : t));
        } catch (err) {
            console.error(err);
            setError("Failed to update task. Please try again.");
        }
    }

    const handleDeleteTask = async (taskId) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this task?");
            if (!confirmed)
                return;

            await deleteTask(taskId);
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
        } catch (err) {
            console.error(err);
            setError("Failed to delete task. Please try again.");
        }
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const description = formData.get("description");

        try {
            if (modalType === "add") {
                console.log("Adding task for listId:", listId); // Debugging log
                console.log("listId:", listId, "description:", description);
                const newTask = await addTask({ listId, description });

                console.log("New Task Created:", newTask); // Debugging log
                setTasks((prev) => [...prev, newTask]);
            }
            else if (modalType === "edit" && currentTask) {
                const updatedTask = await updateTask(currentTask._id, { description, isCompleted: currentTask.isCompleted });
                console.log("Task Updated:", updatedTask); // Debugging log
                setTasks((prev) => prev.map((task) => task._id === currentTask._id ? updatedTask : task));
            }

            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            setError("Failed to save task. Please try again.");
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    const renderTasks = () => {
        if (loading)
            return <p>Loading tasks...</p>;

        if (error)
            return <p className="error">{error}</p>;

        if (tasks.length === 0)
            return <p>No tasks found. Create one to get started!</p>;

        return tasks.map((task) => (
            <TaskItem
                key={task._id}
                task={task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task._id)}
                onToggleCompleted={handleToggleCompleted}
            />
        ));
    };

    return (
        <div className="tasks-page">
            <header>
                <button onClick={() => navigate(-1)}>Back To Lists</button>
                <h1>{listName}</h1>
            </header>
            <button className="add-task-button" onClick={handleAddTask}>
                + Add New Task
            </button>
            <div className="tasks-list">
                {renderTasks()}
            </div>
            <AddEditTaskModal
                isOpen={isModalOpen}
                onSubmit={handleModalSubmit}
                onClose={handleModalClose}
                initialValue={modalType === "edit" ? currentTask?.description : ""}
            />
        </div>
    );
}

export default TasksPage;
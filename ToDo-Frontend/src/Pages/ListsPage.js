import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import ListItem from "../Components/ListItem";
import AddEditModal from "../Components/AddEditModal";
import { fetchLists, addList, deleteList, updateList } from "../Services/apiService";
import "../Styles/ListsPage.css";

const ListsPage = () => {
    // State for lists and modal control
    const [lists, setLists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // "add" or "edit"
    const [currentList, setCurrentList] = useState(null); // List being edited
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    // Fetch lists on initial render
    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            setLoading(true);
            const lists = await fetchLists();
            setLists(lists);
            setLoading(false);
        } catch (err) {
            setError("Failed to load lists. Please try again.");
            setLoading(false);
        }
    };

    const handleNavigateToTask  = (list) => {
        navigate(`/tasks/${list._id}`, { state: { listName: list.name } });
    }

    // Handle opening the modal for adding a new list
    const handleAddList = () => {
        setModalType("add");
        setCurrentList(null);
        setIsModalOpen(true);
    };

    // Handle opening the modal for editing a list
    const handleEditList = (list) => {
        setModalType("edit");
        setCurrentList(list);
        setIsModalOpen(true);
    };

    // Handle deleting a list
    const handleDeleteList = async (id) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this list?");
            if (!confirmed)
                return;
            await deleteList(id);
            setLists((prevLists) => prevLists.filter((list) => list._id !== id));
        } catch (err) {
            console.error(err);
            setError("Failed to delete list. Please try again.");
        }
    };

    // Handle modal submission for adding or editing a list
    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const listName = formData.get("listName");

        try {
            if (modalType === "add") {
                // Add a new list
                const newList = await addList(listName);
                setLists((prevLists) => [...prevLists, newList]);
            }

            else if (modalType === "edit" && currentList) {
                // Edit an existing list
                const updatedList = await updateList(currentList._id, listName);
                setLists((prevLists) =>
                    prevLists.map((list) =>
                        list._id === currentList._id ? updatedList : list
                    ));
            }
            setIsModalOpen(false); // Close the modal
        } catch (err) {
            console.error(err);
            setError("Failed to save list. Please try again.");
        }
    };

    // Handle closing the modal
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="lists-page">
            <Header />
            <div className="lists-container">
                <h2>My To-Do Lists</h2>
                <button
                    className="add-list-button"
                    onClick={handleAddList}>
                    + Add New List
                </button>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <div className="lists">
                        {lists.map((list) => (
                            <ListItem
                                key={list._id}
                                name={list.name}
                                onEdit={() => handleEditList(list)}
                                onDelete={() => handleDeleteList(list._id)}
                                onClick={() => handleNavigateToTask(list)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <AddEditModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialValue={modalType === "edit" ? currentList?.name : ""}
            />
        </div>
    );
};

export default ListsPage;
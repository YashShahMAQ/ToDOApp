import React from "react";

const AddEditTaskModal = ({isOpen, onClose, onSubmit, initialValue}) => {
    if(!isOpen) {
        return null;
    }

    return(
        <div className="modal">
            <div className="modal-content">
                <h2>{initialValue ? "Edit Task" : "Add New Task"}</h2>
                <form onSubmit={onSubmit}>
                    <label>
                        Task Description:
                        <input
                            type="text"
                            defaultValue={initialValue}
                            name="description"
                            required
                        />
                    </label>
                    <div className="modal-actions">
                        <button type="submit">
                            Save
                        </button>
                        <button onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditTaskModal;
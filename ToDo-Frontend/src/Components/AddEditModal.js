import React  from "react";

import "../Styles/AddEditModal.css";

const AddEditModal = ({isOpen, onClose, onSubmit, initialValue}) => {
    if(!isOpen) {
        return null;
    }

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialValue ? "Edit List" : "Add New List"}</h2>
                <form onSubmit={onSubmit}>
                    <label>
                        List Name:
                        <input
                            type="text"
                            defaultValue={initialValue}
                            name="listName"
                            required
                        />
                    </label>
                    <div className="modal-actions">
                        <button type="submit" className="submit-button">
                            {initialValue ? "Save Changes" : "Add List"}
                        </button>
                        <button className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditModal;
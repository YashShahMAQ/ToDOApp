import React  from "react";

import "../Styles/ListItem.css";

const ListItem = ({name, onEdit, onDelete, onClick}) => {
    return(
        <div className="list-item">
            <span 
                className="list-name"
                onClick={onClick}
                style={{cursor: "pointer", color: "blue", textDecoration: "underline"}}
            >
                {name}
            </span>
            <div className="list-actions">
                <button className="edit-button" onClick={onEdit}>
                    Edit
                </button>
                <button className="delete-button" onClick={onDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ListItem;
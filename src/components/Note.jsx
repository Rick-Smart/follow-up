import React from "react";
import PropTypes from "prop-types";

const Note = ({ note, onEdit, onDelete, isLoading }) => {
  return (
    <div className="bg-white p-4 border rounded-lg shadow hover:shadow-md transition-shadow">
      {/* Title */}
      <h3 className="font-bold mb-2 text-lg text-gray-800">{note.title}</h3>

      {/* Content Preview */}
      <div
        className="text-gray-600 max-h-32 overflow-hidden mb-4 prose prose-sm"
        dangerouslySetInnerHTML={{ __html: note.body }}
      />

      {/* Actions */}
      <div className="flex justify-between items-center border-t pt-4">
        <button
          onClick={() => onEdit(note)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50"
          disabled={isLoading}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-4 pt-2 text-xs text-gray-400 border-t">
        {note.createdAt && (
          <div className="flex justify-between items-center">
            <span>Created:</span>
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        )}
        {note.updatedAt && note.updatedAt !== note.createdAt && (
          <div className="flex justify-between items-center mt-1">
            <span>Updated:</span>
            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

Note.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Note;

import React from "react";
import PropTypes from "prop-types";
import { MessageCircle, Users, Edit } from "lucide-react";

const Ticket = ({
  ticket,
  onEdit,
  onDelete,
  onClose,
  onEscalate,
  onAssign,
  onAddComment,
  isLoading = false,
  canAssignTickets = false,
}) => {
  // Helper function to determine status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "high":
        return "bg-red-100 text-red-800";
      case "open":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Helper function to get escalation level border color
  const getEscalationColor = (level) => {
    switch (level) {
      case 1:
        return "border-green-300";
      case 2:
        return "border-yellow-300";
      case 3:
        return "border-orange-400";
      case 4:
        return "border-red-400";
      case 5:
        return "border-red-600";
      default:
        return "border-gray-200";
    }
  };

  // Helper function to get escalation level text color
  const getEscalationTextColor = (level) => {
    switch (level) {
      case 1:
        return "text-green-700";
      case 2:
        return "text-yellow-700";
      case 3:
        return "text-orange-700";
      case 4:
        return "text-red-700";
      case 5:
        return "text-red-800";
      default:
        return "text-gray-700";
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return timestamp.toDate
        ? timestamp.toDate().toLocaleString()
        : new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div
      className={`relative bg-white p-4 rounded-lg shadow hover:shadow-md transition-all border-2 ${getEscalationColor(
        ticket.escalationLevel
      )}`}
    >
      {/* Escalation Level Indicator */}
      <div className="absolute -top-3 -right-3 bg-white rounded-full shadow-md p-2">
        <span
          className={`font-bold ${getEscalationTextColor(
            ticket.escalationLevel
          )}`}
        >
          Level {ticket.escalationLevel || 1}
        </span>
      </div>

      {/* Ticket Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            #{ticket.incNumber}
          </h3>
          <p className="text-sm text-gray-500">MSISDN: {ticket.msisdn}</p>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            ticket.status
          )}`}
        >
          {ticket.status || "Open"}
        </div>
      </div>

      {/* Ticket Details */}
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Submitted by:</span>{" "}
          {ticket.submittedBy}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Description:</span> {ticket.description}
        </p>

        {ticket.createdAt && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Created:</span>{" "}
            {formatTimestamp(ticket.createdAt)}
          </p>
        )}

        {ticket.priority && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Priority:</span> {ticket.priority}
          </p>
        )}

        {/* Assigned To Information */}
        {ticket.assignedTo && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Assigned to:</span>{" "}
            {ticket.assignedTo.email || "Unknown User"}
          </p>
        )}
      </div>

      {/* Comments Section */}
      {ticket.comments && ticket.comments.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Comments ({ticket.comments.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {ticket.comments.slice(-3).map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded text-sm">
                <p>{comment.text}</p>
                <p className="text-xs text-gray-500">
                  - {comment.createdBy.email} on{" "}
                  {formatTimestamp(comment.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="space-x-2 flex items-center">
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 flex items-center"
          >
            <Edit size={16} className="mr-1" /> Edit
          </button>
          <button
            onClick={() => onEscalate(ticket.id)}
            disabled={
              isLoading ||
              ticket.status === "closed" ||
              ticket.escalationLevel === 5
            }
            className="px-3 py-1 text-sm bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 disabled:opacity-50"
          >
            Escalate
          </button>
          <button
            onClick={onAddComment}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 disabled:opacity-50 flex items-center"
          >
            <MessageCircle size={16} className="mr-1" /> Comment
          </button>
        </div>
        <div className="space-x-2 flex items-center">
          <button
            onClick={onAssign}
            disabled={
              isLoading || ticket.status === "closed" || !canAssignTickets
            }
            className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 disabled:opacity-50 flex items-center"
          >
            <Users size={16} className="mr-1" /> Assign
          </button>
          <button
            onClick={() => onClose(ticket.id)}
            disabled={isLoading || ticket.status === "closed"}
            className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Close
          </button>
          <button
            onClick={() => onDelete(ticket.id)}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    incNumber: PropTypes.string.isRequired,
    msisdn: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    submittedBy: PropTypes.string.isRequired,
    status: PropTypes.string,
    priority: PropTypes.string,
    escalationLevel: PropTypes.number,
    createdAt: PropTypes.object, // Firestore Timestamp
    assignedTo: PropTypes.shape({
      uid: PropTypes.string,
      email: PropTypes.string,
      assignedAt: PropTypes.object,
    }),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.object.isRequired,
        createdBy: PropTypes.shape({
          email: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEscalate: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  canAssignTickets: PropTypes.bool,
};

Ticket.defaultProps = {
  isLoading: false,
  canAssignTickets: false,
};

export default Ticket;

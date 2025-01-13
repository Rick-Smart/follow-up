import React, { useState, useEffect, useCallback } from "react";
import { Header } from "../components";
import Ticket from "../components/Ticket";
import {
  createTicket,
  getAllTickets,
  escalateTicket,
  closeTicket,
  deleteTicket,
  assignTicket,
  addTicketComment,
  editTicket,
} from "../utils/ticketsController";
import { sanitizeInputs, validateTicket } from "../utils/validationUtils";
import { useUserContext } from "../contexts/UserContext";
import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../firebase";
import { USER_ROLES } from "../utils/userController";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("incNumber");
  const [newTicket, setNewTicket] = useState({
    incNumber: "",
    msisdn: "",
    submittedBy: "",
    description: "",
    priority: "normal",
  });
  const [users, setUsers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const { currentUser } = useUserContext();

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const usersRef = collection(fireStore, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    }
  }, []);

  // Load tickets with optional filters
  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters = {
        ...(filterStatus && { status: filterStatus }),
        ...(filterPriority && { priority: filterPriority }),
      };
      const fetchedTickets = await getAllTickets(filters);
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);
    } catch (err) {
      setError("Failed to load tickets.");
      console.error("Error loading tickets:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterPriority]);

  // Initial load and user fetch
  useEffect(() => {
    loadTickets();
    fetchUsers();
  }, [loadTickets, fetchUsers]);

  // Search and filter functionality
  useEffect(() => {
    const filterTickets = () => {
      if (!searchTerm) {
        setFilteredTickets(tickets);
        return;
      }
      const filtered = tickets.filter((ticket) => {
        const searchValue = String(ticket[searchField] || "").toLowerCase();
        return searchValue.includes(searchTerm.toLowerCase());
      });
      setFilteredTickets(filtered);
    };

    filterTickets();
  }, [searchTerm, searchField, tickets]);

  // Ticket creation handler
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError(null);

    // Sanitize inputs
    const sanitizedTicket = sanitizeInputs({
      incNumber: newTicket.incNumber,
      msisdn: newTicket.msisdn,
      submittedBy: newTicket.submittedBy,
      description: newTicket.description,
      priority: newTicket.priority,
    });

    // Validate inputs
    const validationResult = validateTicket(sanitizedTicket);

    if (!validationResult.isValid) {
      // Set specific error messages
      const errorMessages = Object.values(validationResult.errors).join(". ");
      setError(errorMessages);
      return;
    }

    try {
      setIsLoading(true);
      await createTicket(validationResult.data);
      await loadTickets();
      setShowNewTicketForm(false);
      setNewTicket({
        incNumber: "",
        msisdn: "",
        submittedBy: "",
        description: "",
        priority: "normal",
      });
    } catch (err) {
      setError("Failed to create ticket.");
      console.error("Error creating ticket:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit ticket handler
  const handleEdit = async (e) => {
    e.preventDefault();
    setError(null);

    // Sanitize inputs
    const sanitizedTicket = sanitizeInputs({
      incNumber: editingTicket.incNumber,
      msisdn: editingTicket.msisdn,
      submittedBy: editingTicket.submittedBy,
      description: editingTicket.description,
      priority: editingTicket.priority,
    });

    // Validate inputs
    const validationResult = validateTicket(sanitizedTicket);

    if (!validationResult.isValid) {
      // Set specific error messages
      const errorMessages = Object.values(validationResult.errors).join(". ");
      setError(errorMessages);
      return;
    }

    try {
      setIsLoading(true);

      // Prepare update data
      const updateData = {
        ...validationResult.data,
      };

      await editTicket(editingTicket.id, updateData);
      await loadTickets();

      // Reset edit state
      setShowEditModal(false);
      setEditingTicket(null);
    } catch (err) {
      setError("Failed to edit ticket.");
      console.error("Error editing ticket:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ticket assignment handler
  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedUser) {
      setError("Please select a ticket and a user to assign");
      return;
    }

    try {
      setIsLoading(true);
      await assignTicket(selectedTicket.id, selectedUser);
      await loadTickets();
      setShowAssignModal(false);
      setSelectedTicket(null);
      setSelectedUser("");
    } catch (err) {
      setError("Failed to assign ticket.");
      console.error("Error assigning ticket:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!selectedTicket || !commentText.trim()) {
      setError("Please enter a comment");
      return;
    }

    try {
      setIsLoading(true);
      await addTicketComment(selectedTicket.id, commentText);
      await loadTickets();
      setShowCommentModal(false);
      setSelectedTicket(null);
      setCommentText("");
    } catch (err) {
      setError("Failed to add comment.");
      console.error("Error adding comment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Other ticket action handlers
  const handleDelete = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        setIsLoading(true);
        await deleteTicket(ticketId);
        await loadTickets();
      } catch (err) {
        setError("Failed to delete ticket.");
        console.error("Error deleting ticket:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = async (ticketId) => {
    try {
      setIsLoading(true);
      await closeTicket(ticketId);
      await loadTickets();
    } catch (err) {
      setError("Failed to close ticket.");
      console.error("Error closing ticket:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async (ticketId) => {
    try {
      setIsLoading(true);
      await escalateTicket(ticketId);
      await loadTickets();
    } catch (err) {
      setError("Failed to escalate ticket.");
      console.error("Error escalating ticket:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if user can assign tickets (POD or higher)
  const canAssignTickets = () => {
    const assignRoles = [
      USER_ROLES.ADMIN,
      USER_ROLES.DIRECTOR,
      USER_ROLES.SR_OPERATIONS_MANAGER,
      USER_ROLES.OPERATIONS_MANAGER,
      USER_ROLES.COACH,
    ];
    return currentUser && assignRoles.includes(currentUser.role);
  };

  // Open edit modal
  const openEditModal = (ticket) => {
    setEditingTicket({
      ...ticket,
      id: ticket.id, // Ensure ID is preserved
    });
    setShowEditModal(true);
  };

  // Render assignment modal
  const renderAssignModal = () => {
    if (!showAssignModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Assign Ticket</h2>
          <p className="mb-4">
            Assign Ticket #{selectedTicket.incNumber} to a user
          </p>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email} ({user.role})
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignTicket}
              disabled={!selectedUser}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render comment modal
  const renderCommentModal = () => {
    if (!showCommentModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Add Comment</h2>
          <p className="mb-4">
            Add a comment to Ticket #{selectedTicket.incNumber}
          </p>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows="4"
            placeholder="Enter your comment..."
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowCommentModal(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render edit modal
  const renderEditModal = () => {
    if (!showEditModal || !editingTicket) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Edit Ticket</h2>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                INC Number
              </label>
              <input
                type="text"
                value={editingTicket.incNumber}
                onChange={(e) =>
                  setEditingTicket({
                    ...editingTicket,
                    incNumber: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                MSISDN
              </label>
              <input
                type="text"
                value={editingTicket.msisdn}
                onChange={(e) =>
                  setEditingTicket({
                    ...editingTicket,
                    msisdn: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Submitted By
              </label>
              <input
                type="text"
                value={editingTicket.submittedBy}
                onChange={(e) =>
                  setEditingTicket({
                    ...editingTicket,
                    submittedBy: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={editingTicket.priority}
                onChange={(e) =>
                  setEditingTicket({
                    ...editingTicket,
                    priority: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={editingTicket.description}
                onChange={(e) =>
                  setEditingTicket({
                    ...editingTicket,
                    description: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows="4"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTicket(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={isLoading}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Pages" title="Tickets" />

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="incNumber">INC Number</option>
          <option value="msisdn">MSISDN</option>
          <option value="submittedBy">Submitted By</option>
          <option value="description">Description</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${searchField}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-1"
        />

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="deleted">Deleted</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Create New Ticket Button */}
      <button
        onClick={() => setShowNewTicketForm(!showNewTicketForm)}
        className="mb-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {showNewTicketForm ? "Cancel" : "Create New Ticket"}
      </button>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <form
          onSubmit={handleCreateTicket}
          className="mb-8 bg-gray-50 p-6 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="INC Number"
              value={newTicket.incNumber}
              onChange={(e) =>
                setNewTicket({ ...newTicket, incNumber: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="MSISDN"
              value={newTicket.msisdn}
              onChange={(e) =>
                setNewTicket({ ...newTicket, msisdn: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Submitted By"
              value={newTicket.submittedBy}
              onChange={(e) =>
                setNewTicket({ ...newTicket, submittedBy: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <select
              value={newTicket.priority}
              onChange={(e) =>
                setNewTicket({ ...newTicket, priority: e.target.value })
              }
              className="p-2 border rounded"
            >
              <option value="low">Low Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
            </select>
            <textarea
              placeholder="Description"
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
              className="p-2 border rounded md:col-span-2"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Create Ticket
          </button>
        </form>
      )}

      {/* Ticket List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.map((ticket) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            onEdit={() => openEditModal(ticket)}
            onDelete={() => handleDelete(ticket.id)}
            onClose={() => handleClose(ticket.id)}
            onEscalate={() => handleEscalate(ticket.id)}
            onAssign={() => {
              if (canAssignTickets()) {
                setSelectedTicket(ticket);
                setShowAssignModal(true);
              }
            }}
            onAddComment={() => {
              setSelectedTicket(ticket);
              setShowCommentModal(true);
            }}
            isLoading={isLoading}
            canAssignTickets={canAssignTickets()}
          />
        ))}
      </div>

      {/* Modals */}
      {renderAssignModal()}
      {renderCommentModal()}
      {renderEditModal()}
    </div>
  );
};

export default Tickets;

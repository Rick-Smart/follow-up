import React, { useState, useEffect, useCallback } from "react";
import { Header } from "../components";
import Ticket from "../components/Ticket"; // Updated to use new Ticket component
import {
  createTicket,
  getAllTickets,
  escalateTicket,
  closeTicket,
  deleteTicket,
} from "../utils/ticketsController";
import Joi from "joi";
import DOMPurify from "dompurify";

// Validation schema for tickets
const ticketSchema = Joi.object({
  incNumber: Joi.number().required().min(10).label("INC Number"),
  msisdn: Joi.number().required().min(10).label("MSISDN"),
  submittedBy: Joi.string().required().label("Submitted By"),
  description: Joi.string().required().label("Description"),
});

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
  });

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTickets = await getAllTickets();
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);
    } catch (err) {
      setError("Failed to load tickets.");
      console.error("Error loading tickets:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

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

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError(null);

    // Sanitize inputs
    const sanitizedTicket = {
      incNumber: DOMPurify.sanitize(newTicket.incNumber),
      msisdn: DOMPurify.sanitize(newTicket.msisdn),
      submittedBy: DOMPurify.sanitize(newTicket.submittedBy),
      description: DOMPurify.sanitize(newTicket.description),
    };

    // Validate inputs
    const { error: validationError } = ticketSchema.validate(sanitizedTicket);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    try {
      setIsLoading(true);
      await createTicket(sanitizedTicket);
      await loadTickets();
      setShowNewTicketForm(false);
      setNewTicket({
        incNumber: "",
        msisdn: "",
        submittedBy: "",
        description: "",
      });
    } catch (err) {
      setError("Failed to create ticket.");
      console.error("Error creating ticket:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (ticket) => {
    // Will implement edit functionality
    console.log("Edit ticket:", ticket);
  };

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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Pages" title="Tickets" />

      {/* Search Section */}
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
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowNewTicketForm(!showNewTicketForm)}
        className="mb-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {showNewTicketForm ? "Cancel" : "Create New Ticket"}
      </button>

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

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => (
            <Ticket
              key={ticket.id}
              ticket={ticket}
              onEdit={() => handleEdit(ticket)}
              onDelete={() => handleDelete(ticket.id)}
              onClose={() => handleClose(ticket.id)}
              onEscalate={() => handleEscalate(ticket.id)}
              isLoading={isLoading}
            />
          ))}
          {filteredTickets.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No tickets found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tickets;

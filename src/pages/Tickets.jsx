import React, { useState, useEffect } from "react";
import { Header } from "../components";
import TicketsCard from "../components/TicketsCard";
import {
  createTicket,
  getTickets,
  escalateTicket,
  closeTicket,
} from "../utils/ticketsController";
import Joi from "joi";
import DOMPurify from "dompurify";

// Helper function to calculate remaining time
const getTimeRemaining = (dueDate) => {
  const total = Date.parse(dueDate) - Date.parse(new Date());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  return { total, days, hours, minutes };
};

// Validation schema for tickets
const ticketSchema = Joi.object({
  complaint: Joi.number().required().min(10).label("INC Number"),
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
  const [closeNote, setCloseNote] = useState("");
  const [ticketToClose, setTicketToClose] = useState(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("ticketNumber");
  const [escalationNote, setEscalationNote] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    complaint: "",
    incNumber: "",
    msisdn: "",
    submittedBy: "",
    description: "",
  });

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTickets = await getTickets();
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      loadTickets();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const filterTickets = () => {
      if (!searchTerm) {
        if (isMounted) setFilteredTickets(tickets);
        return;
      }
      const filtered = tickets.filter((ticket) => {
        const searchValue = String(ticket[searchField] || "").toLowerCase();
        return searchValue.includes(searchTerm.toLowerCase());
      });
      if (isMounted) setFilteredTickets(filtered);
    };

    filterTickets();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, searchField, tickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError(null);

    // Sanitize inputs
    const sanitizedTicket = {
      complaint: DOMPurify.sanitize(newTicket.complaint),
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
        complaint: "",
        incNumber: "",
        msisdn: "",
        submittedBy: "",
        description: "",
      });
    } catch (err) {
      setError("Failed to create ticket.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    if (!closeNote) {
      setError("Please add a closing note.");
      return;
    }
    try {
      await closeTicket(ticketId, closeNote);
      setCloseNote("");
      setTicketToClose(null);
      await loadTickets();
    } catch (err) {
      setError("Failed to close ticket.");
    }
  };

  const handleEscalate = async (ticketId) => {
    if (!escalationNote) {
      setError("Please add a note before escalating.");
      return;
    }
    try {
      await escalateTicket(ticketId, escalationNote);
      setEscalationNote("");
      setSelectedTicket(null);
      await loadTickets();
    } catch (err) {
      setError("Failed to escalate ticket.");
    }
  };

  const handleToggleExpand = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
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
          <option value="ticketNumber">Ticket Number</option>
          <option value="complaintNumber">Complaint Number</option>
          <option value="incNumber">INC Number</option>
          <option value="msisdn">MSISDN</option>
          <option value="submittedBy">Submitted By</option>
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
              id="complaint"
              type="text"
              placeholder="Complaint Number"
              value={newTicket.complaint}
              onChange={(e) =>
                setNewTicket({ ...newTicket, complaint: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              id="inc_number"
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
              id="msisdn"
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
              id="submitted_by"
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
              id="description"
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
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Ticket
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-600">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => {
            const timeRemaining = getTimeRemaining(ticket.dueDate);
            const ticketData = {
              title: `Ticket: ${ticket.ticketNumber}`,
              description: ticket.description,
              escalationLevel: `Level ${ticket.escalationLevel}`,
              details: {
                complaint: ticket.complaint,
                incNumber: ticket.incNumber,
                msisdn: ticket.msisdn,
                submittedBy: ticket.submittedBy,
                state: ticket.state,
                createdAt: new Date(ticket.createdAt).toLocaleString(),
                closedAt: ticket.closedAt
                  ? new Date(ticket.closedAt).toLocaleString()
                  : null,
                timeRemaining: `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m`,
                notes: ticket.notes || [],
              },
            };

            return (
              <TicketsCard
                key={ticket.id}
                ticket={ticketData}
                onClose={() => setTicketToClose(ticket.id)}
                onEscalate={() => setSelectedTicket(ticket.id)}
                isClosing={ticketToClose === ticket.id}
                isEscalating={selectedTicket === ticket.id}
                closeNote={closeNote}
                onCloseNoteChange={setCloseNote}
                onConfirmClose={() => handleCloseTicket(ticket.id)}
                escalationNote={escalationNote}
                onEscalationNoteChange={setEscalationNote}
                onConfirmEscalate={() => handleEscalate(ticket.id)}
                isExpanded={expandedTicket === ticket.id}
                onToggleExpand={() => handleToggleExpand(ticket.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tickets;

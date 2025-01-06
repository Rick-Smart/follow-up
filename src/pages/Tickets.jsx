import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { createTicket, getTickets, escalateTicket, addNoteToTicket, closeTicket } from "../utils/ticketsController";

// Helper function to calculate remaining time
const getTimeRemaining = (dueDate) => {
  const total = Date.parse(dueDate) - Date.parse(new Date());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  return { total, days, hours, minutes };
};

// Helper function to get color based on escalation level
const getEscalationColor = (level) => {
  const colors = {
    1: "bg-green-100 border-green-500",
    2: "bg-blue-100 border-blue-500",
    3: "bg-yellow-100 border-yellow-500",
    4: "bg-orange-100 border-orange-500",
    5: "bg-red-100 border-red-500"
  };
  return colors[level] || colors[1];
};

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
  const [newTicket, setNewTicket] = useState({
    Complaint : "",
    INCNumber : "",
    MSISDN: "",
    Submitted: "",
    Description: ""
  });

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTickets = await getTickets();
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);
    } catch (err) {
      setError("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const timer = setInterval(fetchTickets, 60000); // Refresh every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const filterTickets = () => {
      if (!searchTerm) {
        setFilteredTickets(tickets);
        return;
      }

      const filtered = tickets.filter(ticket => {
        const searchValue = String(ticket[searchField] || '').toLowerCase();
        return searchValue.includes(searchTerm.toLowerCase());
      });

      setFilteredTickets(filtered);
    };

    filterTickets();
  }, [searchTerm, searchField, tickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createTicket(newTicket);
      await fetchTickets();
      setShowNewTicketForm(false);
      setNewTicket({
        incNumber: "",
        msisdn: "",
        submittedBy: "",
        description: ""
      });
    } catch (err) {
      setError("Failed to create ticket");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    if (!closeNote) {
      setError("Please add a closing note");
      return;
    }
  
    try {
      await closeTicket(ticketId, closeNote);
      setCloseNote("");
      setTicketToClose(null);
      await fetchTickets();
    } catch (err) {
      setError("Failed to close ticket");
    }
  };

  const handleEscalate = async (ticketId) => {
    if (!escalationNote) {
      setError("Please add a note before escalating");
      return;
    }

    try {
      await escalateTicket(ticketId, escalationNote);
      setEscalationNote("");
      setSelectedTicket(null);
      await fetchTickets();
    } catch (err) {
      setError("Failed to escalate ticket");
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
          <option value="ticketNumber">Ticket Number</option>
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
        <form onSubmit={handleCreateTicket} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="INC Number"
              value={newTicket.incNumber}
              onChange={(e) => setNewTicket({...newTicket, incNumber: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="MSISDN"
              value={newTicket.msisdn}
              onChange={(e) => setNewTicket({...newTicket, msisdn: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Submitted By"
              value={newTicket.submittedBy}
              onChange={(e) => setNewTicket({...newTicket, submittedBy: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={newTicket.description}
              onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTickets.map((ticket) => {
            const timeRemaining = getTimeRemaining(ticket.dueDate);
            const escalationColor = getEscalationColor(ticket.escalationLevel);
            
            return (
              <div
                key={ticket.id}
                className={`border-2 rounded-lg p-4 ${escalationColor}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">Ticket: {ticket.ticketNumber}</h3>
                    <p>INC: {ticket.incNumber}</p>
                    <p>MSISDN: {ticket.msisdn}</p>
                    <p>Submitted By: {ticket.submittedBy}</p>
                    <p>Description: {ticket.description}</p>
                  </div>
                  <div className="text-right">
  <p className="font-bold">Level {ticket.escalationLevel}</p>
  <p className={`${
    ticket.state === "Closed" 
      ? "bg-gray-500 text-white px-2 py-1 rounded-full text-sm" 
      : ""
  }`}>
    State: {ticket.state}
  </p>
  {ticket.closedAt && (
    <p className="text-xs text-gray-500">
      Closed: {new Date(ticket.closedAt).toLocaleString()}
    </p>
  )}
</div>
                </div>

                <div className="mt-4 p-2 bg-white bg-opacity-50 rounded">
                  <p className="font-semibold">Time Remaining:</p>
                  <p>{timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m</p>
                  <p className="text-sm text-gray-600">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>

                {/* Notes Section */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {ticket.notes?.map((note) => (
                      <div key={note.id} className="mb-2 p-2 bg-white bg-opacity-75 rounded">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-gray-500">
                          Level {note.escalationLevel} - {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ------------------------------------------------------------------------------------------------- */}
                {ticket.state !== "Closed" && (
  <>
    {ticketToClose === ticket.id ? (
      <div className="mt-4 border-t pt-4">
        <textarea
          value={closeNote}
          onChange={(e) => setCloseNote(e.target.value)}
          placeholder="Add closing note..."
          className="w-full p-2 border rounded mb-2"
          rows="2"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setTicketToClose(null);
              setCloseNote("");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => handleCloseTicket(ticket.id)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm Close
          </button>
        </div>
      </div>
    ) : (
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setTicketToClose(ticket.id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Close Ticket
        </button>
        {/* Keep existing Escalate button here */}
      </div>
    )}
  </>
)}
                {/* ------------------------------------------------------------------------------------------------- */}

                

                {/* Escalation Section */}
                {selectedTicket === ticket.id ? (
                  <div className="mt-4">
                    <textarea
                      value={escalationNote}
                      onChange={(e) => setEscalationNote(e.target.value)}
                      placeholder="Add escalation note..."
                      className="w-full p-2 border rounded mb-2"
                      rows="2"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedTicket(null);
                          setEscalationNote("");
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEscalate(ticket.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        disabled={ticket.escalationLevel >= 5}
                      >
                        Confirm Escalation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setSelectedTicket(ticket.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      disabled={ticket.escalationLevel >= 5}
                    >
                      Escalate
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tickets;
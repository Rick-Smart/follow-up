import React, { useState } from "react";

const escalationColors = {
  1: "border-green-500",
  2: "border-blue-500",
  3: "border-yellow-500",
  4: "border-orange-500",
  5: "border-red-500",
};

const TicketsCard = ({
  ticket,
  onClose,
  onEscalate,
  isClosing,
  isEscalating,
  closeNote,
  onCloseNoteChange,
  onConfirmClose,
  escalationNote,
  onEscalationNoteChange,
  onConfirmEscalate,
  isExpanded,
  onToggleExpand,
}) => {
  const { title, description, escalationLevel, details } = ticket;
  const level = parseInt(escalationLevel.replace("Level ", ""));
  const borderColor = escalationColors[level] || "border-gray-300";

  return (
    <div
      className={`w-full p-4 mb-4 rounded-lg shadow-sm border-2 ${borderColor} bg-white transition-all duration-300`}
      onClick={!isExpanded ? onToggleExpand : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="mt-2 space-y-1 text-gray-600">
            <p>
              <span className="font-medium">Complaint:</span>{" "}
              {details.complaint}
            </p>
            <p>
              <span className="font-medium">INC Number:</span>{" "}
              {details.incNumber}
            </p>
            <p>
              <span className="font-medium">MSISDN:</span> {details.msisdn}
            </p>
            <p>
              <span className="font-medium">Submitted By:</span>{" "}
              {details.submittedBy}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${borderColor}`}
          >
            {escalationLevel}
          </span>
          <p
            className={`mt-2 text-sm ${
              details.state === "Closed" ? "text-gray-500" : "text-green-500"
            }`}
          >
            State: {details.state}
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <div className="mt-4">
            <p className="text-gray-700">{description}</p>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="font-medium">
              Time Remaining: {details.timeRemaining}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Created: {details.createdAt}
            </p>
          </div>

          {details.notes.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Notes:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {details.notes.map((note) => (
                  <div key={note.id} className="p-2 bg-white rounded border">
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Level {note.escalationLevel} -{" "}
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.state !== "Closed" && (
            <div className="mt-4">
              {isClosing ? (
                <div className="space-y-2">
                  <textarea
                    value={closeNote}
                    onChange={(e) => onCloseNoteChange(e.target.value)}
                    placeholder="Add closing note..."
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onCloseNoteChange("")}
                      className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirmClose}
                      className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Confirm Close
                    </button>
                  </div>
                </div>
              ) : isEscalating ? (
                <div className="space-y-2">
                  <textarea
                    value={escalationNote}
                    onChange={(e) => onEscalationNoteChange(e.target.value)}
                    placeholder="Add escalation note..."
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEscalationNoteChange("")}
                      className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirmEscalate}
                      className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      disabled={level >= 5}
                    >
                      Confirm Escalation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Close Ticket
                  </button>
                  <button
                    onClick={onEscalate}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={level >= 5}
                  >
                    Escalate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketsCard;

const ERROR_MESSAGES = Object.freeze({
  INVALID_ACCOUNT_ID: "Account ID must be a valid integer greater than zero",
  INVALID_TICKET_TYPE_REQUEST: "Invalid ticket type request",
  NO_TICKETS: "At least one ticket must be purchased",
  MAX_TICKETS: (max) => `Cannot purchase more than ${max} tickets at a time`,
  CHILD_INFANT_WITHOUT_ADULT: "Child and Infant tickets cannot be purchased without an Adult ticket",
  INVALID_TICKET_TYPE: "type must be ADULT, CHILD, or INFANT",
  INVALID_TICKET_COUNT: "noOfTickets must be a positive integer",
  INFANT_TICKET_LIMIT: "Number of infant tickets cannot exceed number of adult tickets"
});

export default ERROR_MESSAGES;

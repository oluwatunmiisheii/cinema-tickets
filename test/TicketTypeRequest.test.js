import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import ERROR_MESSAGES from "../src/pairtest/lib/errorMessages.js";

describe(`${TicketTypeRequest.name}`, () => {
  test("should throw for invalid ticket type", () => {
    expect(() => new TicketTypeRequest("SENIOR", 1)).toThrow(
      TypeError(ERROR_MESSAGES.INVALID_TICKET_TYPE)
    );
  });

  test.each([
    ["string", "2"],
    ["float", 2.5],
    ["null", null],
    ["undefined", undefined],
    ["negative", -1],
    ["zero", 0],
  ])("should throw for non-integer ticket count: %s", (_, value) => {
    expect(() => new TicketTypeRequest("CHILD", value)).toThrow(
      TypeError(ERROR_MESSAGES.INVALID_TICKET_COUNT)
    );
  });

  test.each([
    ["ADULT", 2],
    ["INFANT", 1],
    ["CHILD", 5],
  ])(
    "should return the correct ticket type and number of tickets for type %s and count %i",
    (type, count) => {
      const req = new TicketTypeRequest(type, count);
      expect(req.getTicketType()).toBe(type);
      expect(req.getNoOfTickets()).toBe(count);
    }
  );
});

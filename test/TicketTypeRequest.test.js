import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";

describe(`${TicketTypeRequest.name}`, () => {
  test("should throw for invalid ticket type", () => {
    expect(() => new TicketTypeRequest("SENIOR", 1)).toThrow(
      "type must be ADULT, CHILD, or INFANT"
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
      "noOfTickets must be a positive integer"
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

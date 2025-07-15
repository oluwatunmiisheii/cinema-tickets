import TicketService from "../src/pairtest/TicketService.js";

describe(`${TicketService.name}`, () => {
  describe("Account validation", () => {
    test.todo("should fail if account ID is zero");

    test.todo("should fail if account ID is negative");

    test.todo("should succeed for valid account ID");
  });

  describe("Ticket quantity limits", () => {
    test("should fail if no tickets are requested");

    test("should fail if all ticket requests are for zero tickets");

    test.todo("should fail if ticket count is negative");

    test.todo("should fail if more than 25 tickets are requested");
  });

  describe("Ticket type dependency rules", () => {
    test.todo("should fail if only child tickets are requested");

    test.todo("should fail if only infant tickets are requested");

    test.todo("should fail if only child and infant tickets are requested");

    test.todo("should succeed for adult and child tickets");

    test.todo("should succeed for adult and infant tickets",);
  });

  describe("Payment calculation", () => {
    test.todo("should charge £25 for one adult");

    test.todo("should charge £40 for one adult and one child");

    test.todo("should charge £25 for one adult and one infant");

    test.todo("should charge correct total for mixed tickets");
  });

  describe("Seat reservation", () => {
    test.todo("reserves seats for adults and children only (infants sit on laps)");

    test.todo("reserves no seats when only infants requested with adult");
  });

  describe("Full ticket purchase and seat reservation flow", () => {
    test.todo("should correctly charge and reserve seats");

    test.todo("should processes payment before seat reservation");
  });
});

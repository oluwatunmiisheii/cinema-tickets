import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

jest.mock("../src/thirdparty/paymentgateway/TicketPaymentService.js");
jest.mock("../src/thirdparty/seatbooking/SeatReservationService.js");

describe(`${TicketService.name}`, () => {
  let ticketService;
  let mockPayment;
  let mockSeat;

  beforeEach(() => {
    ticketService = new TicketService();
    mockPayment = TicketPaymentService.prototype.makePayment = jest.fn();
    mockSeat = SeatReservationService.prototype.reserveSeat = jest.fn();
  });
  describe("Account validation", () => {
    const error = new InvalidPurchaseException(
      "Account ID must be a valid integer greater than zero"
    );
    test("should throw if account ID is zero", () => {
      expect(() =>
        ticketService.purchaseTickets(0, new TicketTypeRequest("ADULT", 1))
      ).toThrow(error);
    });
    test("should throw if account ID is negative", () => {
      expect(() =>
        ticketService.purchaseTickets(-5, new TicketTypeRequest("ADULT", 1))
      ).toThrow(error);
    });

    test("should not throw for account IDs greater than zero", () => {
      expect(() =>
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1))
      ).not.toThrow();
      expect(() =>
        ticketService.purchaseTickets(42, new TicketTypeRequest("ADULT", 1))
      ).not.toThrow();
    });
  });

  describe("Ticket quantity limits", () => {
    test("should fail if any ticket quantity is zero", () => {
      expect(() => ticketService.purchaseTickets(1)).toThrow(
        new InvalidPurchaseException("At least one ticket must be purchased")
      );
    });

    test("should fail if any ticket quantity is negative", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 10),
          new TicketTypeRequest("CHILD", 0)
        )
      ).toThrow(new Error("noOfTickets must be a positive integer"));
    });

    test("should fail if ticket count is negative", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 2),
          new TicketTypeRequest("CHILD", -1)
        )
      ).toThrow(new Error("noOfTickets must be a positive integer"));
    });

    test("should only allow a maximum of 25 tickets at a time", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 16),
          new TicketTypeRequest("CHILD", 10),
          new TicketTypeRequest("INFANT", 1)
        )
      ).toThrow(
        new InvalidPurchaseException(
          "Cannot purchase more than 25 tickets at a time"
        )
      );

      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 15),
          new TicketTypeRequest("CHILD", 9),
          new TicketTypeRequest("INFANT", 1)
        )
      ).not.toThrow();
    });
  });

  describe("Ticket type dependency rules", () => {
    const error = new InvalidPurchaseException(
      "Child and Infant tickets cannot be purchased without an Adult ticket"
    );

    test("should throw if only child tickets are requested", () => {
      expect(() =>
        ticketService.purchaseTickets(1, new TicketTypeRequest("CHILD", 2))
      ).toThrow(error);
    });

    test("should throw if only infant tickets are requested", () => {
      expect(() =>
        ticketService.purchaseTickets(1, new TicketTypeRequest("INFANT", 1))
      ).toThrow(error);
    });

    test("should throw if only child and infant tickets are requested", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("CHILD", 1),
          new TicketTypeRequest("INFANT", 1)
        )
      ).toThrow(error);
    });

    test("should throw for invalid ticket type", () => {
      expect(() =>
        ticketService.purchaseTickets(1, new TicketTypeRequest("SENIOR", 1))
      ).toThrow("type must be ADULT, CHILD, or INFANT");
    });

    test("should succeed for adult and child tickets", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 1),
          new TicketTypeRequest("CHILD", 2)
        )
      ).not.toThrow();
    });

    test("should succeed for adult and infant tickets", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 1),
          new TicketTypeRequest("INFANT", 1)
        )
      ).not.toThrow();
    });
  });

  describe("Payment calculation", () => {
    test.todo("should charge £25 for one adult");

    test.todo("should charge £40 for one adult and one child");

    test.todo("should charge £25 for one adult and one infant");

    test.todo("should charge correct total for mixed tickets");
  });

  describe("Seat reservation", () => {
    test.todo(
      "reserves seats for adults and children only (infants sit on laps)"
    );

    test.todo("reserves no seats when only infants requested with adult");
  });

  describe("Full ticket purchase and seat reservation flow", () => {
    test.todo("should correctly charge and reserve seats");

    test.todo("should processes payment before seat reservation");
  });
});

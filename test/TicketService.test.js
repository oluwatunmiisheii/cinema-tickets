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
    const error = new InvalidPurchaseException("Account ID must be a valid integer greater than zero");
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
    test.todo("should fail if no tickets are requested");

    test.todo("should fail if all ticket requests are for zero tickets");

    test.todo("should fail if ticket count is negative");

    test.todo("should fail if more than 25 tickets are requested");
  });

  describe("Ticket type dependency rules", () => {
    test.todo("should fail if only child tickets are requested");

    test.todo("should fail if only infant tickets are requested");

    test.todo("should fail if only child and infant tickets are requested");

    test.todo("should succeed for adult and child tickets");

    test.todo("should succeed for adult and infant tickets");
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

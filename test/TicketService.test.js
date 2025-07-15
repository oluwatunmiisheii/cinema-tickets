import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import { TICKET_PRICES, MAX_TICKET } from "../src/pairtest/lib/ticketConfig.js";
import ERROR_MESSAGES from "../src/pairtest/lib/errorMessages.js";

describe(`${TicketService.name}`, () => {
  let ticketService;
  let paymentService;
  let seatReservationService;

  beforeEach(() => {
    paymentService = {makePayment: jest.fn()}
    seatReservationService = {reserveSeat: jest.fn()};
    ticketService = new TicketService(paymentService, seatReservationService);
  });
  describe("Account validation", () => {
    const error = new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNT_ID);
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
    test("should throw for invalid request types", () => {
      expect(() =>
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1), { type: "CHILD", noOfTickets: 1 })
      ).toThrow(new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST));

      expect(() =>
        ticketService.purchaseTickets(1, "ADULT", new TicketTypeRequest("CHILD", 1))
      ).toThrow(new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST));

      expect(() =>
        ticketService.purchaseTickets(1, 123)
      ).toThrow(new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST));
    });

    test("should throw if no tickets are requested", () => {
      expect(() => ticketService.purchaseTickets(1)).toThrow(
        new InvalidPurchaseException(ERROR_MESSAGES.NO_TICKETS)
      );
    });

    test("should throw if any ticket quantity is zero", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 10),
          new TicketTypeRequest("CHILD", 0)
        )
      ).toThrow(TypeError(ERROR_MESSAGES.INVALID_TICKET_COUNT));
    });

    test("should throw if ticket count is negative", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 2),
          new TicketTypeRequest("CHILD", -1)
        )
      ).toThrow(TypeError(ERROR_MESSAGES.INVALID_TICKET_COUNT));
    });

    test(`should only allow a maximum of ${MAX_TICKET} tickets at a time`, () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 16),
          new TicketTypeRequest("CHILD", 10),
          new TicketTypeRequest("INFANT", 1)
        )
      ).toThrow(new InvalidPurchaseException(ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET)));

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
    const error = new InvalidPurchaseException(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT);

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
      ).toThrow(new TypeError(ERROR_MESSAGES.INVALID_TICKET_TYPE));
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
    test("should charge the correct amount per adult ticket", () => {
      ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 3));
      expect(paymentService.makePayment).toHaveBeenCalledWith(
        1,
        TICKET_PRICES.ADULT * 3
      );
    });

    test("should charge the correct amount for one adult and one child", () => {
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1)
      );
      expect(paymentService.makePayment).toHaveBeenCalledWith(
        1,
        TICKET_PRICES.ADULT + TICKET_PRICES.CHILD
      );
    });

    test("should charge the correct amount for one adult and one infant", () => {
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 1)
      );
      expect(paymentService.makePayment).toHaveBeenCalledWith(
        1,
        TICKET_PRICES.ADULT + TICKET_PRICES.INFANT
      );
    });

    test("should charge correct amount for mixed tickets", () => {
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 3),
        new TicketTypeRequest("INFANT", 2)
      );
      const expected =
        2 * TICKET_PRICES.ADULT +
        3 * TICKET_PRICES.CHILD +
        2 * TICKET_PRICES.INFANT;
      expect(paymentService.makePayment).toHaveBeenCalledWith(1, expected);
    });
  });
  describe("Seat reservation", () => {
    test("should reserve a seat for each adult ticket purchased", () => {
      ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1));
      expect(seatReservationService.reserveSeat).toHaveBeenCalledWith(1, 1);
    });

    test("should reserve a seat for each child ticket purchased", () => {
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1)
      );
      expect(seatReservationService.reserveSeat).toHaveBeenCalledWith(1, 2);
    });

    test("should not reserve seats for infant tickets", () => {
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 2)
      );
      expect(seatReservationService.reserveSeat).toHaveBeenCalledWith(1, 1);
    });

    test("should reserve correct seats for mixed tickets", () => {
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 3),
        new TicketTypeRequest("INFANT", 5)
      );
      expect(seatReservationService.reserveSeat).toHaveBeenCalledWith(1, 5);
    });
  });

  describe("Full ticket purchase and seat reservation flow", () => {
    test.each([
      {
        title: "2 adults, 2 children, 1 infant",
        tickets: [
          new TicketTypeRequest("ADULT", 2),
          new TicketTypeRequest("CHILD", 2),
          new TicketTypeRequest("INFANT", 1),
        ],
        expectedPayment: (2 * TICKET_PRICES.ADULT) + (2 * TICKET_PRICES.CHILD) + (1 * TICKET_PRICES.INFANT),
        expectedSeats: 2 + 2,
      },
      {
        title: "1 adult, 3 children, 2 infants",
        tickets: [
          new TicketTypeRequest("ADULT", 1),
          new TicketTypeRequest("CHILD", 3),
          new TicketTypeRequest("INFANT", 2),
        ],
        expectedPayment: (1 * TICKET_PRICES.ADULT + 3 * TICKET_PRICES.CHILD + 2 * TICKET_PRICES.INFANT),
        expectedSeats: 1 + 3,
      },
      {
        title: "3 adults only",
        tickets: [new TicketTypeRequest("ADULT", 3)],
        expectedPayment: (3 * TICKET_PRICES.ADULT),
        expectedSeats: 3,
      },
    ])(
      "should charge the correct amount and reserve seats for $title",
      ({ tickets, expectedPayment, expectedSeats }) => {
        ticketService.purchaseTickets(1, ...tickets);
        expect(paymentService.makePayment).toHaveBeenCalledWith(1, expectedPayment);
        expect(seatReservationService.reserveSeat).toHaveBeenCalledWith(1, expectedSeats);
      }
    );

    test("should processes payment before seat reservation", () => {
      ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1));
      expect(paymentService.makePayment).toHaveBeenCalled();
      expect(seatReservationService.reserveSeat).toHaveBeenCalled();
      expect(paymentService.makePayment.mock.invocationCallOrder[0]).toBeLessThan(
        seatReservationService.reserveSeat.mock.invocationCallOrder[0]
      );
    });
  });

  test("can construct TicketService with default dependencies", async () => {
    const service = new (await import("../src/pairtest/TicketService.js")).default();
    expect(service).toBeInstanceOf(TicketService);
  });
});


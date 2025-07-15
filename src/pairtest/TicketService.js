import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import {TICKET_PRICES, MAX_TICKET} from './lib/ticketConfig.js';
import ERROR_MESSAGES from './lib/errorMessages.js';

/**
 * Service for purchasing cinema tickets, enforcing all business rules.
 * Handles validation, payment, and seat reservation.
 */
export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #paymentService;
  #seatService;

  constructor(
    paymentService = new TicketPaymentService(),
    seatService = new SeatReservationService()
  ) {
    this.#paymentService = paymentService;
    this.#seatService = seatService;
  }

  /**
   * Purchase tickets for a given account, enforcing all business rules.
   *
   * @param {number} accountId - The account ID of the purchaser (must be a positive integer).
   * @param {...TicketTypeRequest} ticketTypeRequests - One or more TicketTypeRequest objects specifying ticket types and quantities.
   * @throws {InvalidPurchaseException} If any business rule is violated (invalid account, ticket types, quantities, or dependencies).
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // validate account ID
    this.#validateAccountId(accountId);

    // validate ticket requests and count tickets
    const { adultTickets, childTickets, infantTickets } =
      this.#validateAndCountTickets(ticketTypeRequests);

    // calculate total amount and make payment
    const { ADULT, CHILD, INFANT } = TICKET_PRICES;
    const totalAmount =
      adultTickets * ADULT + childTickets * CHILD + infantTickets * INFANT;
    this.#paymentService.makePayment(accountId, totalAmount);

    // reserve seats
    const totalSeats = this.#calculateTotalSeats(adultTickets, childTickets);
    this.#seatService.reserveSeat(accountId, totalSeats);
  }

  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNT_ID);
    }
  }

  #validateAndCountTickets(ticketTypeRequests) {
    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.NO_TICKETS);
    }

    if (!ticketTypeRequests.every((req) => req instanceof TicketTypeRequest)) {
      throw new InvalidPurchaseException(
        ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST
      );
    }

    let total = 0,
      adults = 0,
      children = 0,
      infants = 0;

    for (const ticket of ticketTypeRequests) {
      const type = ticket.getTicketType();
      const count = ticket.getNoOfTickets();

      total += count;
      if (type === "ADULT") adults += count;
      if (type === "CHILD") children += count;
      if (type === "INFANT") infants += count;
    }

    if (total > MAX_TICKET) {
      throw new InvalidPurchaseException(
        ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET)
      );
    }

    if ((children > 0 || infants > 0) && adults === 0) {
      throw new InvalidPurchaseException(
        ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT
      );
    }

    if (infants > adults) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INFANT_TICKET_LIMIT);
    }

    return {
      totalTickets: total,
      adultTickets: adults,
      childTickets: children,
      infantTickets: infants,
    };
  }

  #calculateTotalSeats(adultTickets, childTickets) {
    return adultTickets + childTickets;
  }
}

import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import TICKET_PRICES from './lib/ticketPrices.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #paymentService;
  #seatService;

  constructor(paymentService = new TicketPaymentService(), seatService = new SeatReservationService()) {
    this.#paymentService = paymentService;
    this.#seatService = seatService;
  }


  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateAccountId(accountId);
    const { adultTickets, childTickets, infantTickets } = this.#validateAndCountTickets(ticketTypeRequests);

    const { ADULT, CHILD, INFANT } = TICKET_PRICES;
    const totalAmount = (adultTickets * ADULT) + (childTickets * CHILD) + (infantTickets * INFANT);
    this.#paymentService.makePayment(accountId, totalAmount);


  }

  #validateAndCountTickets(ticketTypeRequests) {
    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException("At least one ticket must be purchased");
    }

    let total = 0, adults = 0, children = 0, infants = 0;

    for (const ticket of ticketTypeRequests) {
      const type = ticket.getTicketType();
      const count = ticket.getNoOfTickets();

      total += count;
      if (type === "ADULT") adults += count;
      if (type === "CHILD") children += count;
      if (type === "INFANT") infants += count;
    }

    if (total > 25) {
      throw new InvalidPurchaseException("Cannot purchase more than 25 tickets at a time");
    }

    if ((children > 0 || infants > 0) && adults === 0) {
      throw new InvalidPurchaseException("Child and Infant tickets cannot be purchased without an Adult ticket");
    }

    return {
      totalTickets: total,
      adultTickets: adults, 
      childTickets: children,
      infantTickets: infants
    };
  }

  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(
        "Account ID must be a valid integer greater than zero"
      );
    }
  }
}

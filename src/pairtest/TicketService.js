import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

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
    // throws InvalidPurchaseException
    this.#validateAccountId(accountId);
  }

  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(
        "Account ID must be a valid integer greater than zero"
      );
    }
  }
}

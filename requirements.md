# Ticket Service Requirements

## Overview
Implement a `TicketService` that handles ticket purchases for a cinema with proper validation, payment processing, and seat reservation.

## Business Rules

### Ticket Types and Pricing
There are 3 types of tickets with the following prices:

| Ticket Type | Price |
|-------------|-------|
| INFANT      | £0    |
| CHILD       | £15   |
| ADULT       | £25   |

### Purchase Rules
- **Multiple tickets** can be purchased at any given time
- **Maximum 25 tickets** can be purchased in a single transaction
- **Infants** do not pay for a ticket and are not allocated a seat (they sit on an Adult's lap)
- **Child and Infant tickets** cannot be purchased without purchasing an Adult ticket

### External Services
- **TicketPaymentService** - Handles payment processing
- **SeatReservationService** - Handles seat reservations

## Constraints

### Interface Limitations
- The `TicketService` interface **CANNOT** be modified
- The code in the `thirdparty.*` packages **CANNOT** be modified
- The `TicketTypeRequest` **SHOULD** be an immutable object

## Assumptions

### Account Management
- All accounts with an ID greater than zero are valid
- All valid accounts have sufficient funds for any number of tickets

### External Services
- The `TicketPaymentService` implementation is an external provider with no defects
- Payment will always go through once a payment request is made
- The `SeatReservationService` implementation is an external provider with no defects  
- Seats will always be reserved once a reservation request is made

## Implementation Requirements

Your `TicketService` implementation must:

1. **Calculate the correct payment amount** for requested tickets and make a payment request to the `TicketPaymentService`

2. **Calculate the correct number of seats** to reserve and make a seat reservation request to the `SeatReservationService`

3. **Reject invalid purchase requests** - You must identify what constitutes an invalid purchase request

## Validation Rules

Based on the business rules, the following should be considered invalid:

- Account ID that is not a valid integer greater than zero
- No tickets requested
- More than 25 tickets requested in total
- Child or Infant tickets requested without an Adult ticket
- Invalid ticket types
- Invalid ticket quantities (zero or negative)

## Expected Behavior

### Payment Calculation
- Adult tickets: £25 each
- Child tickets: £15 each  
- Infant tickets: £0 each
- Total payment = (Adult count × £25) + (Child count × £15) + (Infant count × £0)

### Seat Reservation
- Adult tickets: 1 seat each
- Child tickets: 1 seat each
- Infant tickets: 0 seats (sit on Adult's lap)
- Total seats = Adult count + Child count + (Infant count × 0)

### Service Call Order
- Payment processing should occur before seat reservation

## Example Scenarios

### Valid Purchases
- 1 Adult ticket → £25, 1 seat
- 1 Adult + 1 Child → £40, 2 seats
- 1 Adult + 2 Infants → £25, 1 seat
- 2 Adults + 3 Children + 2 Infants → £95, 5 seats

### Invalid Purchases
- Account ID = 0 or negative
- 0 tickets requested
- 26+ tickets requested
- Only Child tickets (no Adult)
- Only Infant tickets (no Adult)
- Only Child + Infant tickets (no Adult)
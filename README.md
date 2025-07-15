# Cinema Tickets

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

A simple, fully-tested Node.js solution for the DWP "Cinema Tickets" coding exercise.

## What is this?

Implements a `TicketService` that enforces cinema ticket business rules, calculates payments, and reserves seats. All logic is covered by automated tests.

## Business Rules (Summary)

- **INFANT** — £0 (no seat)
- **CHILD** — £15
- **ADULT** — £25
- Max 25 tickets per purchase (adults + children + infants)
- Children/Infants require at least one Adult
- Infants do not get a seat
- Seats reserved only for Adults and Children

See [`requirements.md`](./requirements.md) for full rules.

---

## Getting Started

- Node.js ≥ 20
- [pnpm](https://pnpm.io/)

```bash
git clone https://github.com/oluwatunmiisheii/cinema-tickets
cd cinema-tickets
pnpm install
```

---

<img width="987" height="377" alt="coverage screenshot" src="https://github.com/user-attachments/assets/7d137bf3-066d-45e6-bd86-41a505c15ae1" />
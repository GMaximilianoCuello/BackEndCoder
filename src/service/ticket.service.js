import ticketDAO from '../dao/ticket.dao.js';

class TicketService {
  async generateTicket(purchaser, amount) {
    return await ticketDAO.createTicket(purchaser, amount);
  }
}

export default new TicketService();

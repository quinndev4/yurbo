export async function generateStaticParams() {
  const res = await fetch("http://localhost:4000/tickets");

  const tickets = await res.json();

  return tickets.map((ticket: any) => ({ id: ticket.id }));
}

async function getTicket(id: any) {
  const res = await fetch("http://localhost:4000/tickets/" + id, {
    next: {
      revalidate: 30,
    },
  });

  return res.json();
}

export default async function TicketDetails({ params }: { params: any }) {
  const ticket = await getTicket(params.id);

  return (
    <div>
      <h1>Ticket {ticket.id} Details</h1>
      <h2>Title:</h2>
      <p> {ticket.title}</p>

      <h2>email:</h2>
      <p> {ticket.user_email}</p>
      <h2>Body:</h2>
      <p> {ticket.body}</p>
      <div className={`pill ${ticket.priority}`}>
        {ticket.priority} priority
      </div>
    </div>
  );
}

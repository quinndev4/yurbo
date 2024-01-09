import Link from "next/link";

async function getTickets() {
  const res = await fetch("http://localhost:4000/tickets", {
    next: {
      revalidate: 0, // data gets cached. This is how often it gets revalidated for cache to get overriden. Put to 0 to never cache
    },
  });

  return res.json();
}

export default async function TicketList() {
  const tickets = await getTickets();

  return (
    <>
      {tickets.map((ticket: any) => (
        <div key={ticket.id} className="card my-5">
          <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
          <p>{ticket.body.slice(0, 200)} . . . </p>
          <div className={`pill ${ticket.priority}`}>
            {ticket.priority} priority
          </div>
        </div>
      ))}

      {tickets.length === 0 && <p className="text-center"> No Open Tickets </p>}
    </>
  );
}

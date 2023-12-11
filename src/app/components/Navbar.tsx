import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <h1>YURBO</h1>
      <Link href="/">Home</Link>
      <Link href="/add">New thing</Link>
      <Link href="/tickets">View Tickets</Link>
    </nav>
  );
}

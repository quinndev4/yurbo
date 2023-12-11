"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("low");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // prevent default action of a form, which is to refresh the page
    setIsLoading(true);

    // object with state as shit
    const ticket = {
      title,
      body,
      priority,
      user_email: "david.ham0099@gmail.com",
    }; // hard coded email.

    const res = await fetch("http://localhost:4000/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });

    if (res.status === 201) {
      router.refresh(); // this refreshes the cache, refreshes ticket page data so you dont have to refresh it
      router.push("/tickets");
    }
  };

  return (
    // onSubmit calls the function to handle submit
    <form onSubmit={handleSubmit} className="w-1/2">
      <label>
        <span>Title:</span>
        <input
          required
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </label>

      <label>
        <span>Priority:</span>
        <select onChange={(e) => setPriority(e.target.value)} value={priority}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </label>

      <label>
        <span>Body:</span>
        <input
          required
          type="text"
          onChange={(e) => setBody(e.target.value)}
          value={body}
        />
      </label>
      <button className="btn-primary" disabled={isLoading}>
        {isLoading && <span>Adding...</span>}
        {!isLoading && <span>Add Ticket</span>}
      </button>
    </form>
  );
}

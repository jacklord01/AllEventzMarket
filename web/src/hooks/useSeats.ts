import useSWR from "swr";

export function useSeats(eventId: string) {
  return useSWR(eventId ? `/api/events/${eventId}/seats` : null, async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch seats");
    return res.json();
  });
}

export function formatPrice(price: number): string {
  const hasCents = Math.round(price * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatListed(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Listed recently";

  const delta = Date.now() - then;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (delta < minute) return "Listed just now";

  if (delta < hour) {
    const minutes = Math.floor(delta / minute);
    return `Listed ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (delta < day) {
    const hours = Math.floor(delta / hour);
    return `Listed ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(delta / day);
  if (days < 7) {
    return `Listed ${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return `Listed ${new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

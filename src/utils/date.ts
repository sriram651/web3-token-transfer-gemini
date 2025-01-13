/**
 * @function getCurrentDateTime
 *
 * @returns the current date and time in the format: `DD MMM YYYY HH:MM`
 */
export function getCurrentDateTime() {
  const date = new Date();

  // Extract the day (2-digit format)
  const day = date.toLocaleString("en-US", { day: "2-digit" });

  // Extract the month (short format, e.g., Jan, Feb, etc.)
  const month = date.toLocaleString("en-US", { month: "short" });

  // Extract the year (numeric format)
  const year = date.toLocaleString("en-US", { year: "numeric" });

  // Extract the time in 2-digit hour and minute format (e.g., 02:30)
  const time = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Return the formatted date and time string
  return `${day} ${month} ${year} ${time}`;
}

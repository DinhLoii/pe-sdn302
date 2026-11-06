export const genres = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Biography",
  "Other",
] as const;
export type ReadingFields = {
  bookTitle: string;
  minutesRead: string;
  genre: string;
  note: string;
  readOn: string;
};
export type ReadingErrors = Partial<Record<keyof ReadingFields, string>>;
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function validateReading(
  body: Record<string, unknown>,
  partial = false,
): ReadingErrors {
  const errors: ReadingErrors = {};
  const has = (key: string) =>
    !partial || Object.prototype.hasOwnProperty.call(body, key);
  if (has("bookTitle")) {
    if (typeof body.bookTitle !== "string" || !body.bookTitle.trim())
      errors.bookTitle = "Book title is required";
    else if (body.bookTitle.trim().length > 80)
      errors.bookTitle = "Book title must be at most 80 characters";
  }
  if (has("minutesRead")) {
    const value = body.minutesRead;
    const number =
      typeof value === "number" || typeof value === "string"
        ? Number(value)
        : NaN;
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim()) ||
      !Number.isFinite(number)
    )
      errors.minutesRead = "Minutes read is required";
    else if (!Number.isInteger(number) || number <= 0 || number > 2147483647)
      errors.minutesRead = "Minutes read must be a positive number";
  }
  if (has("genre")) {
    if (body.genre === undefined || body.genre === null || body.genre === "")
      errors.genre = "Please choose a genre";
    else if (!genres.includes(body.genre as (typeof genres)[number]))
      errors.genre = "Invalid genre";
  }
  if (has("readOn")) {
    const value = body.readOn;
    if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    )
      errors.readOn = "Date is required";
    else if (value > today()) errors.readOn = "Date cannot be in the future";
  }
  return errors;
}

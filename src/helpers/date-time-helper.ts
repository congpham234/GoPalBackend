export const calculateDaysBetweenDates = (
  startDate: string,
  endDate: string,
): number => {
  // Parse the start and end dates into Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = end.getTime() - start.getTime();

  // Convert the difference from milliseconds to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  // Return the absolute number of days (rounded down)
  return Math.floor(Math.abs(differenceInDays));
};

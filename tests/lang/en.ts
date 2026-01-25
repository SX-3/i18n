export default {
  date: 'Date',
  month: 'Month',
  year: 'Year',
  previous: 'Previous',
  person: (count: number) => `Person${count > 1 ? 's' : ''}`,
  english: 'English!',
} as const;

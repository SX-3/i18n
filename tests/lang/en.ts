export default {
  date: 'Date',
  month: 'Month',
  year: 'Year',
  previous: 'Previous',
  person: (count: number) => `Person${count > 1 ? 's' : ''}`,
  english: 'English!',
  user: {
    liked: (who: string, what: string) => `${who} liked the ${what}`,
  },
} as const;

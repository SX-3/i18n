export default {
  hello: 'Привет мир!',
  date: 'Дата',
  month: 'Месяц',
  year: 'Год',
  previous: 'Назад',
  next: 'Вперёд',
  person: (count: number) => count > 1 ? 'Люди' : 'Человек',
} as const;

const parseDate = (date) => {
    if (typeof date !== 'string') return;

    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) return parsedDate;
  };

  export const parseFilterParams = (query) => {
    const { date} = query;
    const parsedDate = parseDate(date);

    return {
      date: parsedDate,
    };
  };

const DATE_FORMATS: {[key: string]: object} = {
  mediumDate: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
};

export const formatDate = (date: Date | number, format: string, locale: string) => {
  return new Intl.DateTimeFormat(locale, DATE_FORMATS[format]).format(date);
};

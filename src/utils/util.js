import { appDay } from './day.js';

const isEscapeKey = (evt) => evt.key === 'Escape';

const calculateDuration = (dateFrom, dateTo) => {
  const start = appDay(dateFrom).startOf('minute');
  const end = appDay(dateTo).startOf('minute');
  const differenceInMilliseconds = end.diff(start);
  const eventDuration = appDay.duration(differenceInMilliseconds);
  const days = Math.floor(eventDuration.asDays());
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  if (days > 0) {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${minutes}M`;
  }
};

export { isEscapeKey, calculateDuration };

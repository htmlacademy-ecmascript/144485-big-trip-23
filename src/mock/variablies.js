export const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
export const CITIES = ['Amsterdam', 'Chamonix', 'Geneva', 'Paris', 'Milano'];
export const SORT_TYPES = ['day', 'event', 'time', 'price', 'offers'];
export const Filter = {
  EVERTHING: 'everthing',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
export const TripMessagesEmpty = {
  [Filter.EVERTHING]: 'Click  New Event to create first point',
  [Filter.FUTURE]: 'There are no future events now',
  [Filter.PRESENT]: 'There are no present events now',
  [Filter.PAST]: 'There are no past events now',
};

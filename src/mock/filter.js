import { filter } from '../utils.js/filter.js';

function generateFilter(points) {
  return Object.entries(filter).map(([filterType, filterPoint]) => ({
    type: filterType,
    count: filterPoint(points).length
  })
  );
}

export { generateFilter };

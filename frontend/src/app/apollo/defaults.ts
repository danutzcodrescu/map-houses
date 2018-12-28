import * as _ from 'lodash';

export const defaults = {
  zip: null,
  isDashboardOpen: false,
  selectedHouse: null,
  priceRange: {
    min: _.get(JSON.parse(localStorage.getItem('priceRange')), 'min', 200_000),
    max: _.get(JSON.parse(localStorage.getItem('priceRange')), 'max', 500_000),
    __typename: 'price'
  }
};

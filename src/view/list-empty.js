import AbstractView from '../framework/view/abstract-view.js';


const createtListempty = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class ListEmpty extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createtListempty();
  }
}

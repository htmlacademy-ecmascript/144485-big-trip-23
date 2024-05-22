import AbstractView from '../framework/view/abstract-view.js';

const createEventButton = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class CreationForm extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createEventButton();
  }

}

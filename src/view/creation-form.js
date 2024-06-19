import AbstractView from '../framework/view/abstract-view.js';

const createEventButton = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class CreationForm extends AbstractView {
  #onClick = null;
  constructor({ onClick }) {
    super();
    this.#onClick = onClick;
    this.element.addEventListener('click', this.#newEventClickHandler);
  }

  get template() {
    return createEventButton();
  }

  #newEventClickHandler = (evt) => {
    evt.preventDefault();
    this.#onClick();
  };
}

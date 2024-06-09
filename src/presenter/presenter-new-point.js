import WaypointEdit from '../view/waypoint-edit.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { isEscapeKey } from '../utils.js/util.js';
import { UpdateType, UserAction } from '../utils.js/const.js';

export default class PresenterNewPoint {
  #offers = null;
  #destinationsModel = null;

  #containerList = null;
  #destinationsoffersModel = null;
  #pointListContainer = null;
  #onPointChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({ offers, destinationsModel, containerList, onPointChange, handleDestroy }) {
    this.#offers = offers;
    this.#destinationsoffersModel = destinationsModel;
    this.#pointListContainer = containerList;
    this.#onPointChange = onPointChange;
    this.#handleDestroy = handleDestroy;


  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new WaypointEdit({
      offers: this.#offers,
      destinationsModel: this.#destinationsModel,
      onEditFormSave: this.#handleFormSubmit,
      onDeleteForm: this.#handleFormCancelButtonClick
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escapeKeydownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escapeKeydownHandler);
  }

  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#onPointChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
    this.destroy();
  };

  #handleFormCancelButtonClick = () => {
    this.destroy();
  };


}

import { render, replace, remove } from '../framework/render.js';
import Waypoint from '../view/waypoint.js';
import WaypointEdit from '../view/waypoint-edit.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PresenterWaypoint {
  #destinationsModel = null;
  #offersModel = null;
  #destinationsModelAll = [];
  #pointListContainer = null;
  #eventView = null;
  #eventEditView = null;
  #point = null;
  #onPointChange = null;
  #mode = Mode.DEFAULT;
  #onModeChange = null;

  constructor({ pointListContainer, destinationsModel, offersModel, onPointChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#destinationsModelAll = [...this.#destinationsModel.destinationAll];
    this.#offersModel = offersModel;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevEventViewComponent = this.#eventView;
    const prevEventEditViewComponent = this.#eventEditView;

    this.#eventView = new Waypoint({
      waypoint: point,
      onClickButtonRollup: this.#onClickButtonRollup,
      destinationsModel: this.#destinationsModel,
      onFavoriteClick: this.#onFavoriteClick,
      offerCurrent: this.#offersModel.getCurrentOffer(point.type),
    });

    this.#eventEditView = new WaypointEdit({
      waypoint: point,
      onEditFormRollupButtonClick: this.#onEditFormRollupButtonClick,
      destinationsModel: this.#destinationsModel,
      onEditFormSave: this.#onEditFormSave,
      offersModel: this.#offersModel,
    });

    if ((prevEventViewComponent === null) | (prevEventEditViewComponent === null)) {
      render(this.#eventView, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventView, prevEventViewComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditView, prevEventEditViewComponent);
    }

    remove(prevEventViewComponent);
    remove(prevEventEditViewComponent);
  }

  destroy() {
    remove(this.#eventView);
    remove(this.#eventEditView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditView.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditView.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#eventEditView, this.#eventView);
    document.addEventListener('keydown', this.#escapeKeydownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#eventView, this.#eventEditView);
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #onClickButtonRollup = () => {
    this.#replacePointToForm();
  };

  #onEditFormRollupButtonClick = () => {
    this.#eventEditView.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #onEditFormSave = () => {
    this.#replaceFormToPoint();
  };

  #onFavoriteClick = () => {
    this.#onPointChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };
}

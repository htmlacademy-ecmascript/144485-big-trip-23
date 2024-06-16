import { render, replace, remove } from '../framework/render.js';
import Waypoint from '../view/waypoint.js';
import WaypointEdit from '../view/waypoint-edit.js';
import { UserAction, UpdateType } from '../utils/const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PresenterWaypoint {
  #destinations = null;
  #offers = null;
  #pointListContainer = null;
  #eventView = null;
  #eventEditView = null;
  #point = null;
  #onPointChange = null;
  #mode = Mode.DEFAULT;
  #onModeChange = null;
  #offersCurrent = null;
  #destinationCurrent = null;
  #pointsModel = null;

  constructor({ pointListContainer, onPointChange, onModeChange, offersCurrent, destinationCurrent, pointsModel }) {
    this.#pointListContainer = pointListContainer;
    this.#destinations = pointsModel.destinations;
    this.#destinationCurrent = destinationCurrent;
    this.#offers = pointsModel.offers;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
    this.#offersCurrent = offersCurrent;
    this.#pointsModel = pointsModel;
  }

  init(point) {
    this.#point = point;

    const prevEventViewComponent = this.#eventView;
    const prevEventEditViewComponent = this.#eventEditView;

    this.#eventView = new Waypoint({
      waypoint: point,
      onClickButtonRollup: this.#onClickButtonRollup,
      destinations: this.#destinations,
      destinationCurrent: this.#destinationCurrent,
      onFavoriteClick: this.#onFavoriteClick,
      offerCurrent: this.#offersCurrent,
      offers: this.#offers,
    });

    this.#eventEditView = new WaypointEdit({
      waypoint: point,
      pointsModel: this.#pointsModel,
      onEditFormRollupButtonClick: this.#onEditFormRollupButtonClick,
      destinations: this.#destinations,
      onEditFormSave: this.#onEditFormSave,
      offers: this.#offers,
      offerCurrent: this.#offersCurrent,
      onDeleteForm: this.#handleEditFormDeleteButtonClick,
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

  #onEditFormSave = (point) => {
    this.#onPointChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
  };

  #handleEditFormDeleteButtonClick = (point) => {
    this.#onPointChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #onFavoriteClick = () => {
    this.#onPointChange(UserAction.UPDATE_POINT, UpdateType.PATCH, { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditView.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditView.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventView.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEditView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditView.shake(resetFormState);
  }
}

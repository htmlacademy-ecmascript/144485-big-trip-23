import WaypointEdit from '../view/waypoint-edit.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { isEscapeKey } from '../utils/util.js';
import { UpdateType, UserAction } from '../utils/const.js';

export default class PresenterNewPoint {
  #pointListContainer = null;
  #onPointChange = null;
  #handleDestroy = null;
  #pointsModel = null;
  #pointEditComponent = null;
  #deletingEmptyPoint = null;
  #recoveryEmptyPoint = null;

  constructor({ containerList, onPointChange, pointsModel, onDestroy, deletingEmptyPoint, recoveryEmptyPoint }) {
    this.#pointsModel = pointsModel;
    this.#pointListContainer = containerList;
    this.#onPointChange = onPointChange;
    this.#handleDestroy = onDestroy;
    this.#deletingEmptyPoint = deletingEmptyPoint;
    this.#recoveryEmptyPoint = recoveryEmptyPoint;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new WaypointEdit({
      pointsModel: this.#pointsModel,
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onEditFormSave: this.#handleFormSubmit,
      onDeleteForm: this.#handleFormCancelButtonClick,
      getOffersByType: (type) => this.#pointsModel.getOffersByType(type)
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    this.#deletingEmptyPoint();

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

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#recoveryEmptyPoint();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#onPointChange(UserAction.ADD_POINT, UpdateType.MINOR, point);
  };

  #handleFormCancelButtonClick = () => {
    this.#recoveryEmptyPoint();
    this.destroy();
  };
}

import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';

import {RenderPosition, Mode, UserPointAction, UpdateType, State} from '../consts';
import {isEsc, checkMinorUpdate} from '../utils/utils';
import {render, replace, remove} from '../utils/render-utils';


export default class PointPresenter {
  #container = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;

  #changeData = null;
  #changeMode = null;
  #removeNewPoint = null;

  #destinations = null;
  #names = null
  #types = null;
  #offers = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode, destinations, offers, types, names) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    this.#destinations = destinations;
    this.#offers = offers;
    this.#names = names;
    this.#types = types;
  }

  init = (point, removeNewPoint) => {
    this.#point = point;

    this.#removeNewPoint = removeNewPoint;

    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point);
    this.#editPointComponent = new EditPointView(point, this.#destinations, this.#offers, this.#types, this.#names);

    this.#pointComponent.setButtonOpenClickHandler(this.#pointOpenClickHandler);
    this.#pointComponent.setFavoriteClickHandler(this.#pointFavoriteToggleHandler);

    this.#editPointComponent.setCloseButtonClickHandler(this.#pointCloseClickHandler);
    this.#editPointComponent.setSubmitHandler(this.#pointSubmitHandler);
    this.#editPointComponent.setButtonDeleteClickHandler(this.#pointDeleteHandler);

    this.#render();
  }

  #render = () => {
    if (this.#prevPointComponent === null || this.#prevEditPointComponent === null) {
      render(this.#container, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, this.#prevPointComponent);
    }

    if (this.#mode === Mode.EDIT) {
      replace(this.#pointComponent, this.#prevEditPointComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(this.#prevPointComponent);
    remove(this.#prevEditPointComponent);
  }

  removePointComponent = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetMode = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeEditPoint();
    }
  }

  #pointEscHandler = (evt) => {
    if (isEsc(evt.code)) {
      this.#closeEditPoint();
    }
  }

  #openEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#pointEscHandler);
    this.#changeMode();
    this.#mode = Mode.EDIT;
  }

  #closeEditPoint = () => {
    this.#editPointComponent.reset(this.#point);
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#pointEscHandler);
    this.#mode = Mode.DEFAULT;
  }

  #pointOpenClickHandler = () => {
    this.#openEditPoint();
  }

  #pointCloseClickHandler = () => {
    this.#closeEditPoint();
  }

  #pointSubmitHandler = (point) => {
    const isMinor = checkMinorUpdate(point, this.#point);

    this.#changeData(
      UserPointAction.UPDATE,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  }

  #pointDeleteHandler = (point) => {
    this.#changeData(
      UserPointAction.DELETE,
      UpdateType.MAJOR,
      point,
    );
  }

  #pointFavoriteToggleHandler = () => {
    this.#changeData(
      UserPointAction.UPDATE,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  }

  #resetState = () => {
    this.#editPointComponent.updateStateWithRerender({
      isDeleting: false,
      isDisabled: false,
      isSaving: false,
    });
  };

  setViewState = (state) => {
    switch (state) {
      case State.DELETING:
        this.#editPointComponent.updateStateWithRerender({
          isDeleting: true,
          isDisabled: true,
        });
        this.#editPointComponent.disableInputs();
        break;
      case State.SAVING:
        if (this.#mode === Mode.DEFAULT) {
          return;
        }
        this.#editPointComponent.updateStateWithRerender({
          isSaving: true,
          isDisabled: true,
        });
        this.#editPointComponent.disableInputs();
        break;
      case State.ABORTING:
        if (this.#mode === Mode.DEFAULT) {
          this.#pointComponent.shake();
          return;
        }
        this.#editPointComponent.disableInputs();
        this.#editPointComponent.shake(this.#resetState);
        break;
    }
  }
}

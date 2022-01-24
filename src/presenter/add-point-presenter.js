import EditPointView from '../view/edit-point-view';

import {DefaultValue, RenderPosition, UpdateType, UserPointAction} from '../consts';
import {remove, render} from '../utils/render-utils';
import {isEsc} from '../utils/utils';


export default class AddPointPresenter {
  #container = null;
  #editPointComponent = null;

  #changeData = null;
  #enableButton = null;
  #formDeleteHandler = null;

  #destinations = null;
  #offers = null;
  #types = null;
  #names = null;

  constructor(changeData, enableButton) {
    this.#changeData = changeData;
    this.#enableButton = enableButton;
  }

  init = (container, destinations, offers, types, names) => {
    this.#container = container;

    this.#destinations = destinations;
    this.#offers = offers;

    this.#types = types;
    this.#names = names;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#render();

    document.addEventListener('keydown', this.#pointEscHandler);
  }

  setFormDeleteHandler = (cb) => {
    this.#formDeleteHandler = cb;
  }

  #render = () => {
    this.#editPointComponent = new EditPointView(DefaultValue.POINT, this.#destinations, this.#offers, this.#types, this.#names);

    this.#editPointComponent.setSubmitHandler(this.#pointSubmitHandler);
    this.#editPointComponent.setButtonDeleteClickHandler(this.#pointDeleteHandler);

    render(this.#container, this.#editPointComponent, RenderPosition.AFTERBEGIN);
  }

  remove = () => {
    if (this.#editPointComponent === null) {
      return;
    }

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#pointEscHandler);
    this.#enableButton();

    if (this.#formDeleteHandler !== null) {
      this.#formDeleteHandler();
      this.#formDeleteHandler = null;
    }
  }

  #pointEscHandler = (evt) => {
    if (isEsc(evt.code)) {
      this.#pointDeleteHandler();
    }
  }

  #pointDeleteHandler = () => {
    this.remove();
    document.removeEventListener('keydown', this.#pointEscHandler);
  }

  #pointSubmitHandler = (point) => {
    this.#changeData(
      UserPointAction.ADD,
      UpdateType.MINOR,
      point,
    );
    this.#enableButton();
  }

  setSaving = () => {
    this.#editPointComponent.updateStateWithRerender({
      isDisabled: true,
      isSaving: true,
    });
    this.#editPointComponent.disableInputs();
  }

  setAborting = () => {
    this.#editPointComponent.shake(this.#removePointState);
  }

  #removePointState = () => {
    this.#editPointComponent.updateStateWithRerender({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }
}

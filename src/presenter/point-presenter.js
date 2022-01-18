import {isEsc} from '../utils/utils';
import {render, replace, remove} from '../utils/render-utils';

import {RenderPosition, Mode, UserPointAction, UpdateType} from '../consts';

import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};


export default class PointPresenter {
  #container = null;
  #point = null;
  #mode = Mode.DEFAULT;

  #destinations = null;
  #names = null
  #types = null;
  #offers = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;

  #changeData = null;
  #changeMode = null;

  constructor(container, changeData, changeMode, destinations, offers, types, names) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    this.#destinations = destinations;
    this.#offers = offers;
    this.#names = names;
    this.#types = types;
  }

  init = (point) => {
    this.#point = point;

    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point);
    this.#editPointComponent = new EditPointView(point, this.#destinations, this.#offers, this.#types, this.#names);

    this.#pointComponent.setClickHandler(this.#openButtonClickHandler);
    this.#pointComponent.setFavoriteClickHandler(this.#favoriteToggleHandler);

    this.#editPointComponent.setClickHandler(this.#closeButtonClickHandler);
    this.#editPointComponent.setSubmitHandler(this.#formSubmitHandler);
    this.#editPointComponent.setDeleteHandler(this.#pointDeleteHandler);

    this.#render();
  }

  #render = () => {
    if (this.#prevPointComponent === null || this.#prevEditPointComponent === null) {
      render(this.#container, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      // console.log(this.#pointComponent);//TODO подумать
      replace(this.#pointComponent, this.#prevPointComponent);
    }

    if (this.#mode === Mode.EDIT) {
      // replace(this.#editPointComponent, this.#prevEditPointComponent); //TODO подумать
      // console.log(this.#pointComponent);//TODO подумать
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

  #formEscHandler = (evt) => {
    if (isEsc(evt.code)) {
      this.#closeEditPoint();
    }
  }

  #openEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#editPointComponent.restoreHandlers(); // TODO не самое лучшее решение
    document.addEventListener('keydown', this.#formEscHandler);
    this.#changeMode();
    this.#mode = Mode.EDIT;
  }

  #closeEditPoint = () => {
    this.#editPointComponent.reset(this.#point);
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#formEscHandler);
    this.#mode = Mode.DEFAULT;
  }

  #openButtonClickHandler = () => {
    this.#openEditPoint();
  }

  #closeButtonClickHandler = () => {
    this.#closeEditPoint();
  }

  #formSubmitHandler = (point) => {
    this.#changeData(
      UserPointAction.UPDATE,
      UpdateType.MINOR,
      point, // TODO еще подумать надо
    );
  }

  #pointDeleteHandler = (point) => {
    this.#changeData(
      UserPointAction.DELETE,
      UpdateType.MAJOR,
      point,
    );
  }

  #favoriteToggleHandler = () => {
    this.#changeData(
      UserPointAction.UPDATE,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  }

  setViewState = (state) => {
    const resetState = () => {
      this.#editPointComponent.updateStateWithRerender({
        isDeleting: false,
        isDisabled: false,
        isSaving: false,
      });
    };

    switch (state) {
      case State.DELETING:
        this.#editPointComponent.updateStateWithRerender({
          isDeleting: true,
          isDisabled: true,
        });
        this.#editPointComponent.disableInputs();
        break;
      case State.SAVING:
        this.#editPointComponent.updateStateWithRerender({
          isSaving: true,
          isDisabled: true,
        });
        this.#editPointComponent.disableInputs();
        break;
      case State.ABORTING:
        this.#editPointComponent.disableInputs();
        this.#editPointComponent.shake(resetState);
        this.#pointComponent.shake();
        break;
    }
  }
}

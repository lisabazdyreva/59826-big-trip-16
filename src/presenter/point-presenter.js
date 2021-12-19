import {isEsc} from '../utils/utils';
import {render, replace, remove} from '../utils/render-utils';

import {RenderPosition, Mode} from '../consts';

import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';


export default class PointPresenter {
  #container = null;
  #point = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;

  #changeData = null;
  #changeMode = null;

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point);
    this.#editPointComponent = new EditPointView(point);

    this.#pointComponent.setClickHandler(this.#openEditPointForm);
    this.#pointComponent.setFavoriteClickHandler(this.#toggleFavoriteFlag);

    this.#editPointComponent.setClickHandler(this.#closeEditPointForm);
    this.#editPointComponent.setSubmitHandler(this.#submitForm);

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
      replace(this.#editPointComponent, this.#prevEditPointComponent);
    }


    remove(this.#prevPointComponent);
    remove(this.#prevEditPointComponent);

  }

  // removePointComponent = () => {
  //   remove(this.#pointComponent);
  //   remove(this.#editPointComponent);
  // }// TODO закомментировала, чтобы линтер не ругался

  resetMode = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeEditPointForm();
    }
  }

  #formEscHandler = (evt) => {
    if (isEsc(evt.code)) {
      this.#closeEditPointForm();
    }
  }

  #openEditPointForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#formEscHandler);
    this.#changeMode();
    this.#mode = Mode.EDIT;
  }

  #closeEditPointForm = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#formEscHandler);
    this.#mode = Mode.DEFAULT;
  }

  #submitForm = () => {
    this.#closeEditPointForm();
  }

  #toggleFavoriteFlag = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  }
}

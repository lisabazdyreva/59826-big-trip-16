import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import {isEsc} from '../utils/utils';
import {render, replace, remove} from '../utils/render-utils';
import {RenderPosition} from '../consts';

export default class PointPresenter {
  #container = null;
  #point = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;

  #changeData = null;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init = (point) => {
    this.#point = point;

    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point);
    this.#editPointComponent = new EditPointView(point);

    this.#pointComponent.setClickHandler(this.#buttonOpenClickHandler);
    this.#pointComponent.setFavoriteClickHandler(this.#buttonSetFavoriteHandler);

    this.#editPointComponent.setClickHandler(this.#buttonCloseClickHandler);
    this.#editPointComponent.setSubmitHandler(this.#formSubmitHandler);

    this.#render();
  }

  #render = () => {
    if (this.#prevPointComponent === null || this.#prevEditPointComponent === null) {
      render(this.#container, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#container.element.contains(this.#prevPointComponent.element)) {
      replace(this.#pointComponent, this.#prevPointComponent);
    }

    if (this.#container.element.contains(this.#prevEditPointComponent.element)) {
      replace(this.#editPointComponent, this.#prevEditPointComponent);
    }

    remove(this.#prevPointComponent);
    remove(this.#prevEditPointComponent);
  }

  removePoint = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  #formEscHandler = (evt) => {
    if (isEsc(evt.code)) {
      replace(this.#pointComponent, this.#editPointComponent);
      document.removeEventListener('keydown', this.#formEscHandler);
    }
  }

  #buttonOpenClickHandler = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#formEscHandler);
  }

  #buttonCloseClickHandler = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#formEscHandler);
  }

  #formSubmitHandler = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#formEscHandler);
  }

  #buttonSetFavoriteHandler = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  }
}

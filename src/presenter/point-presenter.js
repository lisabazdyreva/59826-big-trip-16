import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import {isEsc} from '../utils/utils';
import {render, replace} from '../utils/render-utils';
import {RenderPosition} from '../consts';

export default class PointPresenter {
  #container = null;
  #point = null;

  #pointComponent = null;
  #editPointComponent = null;

  constructor(container) {
    this.#container = container;
  }

  init = (point) => {
    this.#point = point;

    this.#pointComponent = new PointView(point);
    this.#editPointComponent = new EditPointView(point);

    this.#pointComponent.setClickHandler(this.#buttonOpenClickHandler);

    this.#editPointComponent.setClickHandler(this.#buttonCloseClickHandler);
    this.#editPointComponent.setSubmitHandler(this.#formSubmitHandler);

    render(this.#container, this.#pointComponent, RenderPosition.BEFOREEND);

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
}

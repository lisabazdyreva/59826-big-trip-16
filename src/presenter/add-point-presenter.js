import EditPointView from '../view/edit-point-view';
import {RenderPosition, UpdateType, UserPointAction} from '../consts';
import {remove, render} from '../utils/render-utils';
import {isEsc} from '../utils/utils';
import {getRandomInteger} from '../utils/mock-utils';

export default class AddPointPresenter {
  #container = null;
  #editPointComponent = null;
  #changeData = null;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init = () => {
    this.#editPointComponent = new EditPointView();

    this.#render();

    this.#editPointComponent.setSubmitHandler(this.#formSubmitHandler);
    this.#editPointComponent.setDeleteHandler(this.#deleteFormHandler);
    document.addEventListener('keydown', this.#formEscHandler);
  }

  #render = () => {
    render(this.#container, this.#editPointComponent, RenderPosition.AFTERBEGIN);
  }

  #remove = () => {
    if (this.#editPointComponent === null ) {
      return;
    }

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#formEscHandler);
  }

  #formEscHandler = (evt) => {
    if (isEsc(evt.code)) {
      this.#deleteFormHandler();
    }
  }

  #deleteFormHandler = () => {
    this.#remove();
    document.removeEventListener('keydown', this.#formEscHandler);
  }

  #formSubmitHandler = (point) => {
    this.#changeData(
      UserPointAction.ADD,
      UpdateType.MAJOR, // TODO можно минор, если инфо компонент перенести
      {id: getRandomInteger(1, 10000), ...point},
    );
    this.#remove();
  }
}

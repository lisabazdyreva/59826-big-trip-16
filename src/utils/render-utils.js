import {RenderPosition} from '../consts';
import AbstractView from '../view/abstract-view';


const getElement = (component) => component instanceof AbstractView ? component.element : component;

const render = (container, element, position) => {

  const parent = getElement(container);
  const child = getElement(element);

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    default:
      parent.append(child);
      break;
  }
};

const replace = (to, from) => {
  if (to === null || from === null) {
    throw new Error('Can not replace empty elements');
  }

  const newChild = getElement(to);
  const oldChild = getElement(from);
  const parent = oldChild.parentElement;

  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (component instanceof AbstractView) {
    component.element.remove();
    component.removeElement();
  } else {
    throw new Error('Can remove only components');
  }
};

export {render, replace, remove};

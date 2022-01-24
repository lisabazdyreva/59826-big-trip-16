import AbstractObservable from '../utils/abstract-observable';
import {DefaultValue} from '../consts';


export default class MenuModel extends AbstractObservable {
  #activeMenuTab = DefaultValue.MENU;

  setActiveMenuTab = (updateType, activeMenuTab) => {
    this.#activeMenuTab = activeMenuTab;
    this._notify(updateType, activeMenuTab);
  }

  get activeMenuTab() {
    return this.#activeMenuTab;
  }
}

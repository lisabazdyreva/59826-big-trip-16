import AbstractObservable from '../utils/abstract-observable';
import {MenuTab} from '../consts';


export default class MenuModel extends AbstractObservable {
  #activeMenuTab = MenuTab.TABLE;

  setActiveMenuTab = (updateType, activeMenuTab) => {
    this.#activeMenuTab = activeMenuTab;
    this._notify(updateType, activeMenuTab);
  }

  get activeMenuTab() {
    return this.#activeMenuTab;
  }
}

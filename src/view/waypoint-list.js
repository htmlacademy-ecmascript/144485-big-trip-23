import {createElement} from '../render.js';

const creatWaypointList = () => '<ul class="trip-events__list"></ul>';

export default class WaypointList{
  getTemplate(){
    return creatWaypointList();
  }

  getElement(){
    if(!this.element){
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement(){
    this.element = null;
  }
}


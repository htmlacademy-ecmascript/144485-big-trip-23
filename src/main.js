import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';

const pointsModel = new PointsModel();

const presenter = new Presenter({
  pointsModel
});
presenter.init();

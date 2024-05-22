import Presenter from './presenter/presenter.js';
import PresenterWaypoint from './presenter/presenter-waypoint.js';
import PointsModel from './model/points-model.js';

const pointsModel = new PointsModel();

const waypoint = new PresenterWaypoint({
  pointsModel,
});

const presenter = new Presenter({
  pointsModel,
});

presenter.init();
waypoint.init();

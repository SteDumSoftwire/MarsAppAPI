import {getPhotos, getRovers} from "../Controllers/RoverController";

const express = require('express')

export const roversRouter = express.Router()

roversRouter.get('/', getRovers);
roversRouter.get('/:rover/camera/:camera', getPhotos);
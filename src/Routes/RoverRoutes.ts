import {getPhotos, getRovers} from "../Controllers/APIControllerService";

const express = require('express')

export const roversRouter = express.Router()

roversRouter.get('/', getRovers);
roversRouter.get('/:rover/camera/:camera', getPhotos);
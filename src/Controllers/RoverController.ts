import {fetch_rovers} from "../Services/NasaFetchService";
import {mergeRequests} from "../Services/RoverServices"

export enum CAMERAS {
    "FHAZ" = "Front Hazard Avoidance Camera",
    "RHAZ" = "Rear Hazard Avoidance Camera",
    "MAST" = "Mast Camera",
    "CHEMCAM" = "Chemistry and Camera Complex",
    "MAHLI" = "Mars Hand Lens Imager",
    "MARDI" = "Mars Descent Imager",
    "NAVCAM" = "Navigation Camera",
    "PANCAM" =  "Panoramic Camera",
    "MINITES" = "Miniature Thermal Emission Spectrometer (Mini-TES)"
}

enum VALID_ROVERS {CURIOSITY = "curiosity", SPIRIT = "spirit", OPPORTUINITY = "opportunity", PERSEVERANCE = "perseverance"}

export const getRovers = (req, res) => {
    fetch_rovers()
        .then(data => res.send(data))
        .catch(err => res.send(err))
}

export const getPhotos = async (req, res) => {
    try {
        if (!(req.params.rover in VALID_ROVERS) || !(req.params.cameras in CAMERAS)) {
            throw new Error('Incorrect rover name');
        }
        res.send(JSON.stringify(mergeRequests(req.params.rover, req.params.camera, req.query.sol,
            req.query.paginationStart, req.query.paginationEnd)));
    } catch(err) {
        res.send(err.message);
    }
}
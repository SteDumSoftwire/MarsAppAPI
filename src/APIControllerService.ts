import {fetch_rovers, fetch_photos} from "./NasaFetchService";

enum Cameras {
    "FHAZ"= "Front Hazard Avoidance Camera",
    "RHAZ" = "Rear Hazard Avoidance Camera",
    "MAST" = "Mast Camera",
    "CHEMCAM" = "Chemistry and Camera Complex",
    "MAHLI" = "Mars Hand Lens Imager",
    "MARDI" = "Mars Descent Imager",
    "NAVCAM" = "Navigation Camera",
    "PANCAM" =  "Panoramic Camera",
    "MINITES" = "Miniature Thermal Emission Spectrometer (Mini-TES)"
}

const rovers = ["curiosity", "spirit", "opportunity", "perseverance"]

type Photo = {
    id: number;
    img_src: string;
    rover: string;
    camera: string;
    date: string;
}

export const getRovers = (req, res) => {
    fetch_rovers()
        .then(data => res.send(data))
        .catch(err => console.log(err))
}

export const getPhotos = async (req, res) => {
    let photos: Array<Photo> = []
    try {
        if (!rovers.includes(req.params.rover)) {
            throw new Error('Incorrect rover name');
        }
        let pages = await fetch_photos(req.params.rover, req.params.camera, req.query.sol, req.query.paginationStart,
            req.query.paginationEnd)
        for (let page of pages) {
            photos.push(...trim_photos_json(page));
        }
        res.send(JSON.stringify(photos));
    } catch(err) {
        res.send(err.message);
    }
}

function trim_photos_json(data: any): Array<Photo> {
    let photos: Array<Photo> = []
    for(let photo of data["photos"]) {
        photos.push({
            id: photo["id"],
            rover: photo["rover"]["name"],
            camera: Cameras[photo["camera"]["name"]],
            img_src: photo["img_src"],
            date: photo["earth_date"]
        });
    }
    return photos;
}
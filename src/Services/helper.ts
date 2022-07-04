import {CAMERAS} from "../Controllers/RoverController";
import {Photo} from "../Models/RoverModels";

export function trim_photos_json(data: any): Array<Photo> {
    let photos: Array<Photo> = []
    data["photos"].map((photo) => {
        photos.push({
            id: photo["id"],
            rover: photo["rover"]["name"],
            camera: CAMERAS[photo["camera"]["name"]],
            img_src: photo["img_src"],
            date: photo["earth_date"]
        })
    })
    return photos;
}
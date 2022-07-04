import {fetch_photos} from "./NasaFetchService";
import {trim_photos_json} from "./helper";
import {Photo} from "../Models/RoverModels"

export const mergeRequests = async (rover: string, camera: string, sol: number,
                          paginationStart: number, paginationEnd: number) => {
    let photos: Array<Photo> = []
    let pages = await fetch_photos(rover, camera, sol, paginationStart, paginationEnd)
    for (let page of pages) {
        photos.push(...trim_photos_json(page));
    }
    return photos;
}
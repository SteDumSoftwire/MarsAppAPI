import {Request, Response} from "express";

type Photo = {
    id: number;
    img_src: string;
    rover: string;
    camera: string;
    date: string;
}

const cameras = {
    "FHAZ": "Front Hazard Avoidance Camera",
    "RHAZ": "Rear Hazard Avoidance Camera",
    "MAST": "Mast Camera",
    "CHEMCAM": "Chemistry and Camera Complex",
    "MAHLI": "Mars Hand Lens Imager",
    "MARDI": "Mars Descent Imager",
    "NAVCAM": "Navigation Camera",
    "PANCAM": "Panoramic Camera",
    "MINITES": "Miniature Thermal Emission Spectrometer (Mini-TES)"
}
const api_key = 'AE6PQe4KnsgG31lrRRxR95iGh8X6ZTyLjHturFwr'

const express = require('express')
const app = express();
const axios = require('axios');
const port = 8000;

app.use(express.json());
const router = express.Router();
app.use('/', router);

router.get('/test', (req: Request, res: Response) => res.send('Hello world !'));
router.get('/rovers', (req, res) => {
    fetch_rovers()
        .then(data => res.send(data))
        .catch(err => console.log(err))
    }
);
router.get('/rovers/:rover/camera/:camera', async (req, res) => {
    let photos: Array<Photo> = []
    try {
        let pages = await fetch_photos(req.params.rover, req.params.camera, req.query.sol, req.query.paginationStart,
            req.query.paginationEnd)
        for (let page of pages) {
            photos.push(...trim_photos_json(page));
        }
        res.send(JSON.stringify(photos));
    } catch(err) {
        res.send(err.message);
    }
})

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});

async function fetch_rovers() {
    return axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=' + api_key)
        .then(res => res.data)
}

async function fetch_photos(rover: string, camera: string, sol: number, paginationStart: number, paginationEnd: number) {
    sol = sol == null ? 1000: sol
    let requestArray = []
    let data = []
    if (paginationStart == null || paginationEnd == null) {
        throw new Error('Send paginationStart and paginationEnd params ')
    }
    for (let page = paginationStart; page <= paginationEnd; page++) {
        requestArray.push(axios.get(
            'https://api.nasa.gov/mars-photos/api/v1/rovers/' + rover + '/photos',
            {
                params: {
                    api_key: api_key,
                    camera: camera,
                    sol: sol,
                    page: page
                }
            }))
    }
    await Promise.all(requestArray).then((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
            data.push(res[i].data);
        }
    });
    return data;
}

function trim_photos_json(data: any): Array<Photo> {
    let photos: Array<Photo> = []
    for(let photo of data["photos"]) {
        photos.push({
            id: photo["id"],
            rover: photo["rover"]["name"],
            camera: cameras[photo["camera"]["name"]],
            img_src: photo["img_src"],
            date: photo["earth_date"]
        });
    }
    return photos;
}
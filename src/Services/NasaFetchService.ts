const axios = require('axios');

const API_KEY = 'AE6PQe4KnsgG31lrRRxR95iGh8X6ZTyLjHturFwr'
const API_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/'

export async function fetch_photos(rover: string, camera: string, sol: number = 1000, paginationStart: number, paginationEnd: number) {
    let requestArray = []
    let data = []
    for (let page = paginationStart; page <= paginationEnd; page++) {
        requestArray.push(axios.get(
            API_URL + rover + '/photos',
            {
                params: {
                    api_key: API_KEY,
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

export async function fetch_rovers() {
    return axios.get(API_URL, {
        params: {
            api_key: API_KEY
        }
    }).then(res => res.data)
}
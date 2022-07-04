const axios = require('axios');

const api_key = 'AE6PQe4KnsgG31lrRRxR95iGh8X6ZTyLjHturFwr'

export async function fetch_photos(rover: string, camera: string, sol: number, paginationStart: number, paginationEnd: number) {
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

export async function fetch_rovers() {
    return axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=' + api_key)
        .then(res => res.data)
}
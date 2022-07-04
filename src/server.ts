import {roversRouter} from "./Routes/RoverRoutes";

const express = require('express')
const app = express();
const port = 8000;

app.use(express.json());
app.use('/rovers', roversRouter);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});


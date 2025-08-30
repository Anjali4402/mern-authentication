
import {app } from './app.js';



// server listening Port or backend run port
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})
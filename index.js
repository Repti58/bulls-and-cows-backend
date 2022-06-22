const express = require('express');
const cors = require('cors');

const PORT = process.env.port || 3002;
const message = 'Здесь могла быть ваша реклама'
const app = express();
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})

app.get('/api', (req, res) => {
    
    res.json({
        message: message
    })
})
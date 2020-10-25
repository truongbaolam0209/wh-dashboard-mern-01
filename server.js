const express = require('express');
const connectDB = require('./config/db');

const app = express();


connectDB();
app.use(express.json({ extended: false }));


app.use('/api/records', require('./routes/api/records'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
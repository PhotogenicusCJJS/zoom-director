const express = require('express')
const path = require('path');
const databaseController = require('./controllers/databaseController');
// const cookieParser = require('cookie-parser');

const databaseRouter = require('./routes/database');


const app = express();
const PORT = 3000;


//  Parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use('/database', databaseRouter);

app.get('/assignedRoom/:studentId', databaseController.getAssignedRoom, (req, res) => {
    const { roomUrl } = res.locals;

    if(roomUrl) {
        res.redirect(roomUrl)
    } else {
        const message = '<p>Sorry, you currently are not assigned to a room. Please try again later.</p>'
        res.send(message)
    }
});

//  Handle all unknown request
app.use('*', (req, res) => {
    res.status(404).send('Not Found');
});


//  listen to PORT
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
});

//  Global Error Handler
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 404,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

module.exports = app;

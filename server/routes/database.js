const express = require('express');

const databaseController = require('../controllers/databaseController');

const router = express.Router();

/************************************************/
////////////////  route: /events ////////////////
/************************************************/


//  handle create events request 
router.post('/events',
    databaseController.createEvent,
    (req, res) => res.sendStatus(200));

//  handle get all events request 
router.get('/events',
    databaseController.getAllEvents,
    (req, res) => res.status(200).json(res.locals.events));

//  handle update event request
router.put('/events',
    databaseController.changeEvent,
    (req, res) => res.sendStatus(200));


/************************************************/
////////////  route: /studentsevents ////////////
/************************************************/


//  handle assign students to event request
router.post('/studentsevents',
    databaseController.assignStudentsEvents,
    databaseController.getRooms,
    (req, res) => res.status(200).json(res.locals.rooms));

//  handle get all assigned events of a student request
router.get('/studentsevents/:studentId',
    databaseController.getStudentAllEvents,
    (req, res) => res.status(200).json(res.locals.events));


/************************************************/
///////////////  route: /students ////////////////
/************************************************/


//  handle get request that ask for students from a cohort, will return all students if no id Id is specified
router.get('/students/:cohortId?',
    databaseController.getCohortStudents,
    (req, res) => res.status(200).json(res.locals.students));


/************************************************/
////////////////  route: /cohorts ////////////////
/************************************************/

//  handle get request that ask for a list of all cohort
router.get('/cohorts',
    databaseController.getCohorts,
    (req, res) => res.status(200).json(res.locals.cohorts));


/************************************************/
/////////////////  route: /rooms /////////////////
/************************************************/

//  handle get request that ask for all the rooms that are not assigned
router.get('/rooms',
    databaseController.getRooms,
    (req, res) => res.status(200).json(res.locals.rooms));


/************************************************/
////////////  route: /cohortstudents  ////////////
/************************************************/

//  handle get request that ask for all the students separated by cohort
router.get('/CohortStudents',
    databaseController.getAllCohortStudents,
    (req, res) => res.status(200).json(res.locals.users));




module.exports = router;
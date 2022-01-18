const db = require('../models/databaseModels');

const databaseController = {};


//helper function for mutiple insert query for user_events
const multipleInsertQuery = async (query, data, next) => {
    //  Iterate over students Ids 
    for (let i = 0; i < data.studentIds.length; i++) {
        //  Create the data that we would like to insert
        const item = [data.eventId.id, data.roomId.id, data.studentIds[i].user_id]

        //  make the insert query to the database with data we created above
        await db
            .query(query, item)
            .catch(error => {
                console.log('error at multipleInsertQuery', error);
                return next({
                    log: 'Express error handler caught in database middleware error',
                    message: { err: 'An error occurred' }
                });
            });
    }
    next();
};

/************************************************/
//////////////////  for: /events /////////////////
/************************************************/


//  Insert event into the event table
databaseController.createEvent = (req, res, next) => {
    //  Get the event title and start time from requeset
    const { title , start_time } = req.body;

    //  compute the end time, which is default to be an hour
    let end_time = new Date(start_time); 
    end_time.setHours(end_time.getHours() + 1);
    end_time = end_time.toUTCString();

    //  Create the query statement
    const insertEvent = 'INSERT INTO events (title, start_time, end_time) VALUES ($1, $2, $3) RETURNING *';

    //  Make query to the database, call next if succeed
    db.query(insertEvent, [title, start_time, end_time])
        .then(() => next())
        .catch(error => {
            console.log('error at databaseControllers.createEvent', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}

//  Get all events data from the database
databaseController.getAllEvents = (req, res, next) => {
    //  Create the query statement
    const getEvents = 'SELECT id, title FROM events';

    //  Make query to the database, store the returning events in locals if query succeeds
    db.query(getEvents)
        .then(response => {
            res.locals.events = response.rows;
            next();
        })
        .catch(error => {
            console.log('error at databaseControllers.getAllEvents', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}

//  Update event
databaseController.changeEvent = (req, res, next) => {
    //  Destructure and store eventID, value and action from req body
    const { eventId, value, action } = req.body;

    //  Create the query statement

    const updateEvent = `UPDATE events SET ${action} = $1 WHERE id = $2`;

    //  Make query to the database, call next if query succeeds
    db.query(updateEvent, [value, eventId])
        .then(() => next())
        .catch(error => {
            console.log('error at databaseController.changeEvent', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}


/************************************************/
//////////////  for: /studentsevents /////////////
/************************************************/


//  Insert in users_events all the students we want to assign with the corresponding event
databaseController.assignStudentsEvents = (req, res, next) => {
    //  Destructure and store the three Ids
    const { studentIds, eventId, roomId } = req.body;
    // console.log('REQ', req.body);

    //  Create the query statement
    const insertStudentsEvents = 'INSERT INTO users_events (event_id, room_id, user_id) VALUES ($1, $2, $3)';

    //  Make insert queries to the database
    multipleInsertQuery(insertStudentsEvents, { studentIds, eventId, roomId }, next);
}

//  Get all the events that are assigned to a particular student
databaseController.getStudentAllEvents = (req, res, next) => {
    //  Store student id
    const studentId = req.params.studentId;

    //  Create the query statement
    const getStudentEvents = 'SELECT e.* FROM events e INNER JOIN users_events u ON e.id = u.event_id WHERE u.user_id = $1';

    //  make the query, store the response in locals if succeed
    db.query(getStudentEvents, [studentId])
        .then(response => {
            res.locals.events = response.rows;
            next();
        })
        .catch(error => {
            console.log('error at databaseController.getStudentAllEvents', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}


/************************************************/
/////////////////  for: /students ////////////////
/************************************************/


//  Get all students from a particular Cohort, return all student if cohort id is not specified
databaseController.getCohortStudents = (req, res, next) => {
    //  Store the cohort id
    const cohortId = req.params.cohortId;
    // console.log('id', cohortId);

    //  Create the query statement
    let getCohortStudents = 'SELECT u.id, u.first_name, u.last_name FROM cohorts c INNER JOIN users u ON c.id = u.cohort_id';

    //  If cohort Id is given to us, query only the students from that cohort
    if (cohortId !== undefined){
        getCohortStudents += ` WHERE c.id = ${cohortId}`;
    }

    // console.log(getCohortStudents);
    //  Make query to the database, store the returning student array in locals if query succeeds
    db.query(getCohortStudents)
        .then(response => {
            res.locals.students = response.rows;
            next();
        })
        .catch(error => {
            console.log('error at databaseControllers.getCohortStudents', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}


/************************************************/
/////////////////  for: /cohorts /////////////////
/************************************************/


//  Get all cohorts
databaseController.getCohorts = (req, res, next) => {
    //  Create the query statement
    const getCohort = 'SELECT * FROM cohorts';

    //  Make query to the database, store the returning cohorts array in locals if query succeeds
    db.query(getCohort)
        .then(response => {
            res.locals.cohorts = response.rows;
            next();
        })
        .catch(error => {
            console.log('error at databaseController.getCohorts', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}


/************************************************/
//////////////////  for: /rooms //////////////////
/************************************************/


//  Get all the rooms that are available for assignment
databaseController.getRooms = (req, res, next) => {
    //  Create the query statement
    const getRooms = 'SELECT id, name FROM rooms WHERE id NOT IN (SELECT DISTINCT(room_id) FROM users_events)';

    /*  
        Query for rooms available for a particular event within a given time 
    
        SELECT r.* FROM rooms r WHERE r.id NOT IN (SELECT ue.room_id FROM users_events ue 
        INNER JOIN events e ON ue.event_id = e.id 
        WHERE e.start_time <= (SELECT e.start_time FROM events e WHERE e.id = 12) 
        AND e.end_time >= (SELECT e.start_time FROM events e WHERE e.id = 12))
        
    */

    //  Make query to the database, store the returning cohorts array in locals if query succeeds
    db.query(getRooms)
        .then(response => {
            res.locals.rooms = response.rows;
            next();
        })
        .catch(error => {
            console.log('error at databaseController.getCohorts', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}


/************************************************/
////////////  route: /cohortStudents  ////////////
/************************************************/


//  Get all students and categorize them by cohort
databaseController.getAllCohortStudents = (req, res, next) => {
    //  Create the query statement
    const getAllChortStudents = 'SELECT u.id AS user_id, u.first_name, u.last_name, c.name AS cohort_name, c.id AS cohort_id FROM cohorts c INNER JOIN users u ON c.id = u.cohort_id';

    //  Make query to the database
    db.query(getAllChortStudents)
        .then(response => {
            //  Construct the Object that is needed by front end
            const users = {};
            for (let i = 0; i < response.rows.length; i++) {
                if (!users.hasOwnProperty(response.rows[i].cohort_id)) {
                    users[response.rows[i].cohort_id] = {
                        users: [],
                        cohort_name: response.rows[i].cohort_name
                    };
                }
                users[response.rows[i].cohort_id].users.push({
                    user_id: response.rows[i].user_id, 
                    first_name: response.rows[i].first_name, 
                    last_name: response.rows[i].last_name
                });
            }
            res.locals.users = users;
            next();
        })
        .catch(error => {
            console.log('error at databaseController.getAllCohortStudents', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}


databaseController.getAssignedRoom = (req, res, next) => {
    const { studentId } = req.params

    const findRoom = "SELECT zoom_url FROM rooms  \
        WHERE id = (SELECT room_id FROM users_events \
        JOIN users on users.id = user_id  \
        and user_id = $1 limit 1); "


    db.query(findRoom, [studentId])
        .then((data) => {
            let roomUrl = null

            if(data.rows.length > 0){
                roomUrl = data.rows[0].zoom_url
            }

            res.locals = { roomUrl }

            next();
        })
        .catch(error => {
            console.log('error at databaseControllers.createEvent', error);
            return next({
                log: 'Express error handler caught in database middleware error',
                message: { err: 'An error occurred' }
            });
        });
}

module.exports = databaseController;
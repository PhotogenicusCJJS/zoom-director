import React, { useEffect, useState } from 'react';

const AssignContainer = () => {

// here we will have dropdowns: cohort, student, event

// box will populate with the selected student name once all three dropdowns have inputs

// confirm button 

  const [cohorts, setCohorts] = useState([])
  const [students, setStudents] = useState([]);
  const [cohortStudents, setCohortStudents] = useState({});
  const [events, setEvents] = useState([]);
  const [rooms, setRooms] = useState([]);
  
  const [addedStudents, setAddedStudents] = useState([]);
  const [addedEvent, setAddedEvent] = useState({});
  const [addedRoom, setAddedRoom] = useState({});

  const [textMsg, setTextMsg] = useState('');

  useEffect( () => {

    fetch('/database/CohortStudents')
      .then(res => res.json())
      .then( data => {
        console.log('COHORTSTUDENTS', data);
        setData(data);
      })
      .catch(err => console.log('AssignContainer: get cohorts: ERROR: ', err));

    fetch('/database/cohorts')
      .then(res => res.json())
      .then( (data) => {
        console.log("COHORTS", data);
        setCohorts(data);
      })
      .catch(err => console.log('AssignContainer: get cohorts: ERROR: ', err));

    // setCohorts([{id: 5, name: 'FTRI', number: 5},
    //   {id: 6, name: 'FTRI', number: 6},
    //   {id: 7, name: 'FTRI', number: 7}]);


    fetch('/database/events')
      .then(res => res.json())
      .then( (data) => {
        console.log("EVENTS", data);
        setEvents(data);
      })
      .catch(err => console.log('AssignContainer: get events: ERROR: ', err));
    // setEvents([{id: 1, title: 'Pair Programming', start_time: '', end_time: ''},
              // {id: 2, title: 'Lecture', start_time: '', end_time: ''}]);          
    
    
    fetch('/database/rooms')
      .then(res => res.json())
      .then( (data) => {
        console.log("ROOMS", data);
        setRooms(data);
      })
      .catch(err => console.log('AssignContainer: get rooms: ERROR: ', err));
    // setRooms([{id: 1, name: 'Room 1'},
    //   {id: 2, name: 'Room 2'},
    //   {id: 3, name: 'Room 3'}]) 

  }, [])

  useEffect( () => {
    setAddedEvent(events[0]);
  }, [events])

  /*useEffect( () => {
    fetch('database/students/' + e.target.value)
      .then(res => res.json())
      .then( (data) => {
        setStudents(data);
      })
      .catch(err => console.log('AssignContainer: get students: ERROR: ', err));
    // setStudents([{id: 1, first_name: 'Elmo', last_name: '5'}, 
    //   {id: 2, first_name: 'Oscar', last_name: '5'}, 
    //   {id: 3, first_name: 'Big Bird', last_name: '5'}]);
  }, [cohorts])*/

  useEffect( () => {
    setAddedRoom(rooms[0]);
  }, [rooms])



  //==================================FUNCTIONS==================================
  const setData = (data) => {
    console.log('INSIDE', data);
    setCohortStudents(data);

    const cohorts = [];
    for (let key in data) {
      cohorts.push({id: key, name: data[key].cohort_name});
    }
    console.log('after setting', cohorts);
    setCohorts(cohorts);
  }
  
  
  const loadStudents = (e) => {

    const cohortID = e.target.value;

    for (let key in cohortStudents) {
      if (cohortID === key) {
        setStudents(cohortStudents[key].users)
      }
    }

    /*fetch('/database/students/' + e.target.value)
      .then(res => res.json())
      .then( (data) => {
        console.log("Students",data);
        setStudents(data);
      })
      .catch(err => console.log('AssignContainer: get students: ERROR: ', err));*/

    // if (e.target.value === '5')
    //   setStudents([{id: 1, first_name: 'Elmo', last_name: '5'}, 
    //                 {id: 2, first_name: 'Oscar', last_name: '5'}, 
    //                 {id: 3, first_name: 'Big Bird', last_name: '5'}]);
    // else if (e.target.value === '6')
    //   setStudents([{id: 4, first_name: 'Zoe', last_name: '6'},
    //                 {id: 5, first_name: 'Grover', last_name: '6'}]);
    // else if (e.target.value === '7')
    //   setStudents([{id: 6, first_name: 'Bert', last_name: '7'},
    //                 {id: 7, first_name: 'Ernie', last_name: '7'}]);
  }
  
  const selectStudents = (e) => {
    const studentID = e.target.value;
    let studentObj = {};
    
    for (let elem of students) {
      if (elem.user_id == studentID) {
        console.log(studentID, elem.user_id)
        studentObj = {user_id: elem.user_id, 
                      first_name: elem.first_name,
                      last_name: elem.last_name};
      }
    }
    
    setAddedStudents([...addedStudents, studentObj]);
  }

  const addAllStudents = (e) => {
    setAddedStudents([...addedStudents, ...students]);
  }

  const clearStudents = () => {
    setAddedStudents([]);
  }

  const selectEvent = (e) => {
    const eventID = Number(e.target.value);
    let eventObj = {};
    for (let i = 0; i < events.length; i++) {
      if (events[i].id === eventID) {
        eventObj = {id: events[i].id,
                    title: events[i].title,
                    start_time: events[i].start_time,
                    end_time: events[i].end_time};
        break;
      }
    }
    setAddedEvent(eventObj);
  }

  const selectRoom = (e) => {
    const roomID = Number(e.target.value);
    console.log(roomID);
    let roomObj = {};
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomID) {
        roomObj = {id: rooms[i].id,
                    name: rooms[i].name};
        break;
      }
    }
    setAddedRoom(roomObj);
  }

  const show = () => {
    setTextMsg(`Students to be added: ${addedStudents.map( elem => `${elem.first_name} ${elem.last_name}`)} 
                with this event: ${addedEvent.title} in the room: ${addedRoom.name}`);
  }

  const handleSubmit = (e) => {
    show();

    e.preventDefault();

    fetch('/database/studentsevents', {
      method: 'POST',
      body: JSON.stringify({ 
        studentIds: addedStudents, 
        eventId: addedEvent,
        roomId: addedRoom
       }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(data => data.json())
      .then(data => {
        console.log('AFTER ASSIGN', data);
        setEvents(data);
      })
      .catch(err => console.log('handleSubmit: ERROR: ', err));
  }


  
  //==================================RETURN DIV==================================

  return (
    <div>
      <h2> Event Assigner </h2>
      
      <div className='event-dropdown'>
        <div>
          <label>Cohort:</label>
          <div className='select-container'>
            <select selected={cohorts[0]} size="1" onChange={loadStudents}>
              {cohorts.map(elem => {
                  return <option value={elem.id}>{`${elem.name}`}</option>
                })}
            </select>
          </div>
        </div>

        <div>
          <label>Students:</label>
          <div className='select-container'>
            <select size="1" onChange={selectStudents}>
              {students.map(elem => {
                  return <option value={elem.user_id}>{`${elem.first_name} ${elem.last_name}`}</option>
              })}
            </select>
          </div>
          <div>
            <button onClick={addAllStudents}>
                ADD ALL
            </button>
          </div>
        </div>

        <div>
          <label>Events:</label>
          <div className='select-container' >
            <select size="1" selected={events[0]} onChange={selectEvent}>
              {events.map(elem => {
                  return <option value={elem.id}>{elem.title}</option>
              })}
            </select>
          </div>
        </div>

        <div>
          <label>Rooms:</label>
          <div className='select-container' >
            <select size="1" selected={rooms[0]} onChange={selectRoom}>
              {rooms.map(elem => {
                  return <option value={elem.id}>{elem.name}</option>
              })}
            </select>
          </div>
        </div>

      </div>


      <div className='event-add'>

        <textarea value={addedStudents.map( elem => `${elem.first_name} ${elem.last_name}`)} />

        <div>
          <button onClick={clearStudents}>
              CLEAR
          </button>
        </div>

        <div>
          <button onClick={handleSubmit} >
              ASSIGN EVENT
          </button>
        </div>
      </div>

      <div>
        {textMsg}
      </div>

    </div>
  )
}


export default AssignContainer;
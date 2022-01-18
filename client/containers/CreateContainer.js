import React, { useState } from 'react';

import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


import { registerLocale } from "react-datepicker";
import enUS from 'date-fns/locale/en-US';
registerLocale('en-US', enUS);

// Import calendar
// Select date, maybe time

// "Type of Event" --> lecture, all hands, pair program, mentor/mentee

// Confirm button

const CreateContainer = () => {

  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');

  const [textMsg, setTextMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/database/events', {
      method: 'POST',
      body: JSON.stringify({ 
        title: title, 
        start_time: date,
       }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(data => {
        setTextMsg(`Event to be added: ${title} 
                with this date: ${date}`);
      })
      .catch(err => console.log('CreateContainer.handleSubmit: ERROR: ', err));
  }

  return (
    <div>

      <h2> Create Event</h2>

      <div className='event-dropdown'>

        <div className='select-container'>
          <div>
            <DatePicker placeholderText="Pick a date" style={{marginRight: "10px", width: "50px"}} 
              selected={date} onChange={date => setDate(date)}
              showTimeSelect
              dateFormat="MM/dd/yyyy  EE hh:mm a"
              locale="en-US"
              monthsShown="2"
            />
          </div>

          <div>
            <button onClick={handleSubmit}>
                ADD EVENT
            </button>
          </div>
        </div>

        <div className='select-container'>
          <div>
            <input className='strictly-text' type='text' onChange={e => setTitle(e.target.value)}></input>
          </div>
        </div>

      </div>

      <div>
        {textMsg}
      </div>

    </div>
    
  )
}

export default CreateContainer;


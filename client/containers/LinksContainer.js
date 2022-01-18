import React, { useEffect, useState } from 'react';

const filePath = (studentName) => {
  const normalName = studentName.toLowerCase().replace(/[^A-Za-z0-9]/g, "")
  return `./admin/images/${normalName}.jpg`
}

const LinksContainer = () => {

  const [students, setStudents] = useState([]);

  useEffect( () => {

    fetch('/database/students')
      .then(res => res.json())
      .then( (data) => {
        console.log("Students",data);
        setStudents(data);
      })
      .catch(err => console.log('LinksContainer: get students: ERROR: ', err));

    // setStudents([{user_id: 119, first_name: 'Telly'},
    //               {user_id: 120, first_name: 'Zoe'}])
  }, [])

  return (
    <div className='table-style'>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Student name</th>
            <th>Student Link</th>
          </tr>
        </thead>
        <tbody>
          {students.map( st => (
            <tr>
              <td>
                <img className='avatar' src={filePath(st.first_name)} alt="avatar"/></td>
              <td>{st.first_name}</td>
              <td><a href={"http://localhost:3000/assignedRoom/" + st.id} rel="noreferrer" target="_blank">{"http://localhost:3000/assignedRoom/" + st.id}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LinksContainer;
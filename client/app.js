import React from 'react';
import { connect } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';
import styles from './static/style.css'

import Admin from "./components/Admin";
import AssignContainer from './containers/AssignContainer';
import CreateContainer from './containers/CreateContainer';
import ViewContainer from './containers/ViewContainer';
import LinksContainer from './containers/LinksContainer';


const App = (props) => (
  <div id="app">
    <div className="headerRow">
      <div>
        <img src='./admin/images/cs_logo.png' height='50' width='50' style={{verticalAlign: 'baseline'}}></img>
      </div>
      <div>
        <h1 id="header">
          <span className="csBlue">Codesmith</span> Zoom Director
        </h1>
      </div>
    </div>
    
    <ul className="header">
      <li><Link to='create'>CREATE EVENT</Link></li>
      <li><Link to='assign'>ASSIGN EVENT</Link></li>
      <li><Link to='view'>VIEW ADMIN</Link></li>
      <li><Link to='links'>STUDENT LINKS</Link></li>
    </ul>

    <Routes>
      <Route path='/create' element={<CreateContainer/>} />
      <Route path='/assign' element={<AssignContainer/>} />
      <Route path='/view' element={<ViewContainer/>}/>
      <Route path='/links' element={<LinksContainer/>}/>
    </Routes>

  </div>
  
)


export default App;
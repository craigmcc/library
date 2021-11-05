import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";

import AuthorsView from "./components/authors/AuthorsView";
import HomeView from "./components/general/HomeView";
import Navigation from './components/general/Navigation';
import LibrariesView from "./components/libraries/LibrariesView";
import {LibraryContextProvider} from "./components/libraries/LibraryContext";
import {LoginContextProvider} from "./components/login/LoginContext";
import SeriesView from "./components/series/SeriesView";
import StoriesView from "./components/stories/StoriesView";
import UsersView from "./components/users/UsersView";
import VolumesView from "./components/volumes/VolumesView";

ReactDOM.render(
  <React.StrictMode>
      <LoginContextProvider>
          <LibraryContextProvider>
              <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<Navigation/>}>
                          <Route path="authors" element={<AuthorsView/>}/>
                          <Route path="libraries" element={<LibrariesView/>}/>
                          <Route path="series" element={<SeriesView/>}/>
                          <Route path="stories" element={<StoriesView/>}/>
                          <Route path="users" element={<UsersView/>}/>
                          <Route path="volumes" element={<VolumesView/>}/>
                          <Route path="" element={<HomeView/>}/>
                      </Route>
                  </Routes>
              </BrowserRouter>
          </LibraryContextProvider>
      </LoginContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

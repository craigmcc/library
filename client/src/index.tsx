import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";

import AuthorSegment from "./components/authors/AuthorSegment";
import HomeView from "./components/general/HomeView";
import Navigation from './components/general/Navigation';
import LibrariesView from "./components/libraries/LibrariesView";
import {LibraryContextProvider} from "./components/libraries/LibraryContext";
import {LoginContextProvider} from "./components/login/LoginContext";
import SeriesSegment from "./components/series/SeriesSegment";
import StoriesView from "./components/stories/StoriesView";
import UsersView from "./components/users/UsersView";
import VolumeSegment from "./components/volumes/VolumeSegment";

ReactDOM.render(
  <React.StrictMode>
      <LoginContextProvider>
          <LibraryContextProvider>
              <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<Navigation/>}>
                          <Route path="authors" element={<AuthorSegment/>}/>
                          <Route path="libraries" element={<LibrariesView/>}/>
                          <Route path="series" element={<SeriesSegment/>}/>
                          <Route path="stories" element={<StoriesView/>}/>
                          <Route path="users" element={<UsersView/>}/>
                          <Route path="volumes" element={<VolumeSegment/>}/>
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

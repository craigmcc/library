import React from 'react';
import ReactDOM from 'react-dom';
import {ReactNotifications} from "react-notifications-component";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications-component/dist/theme.css";

import AuthorSegment from "./components/authors/AuthorSegment";
import HomeView from "./components/general/HomeView";
import Navigation from './components/general/Navigation';
import GoogleBooksSegment from "./components/google-books/GoogleBooksSegment";
import {LibraryContextProvider} from "./components/libraries/LibraryContext";
import LibrarySegment from "./components/libraries/LibrarySegment";
import {LoginContextProvider} from "./components/login/LoginContext";
import SeriesSegment from "./components/series/SeriesSegment";
import StorySegment from "./components/stories/StorySegment";
import UserSegment from "./components/users/UserSegment";
import VolumeSegment from "./components/volumes/VolumeSegment";

ReactDOM.render(
      <LoginContextProvider>
          <LibraryContextProvider>
              <ReactNotifications/>
              <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<Navigation/>}>
                          <Route path="authors" element={<AuthorSegment/>}/>
                          <Route path="browse-google" element={<GoogleBooksSegment/>}/>
                          <Route path="libraries" element={<LibrarySegment/>}/>
                          <Route path="series" element={<SeriesSegment/>}/>
                          <Route path="stories" element={<StorySegment/>}/>
                          <Route path="users" element={<UserSegment/>}/>
                          <Route path="volumes" element={<VolumeSegment/>}/>
                          <Route path="" element={<HomeView/>}/>
                      </Route>
                  </Routes>
              </BrowserRouter>
          </LibraryContextProvider>
      </LoginContextProvider>
    ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

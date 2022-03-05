// App -----------------------------------------------------------------------

// Overall user interface implementation.

// External Modules ----------------------------------------------------------

import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications-component/dist/theme.css";

// Internal Modules ----------------------------------------------------------

import AuthorSegment from "./components/authors/AuthorSegment";
import {LibraryContextProvider} from "./components/libraries/LibraryContext";
import {LoginContextProvider} from "./components/login/LoginContext";
import HomeView from "./components/general/HomeView";
import Navigation from "./components/general/Navigation";
import GoogleBooksSegment from "./components/google-books/GoogleBooksSegment";
import LibrarySegment from "./components/libraries/LibrarySegment";
import SeriesSegment from "./components/series/SeriesSegment";
import StorySegment from "./components/stories/StorySegment";
import UserSegment from "./components/users/UserSegment";
import VolumeSegment from "./components/volumes/VolumeSegment";

// Component Details ---------------------------------------------------------

function App() {
    return (
        <LoginContextProvider>
            <LibraryContextProvider>
                <Router>
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
                </Router>
            </LibraryContextProvider>
        </LoginContextProvider>

    )
}

export default App;

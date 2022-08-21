// App -----------------------------------------------------------------------

// Overall user interface implementation.

// External Modules ----------------------------------------------------------

import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import AuthorView from "./components/authors/AuthorView";
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
        <>
        <ToastContainer
            autoClose={5000}
            closeOnClick={true}
            draggable={false}
            hideProgressBar={false}
            newestOnTop={false}
            position="top-right"
            theme="colored"
        />
        <LoginContextProvider>
            <LibraryContextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigation/>}>
                            <Route path="authors" element={<AuthorView/>}/>
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
        </>
    )
}

export default App;

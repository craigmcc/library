// App -----------------------------------------------------------------------

// Overall user interface implementation.

// External Modules ----------------------------------------------------------

import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import {Store} from "./Store";
import AuthorView from "./components/authors/AuthorView";
import {LibraryContextProvider} from "./components/libraries/LibraryContext";
import {LoginContextProvider} from "./components/login/LoginContext";
import HomeView from "./components/general/HomeView";
import Navigation from "./components/general/Navigation";
import GoogleBooksSegment from "./components/google-books/GoogleBooksSegment";
import LibraryView from "./components/libraries/LibraryView";
import SeriesView from "./components/series/SeriesView";
import StoryView from "./components/stories/StoryView";
import UserView from "./components/users/UserView";
import VolumeView from "./components/volumes/VolumeView";

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
            <Provider store={Store}>
                <LoginContextProvider>
                    <LibraryContextProvider>
                        <Router>
                            <Routes>
                                <Route path="/" element={<Navigation/>}>
                                    <Route path="authors" element={<AuthorView/>}/>
                                    <Route path="browse-google" element={<GoogleBooksSegment/>}/>
                                    <Route path="libraries" element={<LibraryView/>}/>
                                    <Route path="series" element={<SeriesView/>}/>
                                    <Route path="stories" element={<StoryView/>}/>
                                    <Route path="users" element={<UserView/>}/>
                                    <Route path="volumes" element={<VolumeView/>}/>
                                    <Route path="" element={<HomeView/>}/>
                                </Route>
                            </Routes>
                        </Router>
                    </LibraryContextProvider>
                </LoginContextProvider>
            </Provider>
        </>
    )
}

export default App;

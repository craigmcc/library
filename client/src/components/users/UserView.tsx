// UserView ---------------------------------------------------------------

// Top-level view for managing User objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import UserForm from "./UserForm";
import UserList from "./UserList";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import MutatingProgress from "../shared/MutatingProgress";
import {HandleAction, HandleUser, Scope} from "../../types";
import useMutateUser from "../../hooks/useMutateUser";
import User from "../../models/User";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const UserView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<User>(new User());
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateUser = useMutateUser({
        alertPopup: false,
    });

    useEffect(() => {


        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        setCanInsert(isSuperuser || isAdmin);
        setCanRemove(isSuperuser);
        setCanUpdate(isSuperuser || isAdmin);
        logger.info({
            context: "UserView.useEffect",
            isAdmin: isAdmin,
            isSuperuser: isSuperuser,
            user: Abridgers.USER(user),
            view: view.toString(),
        });

    }, [libraryContext.library,
        loginContext, loginContext.data.loggedIn,
        user, view]);

    // Create an empty User to be added
    const handleAdd: HandleAction = () => {
        const theUser = new User({
            active: true,
            googleBooksApiKey: null,
            name: null,
            password: null,
            scope: null,
            username: null,
        });
        logger.debug({
            context: "UserView.handleAdd",
            user: theUser,
        });
        setUser(theUser);
        setView(View.DETAILS);
    }

    // Handle selection of a User to edit details
    const handleEdit: HandleUser = (theUser) => {
        logger.info({
            context: "UserView.handleEdit",
            user: Abridgers.USER(theUser),
        });
        setUser(theUser);
        setView(View.DETAILS);
    }

    // Handle insert of a new User
    const handleInsert: HandleUser = async (theUser) => {
        setMessage(`Inserting User '${theUser.username}'`);
        const inserted = await mutateUser.insert(theUser);
        logger.debug({
            context: "UserView.handleInsert",
            user: Abridgers.USER(inserted),
        })
        setView(View.OPTIONS);
    }

    // Handle remove of an existing User
    const handleRemove: HandleUser = async (theUser) => {
        setMessage(`Removing User '${theUser.username}'`);
        const removed = await mutateUser.remove(theUser);
        logger.debug({
            context: "UserView.remove",
            user: Abridgers.USER(removed),
        });
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.debug({
            context: "UserView.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to update an existing User
    const handleUpdate: HandleUser = async (theUser) => {
        setMessage(`Updating User '${theUser.username}'`);
        const updated = await mutateUser.update(theUser);
        logger.debug({
            context: "UserView.handleUpdate",
            user: Abridgers.USER(updated),
        })
        setView(View.OPTIONS);
    }

    return (
        <>

            <MutatingProgress
                error={mutateUser.error}
                executing={mutateUser.executing}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <UserForm
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    user={user}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <UserList
                    handleAdd={canInsert ? handleAdd : undefined}
                    handleEdit={canUpdate ? handleEdit : undefined}
                />
            ) : null }

        </>
    )

}

export default UserView;

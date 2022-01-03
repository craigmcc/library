// GoogleBooksOptions --------------------------------------------------------

// List results from the Google Books API that match specified query criteria.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import LoadingProgress from "../general/LoadingProgress";
import Pagination from "../general/Pagination";
import SearchBar from "../general/SearchBar";
import {HandleAction, HandleValue} from "../../types";
import useFetchGoogleBooks from "../../hooks/useFetchGoogleBooks";
import useFetchMe from "../../hooks/useFetchMe";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const GoogleBooksOptions = (props: Props = {}) => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    const fetchMe = useFetchMe();
    const fetchGoogleBooks = useFetchGoogleBooks({
        alertPopup: false,
        apiKey: fetchMe.me.googleBooksApiKey,
        limit: pageSize,
        query: searchText,
        offset: (currentPage - 1) * pageSize,
    });

    useEffect(() => {
        logger.debug({
            context: "GoogleBooksOptions.useEffect",
            currentPage: currentPage,
            pageSize: pageSize,
            searchText: searchText,
        });
    }, [currentPage, pageSize, searchText]);

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleSearchText: HandleValue = (theSearchText) => {
        logger.debug({
            context: "GoogleBooksOptions.handleSearchText",
            searchText: theSearchText,
        });
        setSearchText(theSearchText);
    }

    return (
        <Container fluid id="GoogleBooksOptions">

            <LoadingProgress
                error={fetchGoogleBooks.error}
                loading={fetchGoogleBooks.loading}
                title="Selected Google Books"
            />

            <Row className="mb-3">
                <Col className="col-8">
                    <SearchBar
                        autoFocus
                        handleValue={handleSearchText}
                        htmlSize={50}
                        label="Search Terms:"
                        placeholder="Enter Google Books query terms"
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={false}
                        variant="secondary"
                    />
                </Col>
            </Row>

            <Row>
                <pre>
                    {JSON.stringify(fetchGoogleBooks.books, null, 2)}
                </pre>
            </Row>

        </Container>
    )

}

export default GoogleBooksOptions;

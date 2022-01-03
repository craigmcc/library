// GoogleBooksOptions --------------------------------------------------------

// List results from the Google Books API that match specified query criteria.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import LoadingProgress from "../general/LoadingProgress";
import TextField from "../general/TextField";
import Pagination from "../general/Pagination";
import {HandleAction} from "../../types";
import useFetchGoogleBooks from "../../hooks/useFetchGoogleBooks";
import GoogleVolumes from "../../models/GoogleVolumes";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    apiKey: string;                     // API key for Google Books
}

// Component Details ---------------------------------------------------------

type Data = {
    searchText: string;
}

const GoogleBooksOptions = (props: Props) => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    const fetchGoogleBooks = useFetchGoogleBooks({
        alertPopup: false,
        apiKey: props.apiKey,
        limit: pageSize,
        query: searchText,
        offset: (currentPage - 1) * pageSize,
    });

    const onNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const onPrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const onSubmit: SubmitHandler<Data> = (values) => {
        logger.debug({
            context: "GoogleBooksOptions.onSubmit",
            searchText: values.searchText,
        });
        setSearchText(values.searchText);
    }

    const position = (): string => {
        const offset = (currentPage - 1) * pageSize;
        return `Books ${offset + 1}-${offset + pageSize} of ${fetchGoogleBooks.volumes.totalItems}`;
    }

    const {formState: {errors}, handleSubmit, register} = useForm<Data>({
        defaultValues: { searchText: "" },
        mode: "onBlur",
    });

    return (
        <Container fluid id="GoogleBooksOptions">

            <LoadingProgress
                error={fetchGoogleBooks.error}
                loading={fetchGoogleBooks.loading}
                title="Fetching Google Books"
            />

            <Row className="mb-3">
                <Col className="text-center">
                    <span><strong>Browse Google Books</strong></span>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className="col-1">
                    <span className="form-label">Search Terms:</span>
                </Col>
                <Col className="col-8">
                    <Form id="GoogleBooksForm"
                          noValidate
                          onSubmit={handleSubmit(onSubmit)}
                    >
                        <TextField
                            autoFocus
                            errors={errors}
                            name="searchText"
                            placeholder="Enter Google Books query terms"
                            register={register}
                        />
                    </Form>
                </Col>
                <Col>
                    {position()}
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={onNext}
                        handlePrevious={onPrevious}
                        lastPage={false}
                        variant="secondary"
                    />
                </Col>
            </Row>

            <Row>
                <pre>
                    {JSON.stringify(fetchGoogleBooks.volumes, null, 2)}
                </pre>
            </Row>

        </Container>
    )

}

export default GoogleBooksOptions;

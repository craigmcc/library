// GoogleBooksOptions --------------------------------------------------------

// List results from the Google Books API that match specified query criteria.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {SubmitHandler, useForm} from "react-hook-form";
import {CheckBox, Pagination, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import FetchingProgress from "../shared/FetchingProgress";
import {HandleAction, HandleBoolean} from "../../types";
import useFetchGoogleBooks from "../../hooks/useFetchGoogleBooks";
import GoogleVolume from "../../models/GoogleVolume";
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
    const [newest, setNewest] = useState<boolean>(false);
    const [pageSize] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    const fetchGoogleBooks = useFetchGoogleBooks({
        alertPopup: false,
        apiKey: props.apiKey,
        limit: pageSize,
        newest: newest,
        offset: (currentPage - 1) * pageSize,
        query: searchText,
    });

    const authors = (volume: GoogleVolume): string => {
        let result = "";
        if (volume.volumeInfo?.authors) {
            result = volume.volumeInfo.authors.join(" | ");
        }
        return result;
    }

    // Return the src link for a Volume image, or undefined if none
    const imageLink = (volume: GoogleVolume): string | undefined => {
        const imageLinks = volume.volumeInfo?.imageLinks;
        if (imageLinks) {
            if (imageLinks.smallThumbnail) {
                return imageLinks.smallThumbnail;
            } else if (imageLinks.thumbnail) {
                return imageLinks.thumbnail;
            }
        }
        return undefined;
    }

    // Return the href link for an information tab or window, or undefined if none
    const infoLink = (volume: GoogleVolume): string | undefined => {
        if (volume.volumeInfo?.infoLink) {
            return volume.volumeInfo.infoLink;
        }
        return undefined;
    }

    const onNewest: HandleBoolean = (theNewest) => {
        setNewest(theNewest);
    }

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

    const pageCount = (volume: GoogleVolume): string | undefined => {
        if (volume.volumeInfo?.pageCount) {
            return "" + volume.volumeInfo.pageCount;
        } else {
            return undefined;
        }
    }

    const position = (): string => {
        const offset = (currentPage - 1) * pageSize;
        return `Books ${offset + 1}-${offset + pageSize} of ${fetchGoogleBooks.volumes.totalItems}`;
    }

    // Return the href link for a preview tab or window, or undefined if none
    const previewLink = (volume: GoogleVolume): string | undefined => {
        if (volume.volumeInfo?.previewLink) {
            return volume.volumeInfo.previewLink;
        }
        return undefined;
    }

    // Return the publisher, or undefined if none
    const publisher = (volume: GoogleVolume): string | undefined => {
        if (volume.volumeInfo?.publisher) {
            return volume.volumeInfo.publisher;
        } else {
            return undefined;
        }
    }

    const {formState: {errors}, handleSubmit, register} = useForm<Data>({
        defaultValues: { searchText: "" },
        mode: "onBlur",
    });

    return (
        <Container fluid id="GoogleBooksOptions">

            <FetchingProgress
                error={fetchGoogleBooks.error}
                loading={fetchGoogleBooks.loading}
                message="Fetching Google Books"
            />

            <Row className="mb-3">
                <Col className="text-center">
                    <span><strong>Browse Google Books</strong></span>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col className="col-1">
                    <span className="form-label">Search Terms:</span>
                </Col>
                <Col className="col-7">
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
                    <CheckBox
                        handleChange={onNewest}
                        label="Sort by Newest?"
                        name="sortByNewest"
                        value={newest}
                    />
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

            <Row className="g-2">
                <Table
                    bordered
                    hover
                    size="sm"
                    striped
                >

                    <thead>
                        <tr className="table-secondary">
                            <th scope="col">Title</th>
                            <th scope="col">Authors</th>
                            <th scope="col">Description</th>
                            <th scope="col">Published</th>
                        </tr>
                    </thead>

                    <tbody>
                    {fetchGoogleBooks.volumes?.items?.map((volume, vi) => (
                        <tr className="table-default" key={`GBI-R${vi}`}>
                            <td>
                                <p><strong>{volume.volumeInfo?.title}</strong></p>
                                {(imageLink(volume) !== undefined) ? (
                                    <Image
                                        src={imageLink(volume)}
                                    />
                                ) : null}
                            </td>
                            <td>
                                <p>{authors(volume)}</p>
                                {(infoLink(volume) !== undefined) ? (
                                    <p>
                                        <a href={infoLink(volume)}
                                           rel="noopener noreferrer"
                                           target="_blank">More Info</a>
                                    </p>
                                ) : null}
                                {(previewLink(volume) !== undefined) ? (
                                    <a href={previewLink(volume)}
                                       rel="noopener noreferrer"
                                       target="_blank">Preview</a>
                                ) : null}
                            </td>
                            <td>
                                <p>{volume.volumeInfo?.description}</p>
                                <p>
                                    {(publisher(volume) !== undefined) ? (
                                        <span>Publisher: <i>{publisher(volume)}</i></span>
                                    ) : null}
                                    {(pageCount(volume) !== undefined) ? (
                                        <span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;Pages: {pageCount(volume)}
                                        </span>
                                    ) : null}
                                </p>
                            </td>
                            <td>
                                {volume.volumeInfo?.publishedDate}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

{/*
            <Row>
                <pre>
                    {JSON.stringify(fetchGoogleBooks.volumes, null, 2)}
                </pre>
            </Row>
*/}

        </Container>
    )

}

export default GoogleBooksOptions;

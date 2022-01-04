// GoogleVolume --------------------------------------------------------------

// Representation of an individual volume from the Google Books API

// See:  https://developers.google.com/books/docs/v1/reference/volumes#resource

// Public Objects ------------------------------------------------------------

// Image link types
type ImageLinkType = "extraLarge" | "large" | "medium" | "small" | "smallThumbnail" | "thumbnail";

// Image link for available image
type ImageLinks = {
    [type in ImageLinkType]: string;    // type --> URI mapping
};

// Industry identifier types
type IndustryIdentifierType = "ISBN_10" | "ISBN_13" | "ISSN" | "OTHER";

// Industry standard identifiers
type IndustryIdentifier = {
    identifier?: string;                // Industry specific volume identifier
    type?: IndustryIdentifierType;      // Identifier type
}

// Search result information related to this volume
type SearchInfo = {
    textSnippet?: string;               // A text snippet containing the search query
}

// General volume information
type VolumeInfo = {
    authors?: string[];                 // List of author names
    categories?: string[];              // Subject categories
    contentVersion?: string;            // Identifier for the version of the volume content
    description?: string;               // Synopsis of this volume (formatted simple HTML)
    industryIdentifiers: IndustryIdentifier[]; // Industry standard identifiers
    imageLinks?: ImageLinks;            // Links to images in various sizes
    infoLink: string;                   // URL to info on Google Books site
    language?: string;                  // ISO 639-1 language code
    pageCount?: number;                 // Total number of pages
    previewLink?: string;               // URL to preview on Google Books site
    publishedDate?: string;             // Date of publication (YYYY-MM-DD)
    publisher?: string;                 // Publisher of this volume
    subtitle?: string;                  // Volume subtitle
    title?: string;                     // Volume title
}

class GoogleVolume {
    id?: string;                        // Unique identifier for this volume
    kind?: string;                      // books#volume
    searchInfo?: SearchInfo;            // Search result information related to this volume
    selfLink?: string;                  // URL to this API resource
    volumeInfo?: VolumeInfo;            // General volume information
}

export default GoogleVolume;

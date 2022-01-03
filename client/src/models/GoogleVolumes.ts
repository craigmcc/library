// GoogleVolumes -------------------------------------------------------------

// Representation of a collection of volumes from the Google Books API.

// See:  https://developers.google.com/books/docs/v1/reference/volumes#resource

// Internal Modules ----------------------------------------------------------

import GoogleVolume from "./GoogleVolume";

// Public Objects ------------------------------------------------------------

class GoogleVolumes {
    items?: GoogleVolume[];             // List of (paginated) volumes
    kind?: string;                      // books#volumes
    totalItems?: number;                // Total items matching query
}

export default GoogleVolumes;

// VolumeApi -----------------------------------------------------------------

// Redux Toolkit Query API for Volume models.

// External Modules ----------------------------------------------------------

import {createApi} from "@reduxjs/toolkit/query/react";

// Internal Modules ----------------------------------------------------------

import {paginationParams, Parent, VOLUME} from "../../types";
import Author, {AUTHORS_BASE} from "../../models/Author";
import Library, {LIBRARIES_BASE} from "../../models/Library";
import Story, {STORIES_BASE} from "../../models/Story";
import Volume, {VOLUMES_BASE} from "../../models/Volume";
import {apiBaseQuery} from "../../util/ApiUtil";
import {queryParameters} from "../../util/QueryParameters";
import * as Sorters from "../../util/Sorters";
import * as ToModel from "../../util/ToModel";

// Parameter Types ----------------------------------------------------------

export interface allVolumesParams
    extends includeVolumeParams, matchVolumeParams, paginationParams {
    parent: Parent;                     // Parent object of these Volumes
}

export interface allVolumeAuthorsParams /* extends includeAuthorParams, matchAuthorParams */ {
    libraryId: number;                  // ID of the parent Library
    volumeId: number;                   // ID of the requested Volume
}

export interface allVolumeStoriesParams /* extends includeStoryParams, matchStoryParams */ {
    libraryId: number;                  // ID of the parent Library
    volumeId: number;                   // ID of the requested Volume
}

export interface associateVolumeStoryParams {
    libraryId: number;                  // ID of the parent Library
    storyId: number;                    // ID of the associated Story
    volumeId: number;                   // ID of the associated Volume
}

export interface disassociateVolumeStoryParams {
    libraryId: number;                  // ID of the parent Library
    storyId: number;                    // ID of the associated Story
    volumeId: number;                   // ID of the associated Volume
}

export interface exactVolumeParams {
    libraryId: number;                  // ID of the parent Library
    name: string;                       // Exact match on name
    params?: includeVolumeParams;       // Other parameters
}

export interface findVolumeParams {
    libraryId: number;                  // ID of the parent Library
    params?: includeVolumeParams;       // Other parameters
    volumeId: number;                   // ID of the requested Volume
}

export interface includeVolumeParams {
    withAuthors?: boolean;              // Include related Authors
    withLibrary?: boolean;              // Include parent Library
    withStories?: boolean;              // Include related Stories
}

export interface matchVolumeParams {
    active?: boolean;                   // Select active Volumes
    googleId?: string;                  // Select Volumes on matching googleId
    isbn?: string;                      // Select Volumes on matching isbn
    location?: string;                  // Select Volumes on matching location
    name?: string;                      // Select Volumes on wildcard name match
    type?: string;                      // Select Volumes on matching type
}

export interface removeVolumeParams {
    libraryId: number;                  // ID of the parent Library
    volumeId: number;                   // ID of the Volume to remove
}

export interface updateVolumeParams {
    libraryId: number;                  // ID of the parent Library
    volumeId: number;                   // ID of the Volume to update
    volume: Partial<Volume>;            // Volume properties to update
}

// Public Objects ------------------------------------------------------------

export const VolumeApi = createApi({
    baseQuery: apiBaseQuery(),
    endpoints: (builder) => ({
        allVolumeAuthors: builder.query<Author[], allVolumeAuthorsParams>({
            // TODO: providesTags?
            query: (params) =>
                `${VOLUMES_BASE}/${params.libraryId}/${params.volumeId}/authors`,
        }),
        allVolumeStories: builder.query<Story[], allVolumeStoriesParams>({
            // TODO: providesTags?
            query: (params) =>
                `${VOLUMES_BASE}/${params.libraryId}/${params.volumeId}/stories`,
        }),
        allVolumes: builder.query<Volume[], allVolumesParams>({
            // TODO: providesTags?
            // Build query URL based on instanceof Parent
            query: (params) => {
                const parent = ToModel.PARENT(params.parent);
                const libraryId = (parent instanceof Library)
                    ? parent.id : parent.libraryId;
                let url = `${LIBRARIES_BASE}/${libraryId}${VOLUMES_BASE}`;
                if (parent instanceof Author) {
                    url = `${AUTHORS_BASE}/${libraryId}/${params.parent.id}${VOLUMES_BASE}`;
                } else if (parent instanceof Story) {
                    url = `${STORIES_BASE}/${libraryId}/${params.parent.id}${VOLUMES_BASE}`;
                }
                return url + queryParameters(params);
            },
            // Sort child authors and stories if present
            transformResponse: (results: Volume[]) => {
                const transforms: Volume[] = [];
                results.forEach(volume => {
                    let transform = new Volume(volume);
                    if (transform.authors && (transform.authors.length > 0)) {
                        transform.authors = Sorters.AUTHORS(transform.authors);
                    }
                    if (transform.stories && (transform.stories.length > 0)) {
                        transform.stories = Sorters.STORIES(transform.stories);
                    }
                    transforms.push(transform);
                });
                return transforms;
            }
        }),
        associateVolumeStory: builder.mutation<Story, associateVolumeStoryParams>({
            // TODO: tag impacts?
            query: (params) => ({
                method: "POST",
                url: `${VOLUMES_BASE}/${params.libraryId}/${params.volumeId}/stories/${params.storyId}`,
            }),
        }),
        disassociateVolumeStory: builder.mutation<Story, disassociateVolumeStoryParams>({
            // TODO: tag impacts?
            query: (params) => ({
                method: "DELETE",
                url: `${VOLUMES_BASE}/${params.libraryId}/${params.volumeId}/stories/${params.storyId}`,
            }),
        }),
        exactVolume: builder.query<Volume, exactVolumeParams>({
            providesTags: (result, error, arg) => [
                { type: VOLUME, id: `exact:${arg.name}` },
            ],
            query: (params) =>
                `${VOLUMES_BASE}/${params.libraryId}/exact/${params.name}${queryParameters(params.params)}`,
        }),
        findVolume: builder.query<Volume, findVolumeParams>({
            providesTags: (result, error, arg) => [
                { type: VOLUME, id: arg.volumeId }
            ],
            query: (params) =>
                `${VOLUMES_BASE}/${params.libraryId}/${params.volumeId}`,
        }),
        insertVolume: builder.mutation<Volume, Partial<Volume>>({
            invalidatesTags: [
                { type: VOLUME, id: "ALL" }
            ],
            query: (volume) => ({
                body: volume,
                method: "POST",
                url: `${VOLUMES_BASE}/${volume.libraryId}`,
            }),
        }),
        removeVolume: builder.mutation<Volume, removeVolumeParams>({
            invalidatesTags: (result, error, params) => [
                { type: VOLUME, id: "ALL" },
                { type: VOLUME, id: params.volumeId }
            ],
            query: (params) => ({
                method: "DELETE",
                url: `${VOLUMES_BASE}/${params.libraryId}/${params.volumeId}`,
            }),
        }),
        updateVolume: builder.mutation<Volume, updateVolumeParams>({
            invalidatesTags: (result, error, params) => [
                { type: VOLUME, id: "ALL" },
                { type: VOLUME, id: params.volumeId }
            ],
            query: (params) => ({
                body: params.volume,
                method: "PUT",
                url: `${VOLUMES_BASE}/${params.libraryId}/${params.volumeId}`,
            }),
        }),
    }),
    reducerPath: "volumes",
    tagTypes: [ VOLUME ],
});

export const {
    useAllVolumeAuthorsQuery,
    useAllVolumeStoriesQuery,
    useAllVolumesQuery,
    useAssociateVolumeStoryMutation,
    useDisassociateVolumeStoryMutation,
    useExactVolumeQuery,
    useFindVolumeQuery,
    useInsertVolumeMutation,
    useRemoveVolumeMutation,
    useUpdateVolumeMutation,
} = VolumeApi;

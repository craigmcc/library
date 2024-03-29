--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_tokens (
    id integer NOT NULL,
    expires timestamp with time zone NOT NULL,
    scope text NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.access_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.access_tokens_id_seq OWNED BY public.access_tokens.id;


--
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    library_id integer NOT NULL,
    notes text
);


--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: authors_series; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_series (
    author_id integer NOT NULL,
    series_id integer NOT NULL,
    principal boolean DEFAULT false NOT NULL
);


--
-- Name: authors_stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_stories (
    author_id integer NOT NULL,
    story_id integer NOT NULL,
    principal boolean DEFAULT false NOT NULL
);


--
-- Name: authors_volumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_volumes (
    author_id integer NOT NULL,
    volume_id integer NOT NULL,
    principal boolean DEFAULT false NOT NULL
);


--
-- Name: libraries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.libraries (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    name text NOT NULL,
    notes text,
    scope text NOT NULL
);


--
-- Name: libraries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.libraries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: libraries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.libraries_id_seq OWNED BY public.libraries.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    access_token text NOT NULL,
    expires timestamp with time zone NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: series; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.series (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    copyright text,
    library_id integer NOT NULL,
    name text NOT NULL,
    notes text
);


--
-- Name: series_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.series_id_seq OWNED BY public.series.id;


--
-- Name: series_stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.series_stories (
    series_id integer NOT NULL,
    story_id integer NOT NULL,
    ordinal integer
);


--
-- Name: stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    copyright text,
    library_id integer NOT NULL,
    name text NOT NULL,
    notes text
);


--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    scope text NOT NULL,
    username text NOT NULL,
    google_books_api_key text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: volumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volumes (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    copyright text,
    google_id text,
    isbn text,
    library_id integer NOT NULL,
    location text,
    name text NOT NULL,
    notes text,
    read boolean DEFAULT false NOT NULL,
    type text NOT NULL
);


--
-- Name: volumes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.volumes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: volumes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.volumes_id_seq OWNED BY public.volumes.id;


--
-- Name: volumes_stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volumes_stories (
    story_id integer NOT NULL,
    volume_id integer NOT NULL
);


--
-- Name: access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_tokens ALTER COLUMN id SET DEFAULT nextval('public.access_tokens_id_seq'::regclass);


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: libraries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libraries ALTER COLUMN id SET DEFAULT nextval('public.libraries_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: series id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series ALTER COLUMN id SET DEFAULT nextval('public.series_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: volumes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes ALTER COLUMN id SET DEFAULT nextval('public.volumes_id_seq'::regclass);


--
-- Name: access_tokens access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_tokens
    ADD CONSTRAINT access_tokens_pkey PRIMARY KEY (id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: authors_series authors_series_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT authors_series_pkey PRIMARY KEY (author_id, series_id);


--
-- Name: authors_stories authors_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories
    ADD CONSTRAINT authors_stories_pkey PRIMARY KEY (author_id, story_id);


--
-- Name: authors_volumes authors_volumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT authors_volumes_pkey PRIMARY KEY (author_id, volume_id);


--
-- Name: libraries libraries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libraries
    ADD CONSTRAINT libraries_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (id);


--
-- Name: series_stories series_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories
    ADD CONSTRAINT series_stories_pkey PRIMARY KEY (series_id, story_id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: volumes volumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes
    ADD CONSTRAINT volumes_pkey PRIMARY KEY (id);


--
-- Name: volumes_stories volumes_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories
    ADD CONSTRAINT volumes_stories_pkey PRIMARY KEY (volume_id, story_id);


--
-- Name: access_tokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX access_tokens_token_key ON public.access_tokens USING btree (token);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: series_library_id_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX series_library_id_name_key ON public.series USING btree (library_id, name);


--
-- Name: stories_library_id_last_name_first_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX stories_library_id_last_name_first_name_key ON public.authors USING btree (library_id, last_name, first_name);


--
-- Name: stories_library_id_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX stories_library_id_name_key ON public.stories USING btree (library_id, name);


--
-- Name: uk_libraries_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_libraries_name ON public.libraries USING btree (name);


--
-- Name: uk_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_users_username ON public.users USING btree (username);


--
-- Name: uk_volumes_library_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_volumes_library_id_name ON public.volumes USING btree (library_id, name);


--
-- Name: access_tokens access_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_tokens
    ADD CONSTRAINT access_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors authors_library_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_library_id_fkey FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_series authors_series_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT authors_series_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_series authors_series_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT authors_series_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_stories authors_stories_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories
    ADD CONSTRAINT authors_stories_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_stories authors_stories_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories
    ADD CONSTRAINT authors_stories_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_volumes authors_volumes_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT authors_volumes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_volumes authors_volumes_volume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT authors_volumes_volume_id_fkey FOREIGN KEY (volume_id) REFERENCES public.volumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: series series_library_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_library_id_fkey FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: series_stories series_stories_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories
    ADD CONSTRAINT series_stories_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: series_stories series_stories_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories
    ADD CONSTRAINT series_stories_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stories stories_library_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_library_id_fkey FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: volumes volumes_library_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes
    ADD CONSTRAINT volumes_library_id_fkey FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: volumes_stories volumes_stories_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories
    ADD CONSTRAINT volumes_stories_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: volumes_stories volumes_stories_volume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories
    ADD CONSTRAINT volumes_stories_volume_id_fkey FOREIGN KEY (volume_id) REFERENCES public.volumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


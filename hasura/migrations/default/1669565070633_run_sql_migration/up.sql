CREATE TABLE public."Follow" (
    id integer NOT NULL,
    follower_id text NOT NULL,
    following_id text NOT NULL
);
CREATE TABLE public."Like" (
    id integer NOT NULL,
    user_id text NOT NULL,
    post_id integer NOT NULL
);
CREATE TABLE public."Post" (
    id integer NOT NULL,
    caption text NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL,
    "isVerified" boolean DEFAULT false
);
CREATE SEQUENCE public."Follow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Follow_id_seq" OWNED BY public."Follow".id;
CREATE SEQUENCE public."Like_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Like_id_seq" OWNED BY public."Like".id;
CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;
CREATE TABLE public."User" (
    name text NOT NULL,
    last_seen timestamp with time zone DEFAULT now() NOT NULL,
    avatar text NOT NULL,
    email text NOT NULL,
    id text NOT NULL
);
ALTER TABLE ONLY public."Follow" ALTER COLUMN id SET DEFAULT nextval('public."Follow_id_seq"'::regclass);
ALTER TABLE ONLY public."Like" ALTER COLUMN id SET DEFAULT nextval('public."Like_id_seq"'::regclass);
ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);
ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_follower_id_following_id_key" UNIQUE (follower_id, following_id);
ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_user_id_post_id_key" UNIQUE (user_id, post_id);
ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Post"(id) ON UPDATE RESTRICT;
ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

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
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: File; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."File" (
    id text NOT NULL,
    filename text NOT NULL,
    "originalName" text NOT NULL,
    description text,
    "mimeType" text NOT NULL,
    size integer NOT NULL,
    checksum character varying(64) NOT NULL,
    "mongoId" character varying(12) NOT NULL,
    "creatorId" text NOT NULL,
    "ownerId" text NOT NULL,
    "teamId" text NOT NULL,
    "folderId" text NOT NULL,
    "formId" text,
    "headerId" text,
    metadata jsonb,
    tags text[] DEFAULT ARRAY[]::text[],
    "securityLevel" integer DEFAULT 5 NOT NULL,
    version integer NOT NULL,
    "isLatest" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."File" OWNER TO postgres;

--
-- Name: File_version_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."File_version_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."File_version_seq" OWNER TO postgres;

--
-- Name: File_version_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."File_version_seq" OWNED BY public."File".version;


--
-- Name: Folder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Folder" (
    id text NOT NULL,
    name text NOT NULL,
    "parentId" text NOT NULL,
    "teamId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text
);


ALTER TABLE public."Folder" OWNER TO postgres;

--
-- Name: Form; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Form" (
    id text NOT NULL,
    name text NOT NULL,
    "teamId" text NOT NULL,
    description text,
    fields jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Form" OWNER TO postgres;

--
-- Name: Header; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Header" (
    id text NOT NULL,
    name text NOT NULL,
    "teamId" text NOT NULL,
    description text,
    fields jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Header" OWNER TO postgres;

--
-- Name: ManagementLevel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ManagementLevel" (
    id text NOT NULL,
    name text NOT NULL,
    rank integer NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ManagementLevel" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    name text NOT NULL,
    resource text,
    action text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    id text NOT NULL,
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    granted boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: Team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Team" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "ownerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Team" OWNER TO postgres;

--
-- Name: TeamUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamUser" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "teamId" text NOT NULL,
    "roleId" text NOT NULL,
    "accessLevel" integer DEFAULT 5 NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "leftAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "addedById" text,
    "promotedById" text
);


ALTER TABLE public."TeamUser" OWNER TO postgres;

--
-- Name: TeamUserPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamUserPermission" (
    id text NOT NULL,
    "teamUserId" text NOT NULL,
    "permissionId" text NOT NULL,
    granted boolean DEFAULT true NOT NULL,
    "grantedById" text,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone
);


ALTER TABLE public."TeamUserPermission" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    password text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "costCenter" text,
    "jobTitle" text,
    settings jsonb,
    "managementLevelId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isApprover" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "globalAccess" integer DEFAULT 5 NOT NULL,
    "roleId" text,
    "aNumber" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserPermission" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "permissionId" text NOT NULL,
    granted boolean DEFAULT true NOT NULL,
    "grantedById" text,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone
);


ALTER TABLE public."UserPermission" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: File version; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File" ALTER COLUMN version SET DEFAULT nextval('public."File_version_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state, "createdAt", "updatedAt") FROM stdin;
cmcxmvg0z000qp3pqeryq0gq0	cmcwcynve0002p3pqwwjcbpob				\N	\N	\N	\N	\N	\N	\N	2025-07-10 17:00:00.612	2025-07-10 16:59:10.444
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."File" (id, filename, "originalName", description, "mimeType", size, checksum, "mongoId", "creatorId", "ownerId", "teamId", "folderId", "formId", "headerId", metadata, tags, "securityLevel", version, "isLatest", "createdAt", "updatedAt") FROM stdin;
cmddleitx002hp3rhs684uf72	qualtest public	qualtest public	qualtest public	text/plain	4401	1	6	cmddauhsj001ep3rhnt43j96e	cmddauhsj001ep3rhnt43j96e	cmddb3rms001jp3rhha4z4bxj	cmddhc1im0020p3rhvs2r6xq2	cmddgik80001wp3rhiriigles	cmddeuky0001tp3rhsxicnex2	null	{}	5	1	t	2025-07-21 21:03:10.294	2025-07-21 21:00:44.626
cmddl6brb002dp3rhq7lnuksd	ssetest	ssetest	ssetest	text/plain	8000	1	2	cmddapdu5001bp3rhr2m8mnpw	cmddar1ky001cp3rhhexf01rb	cmddawb0u001fp3rhtpa78tsg	cmddhbmhj001zp3rhoqlwhz2a	cmddgx2hf001yp3rh7js9ec5y	cmddeu0it001sp3rhjp63fj34	null	{}	4	1	t	2025-07-21 20:56:47.879	2025-07-21 21:03:20.278
cmddl7v5q002ep3rht2afpd78	ssetest private	ssetest private	ssetest private	text/plain	20	1	3	cmdd9jgow001ap3rhi0nd1ddt	cmddapdu5001bp3rhr2m8mnpw	cmddawb0u001fp3rhtpa78tsg	cmddhbmhj001zp3rhoqlwhz2a	cmddgu65t001xp3rhq5b1iyvl	cmcxsyfy8000wp3pqg6zzh0eb	null	{}	1	1	t	2025-07-21 20:57:59.678	2025-07-21 21:03:20.278
cmddl9p2q002fp3rhum6qh3l5	qualtest	qualtest	qualtest	text/plain	506	1	4	cmdd9jgow001ap3rhi0nd1ddt	cmdd9jgow001ap3rhi0nd1ddt	cmddb3rms001jp3rhha4z4bxj	cmddhc1im0020p3rhvs2r6xq2	cmddgcotx001vp3rh77p9vkv5	cmddeuky0001tp3rhsxicnex2	null	{}	4	1	t	2025-07-21 20:59:25.106	2025-07-21 21:03:20.278
cmddlbcsa002gp3rhcagifjuo	qualtest private	qualtest private	qualtest private	text/plain	888	1	5	cmdd9hka90019p3rh8kz1daq3	cmdd9jgow001ap3rhi0nd1ddt	cmddb3rms001jp3rhha4z4bxj	cmddhc1im0020p3rhvs2r6xq2	cmddgik80001wp3rhiriigles	cmddeuky0001tp3rhsxicnex2	null	{}	1	1	t	2025-07-21 21:00:42.491	2025-07-21 21:03:20.278
cmddlg2cm002ip3rhjpel2mnj	ssetest public	ssetest public	ssetest public	text/plain	3	1	7	cmddar1ky001cp3rhhexf01rb	cmddasj0z001dp3rhf9n529hz	cmddawb0u001fp3rhtpa78tsg	cmddhbmhj001zp3rhoqlwhz2a	cmddgu65t001xp3rhq5b1iyvl	cmddeu0it001sp3rhjp63fj34	null	{}	5	1	t	2025-07-21 21:04:22.246	2025-07-21 21:03:24.511
cmdem94qx002lp3rh7s8ymh8i	test private	test private	test private	text/plain	11111112	1	8	cmcwcynve0002p3pqwwjcbpob	cmcwcynve0002p3pqwwjcbpob	cmcxjcayj0003p3pqqw5bpqkv	root	cmcxsxn4w000vp3pqybpjgans	cmcxsyfy8000wp3pqg6zzh0eb	null	{}	1	1	t	2025-07-22 14:14:44.553	2025-07-22 14:13:27.894
cmdemaqjc002mp3rhw28v586b	test public	test public	test public	text/plain	12	1	9	cmddauhsj001ep3rhnt43j96e	cmddauhsj001ep3rhnt43j96e	cmddb3rms001jp3rhha4z4bxj	cmddhc1im0020p3rhvs2r6xq2	cmddgcotx001vp3rh77p9vkv5	cmddeuky0001tp3rhsxicnex2	null	{}	5	6	t	2025-07-22 14:15:59.448	2025-07-22 14:14:45.391
cmcxsw6xi000up3pq23rybk1b	test	test	test	text/plain	2400	1	1	cmcwcynve0002p3pqwwjcbpob	cmcwcynve0002p3pqwwjcbpob	cmcxjcayj0003p3pqqw5bpqkv	root	cmcxsxn4w000vp3pqybpjgans	cmcxsyfy8000wp3pqg6zzh0eb	null	{}	4	1	t	2025-07-10 19:48:33.174	2025-07-22 14:15:59.448
\.


--
-- Data for Name: Folder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Folder" (id, name, "parentId", "teamId", "createdAt", "updatedAt", description) FROM stdin;
root	root	root	cmcxjcayj0003p3pqqw5bpqkv	2025-07-10 18:55:03.528	2025-07-10 18:39:35.542	\N
cmddhbmhj001zp3rhoqlwhz2a	SSE	root	cmddawb0u001fp3rhtpa78tsg	2025-07-21 19:08:56.6	2025-07-21 19:08:29.803	\N
cmddhc1im0020p3rhvs2r6xq2	Quality	root	cmddb3rms001jp3rhha4z4bxj	2025-07-21 19:09:16.078	2025-07-21 19:08:57.315	\N
cmddhck9x0021p3rhos952mev	CFI	root	cmcxjcayj0003p3pqqw5bpqkv	2025-07-21 19:09:40.389	2025-07-21 19:09:19.481	\N
\.


--
-- Data for Name: Form; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Form" (id, name, "teamId", description, fields, "createdAt", "updatedAt") FROM stdin;
cmcxsxn4w000vp3pqybpjgans	TST	cmcxjcayj0003p3pqqw5bpqkv	Example form for testing database	{}	2025-07-10 19:49:40.832	2025-07-10 19:48:41.813
cmddgcotx001vp3rh77p9vkv5	EC	cmddb3rms001jp3rhha4z4bxj	Engineering Change 	{}	2025-07-21 18:41:46.677	2025-07-21 18:01:13.681
cmddgik80001wp3rhiriigles	PCD	cmddb3rms001jp3rhha4z4bxj	Process Change/Deviation	{}	2025-07-21 18:46:20.64	2025-07-21 18:41:49.453
cmddgu65t001xp3rhq5b1iyvl	CPT	cmddawb0u001fp3rhtpa78tsg	SSE Complaint form	{}	2025-07-21 18:55:22.289	2025-07-21 18:53:42.581
cmddgx2hf001yp3rh7js9ec5y	PC	cmddawb0u001fp3rhtpa78tsg	Process Change	{}	2025-07-21 18:57:37.491	2025-07-21 18:57:11.821
\.


--
-- Data for Name: Header; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Header" (id, name, "teamId", description, fields, "createdAt", "updatedAt") FROM stdin;
cmcxsyfy8000wp3pqg6zzh0eb	TST	cmcxjcayj0003p3pqqw5bpqkv	Example header for filling out database	{}	2025-07-10 19:50:18.177	2025-07-10 19:49:47.181
cmddeu0it001sp3rhjp63fj34	SSE	cmddawb0u001fp3rhtpa78tsg	Header for all SSE files	{}	2025-07-21 17:59:15.749	2025-07-21 17:58:50.478
cmddeuky0001tp3rhsxicnex2	QUA	cmddb3rms001jp3rhha4z4bxj	Header for all Quality files	{}	2025-07-21 17:59:42.216	2025-07-21 17:59:16.828
cmddev4zp001up3rh3m53y3u5	ASB	cmddbchlp001op3rhuon4pglv	Header for all Assembly files	{}	2025-07-21 18:00:08.197	2025-07-21 17:59:42.673
\.


--
-- Data for Name: ManagementLevel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ManagementLevel" (id, name, rank, description, "createdAt", "updatedAt") FROM stdin;
cmcxt2az5000yp3pq3n88rmbz	4 - COOP Student	4	\N	2025-07-10 19:53:18.353	2025-07-10 19:52:41.789
cmcxt3kwr000zp3pqy21pgrg2	6 - Team Member	6	\N	2025-07-10 19:54:17.884	2025-07-10 19:53:55.607
cmcxt45kk0010p3pqv7u0nkkn	8 - Team Leader	8	\N	2025-07-10 19:54:44.661	2025-07-10 19:54:22.274
cmcxt4hwc0011p3pqbypytj8u	10 - Associate	10	\N	2025-07-10 19:55:00.636	2025-07-10 19:56:48.994
cmcxt6j9q0013p3pqqprscjzt	12 - Specialist 1	12	\N	2025-07-10 19:56:35.726	2025-07-10 19:56:53.256
cmcxt76cv0014p3pq2z7f0mv1	14 - Specialist 2	14	\N	2025-07-10 19:57:05.647	2025-07-10 19:56:54.303
cmcxt84ko0016p3pqppfjapcu	16 - Specialist 3	16	\N	2025-07-10 19:57:49.993	2025-07-10 19:57:34.973
cmcxt8mfn0017p3pq9tn24x9h	18 - Group Leader	18	\N	2025-07-10 19:58:13.139	2025-07-10 19:57:52.491
cmcxt94040018p3pqj4ty1foo	20 - Manager	20	\N	2025-07-10 19:58:35.909	2025-07-10 19:58:14.297
cmcxt9eyk0019p3pqj3dyy67l	22 - Senior Manager	22	\N	2025-07-10 19:58:50.108	2025-07-10 19:58:37.46
cmcxt9pyy001ap3pqgib3irkh	24 - General Manager	24	\N	2025-07-10 19:59:04.378	2025-07-10 19:58:50.934
cmcxta2s4001bp3pqwmglfx9k	26 - General Manager	26	\N	2025-07-10 19:59:20.981	2025-07-10 19:59:04.912
cmcxtaj73001cp3pqw4macqhc	30 - Executive Vice President	30	\N	2025-07-10 19:59:42.255	2025-07-10 19:59:21.896
cmcxtaw07001dp3pqd8fjkitm	32 - President	32	\N	2025-07-10 19:59:58.855	2025-07-10 19:59:43.135
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, name, resource, action, description, "createdAt", "updatedAt") FROM stdin;
cmcz5trdr0001p3rh61s5xewj	user-create	user	create	creates users	2025-07-11 18:38:20.895	2025-07-11 18:35:49.592
cmcz5trdr0002p3rhj9f4hjx2	user-read	user	read	read users	2025-07-11 18:38:20.895	2025-07-11 18:37:38.947
cmcz5trdr0003p3rhxoan671s	user-update	user	update	update users	2025-07-11 18:38:20.895	2025-07-11 18:37:54.382
cmcz5trdr0004p3rh36ovug7s	user-delete	user	delete	delete users	2025-07-11 18:38:20.895	2025-07-11 18:38:09.696
cmcxmdg560008p3pq1g5vkb5e	file-create	file	create	create files	2025-07-10 16:46:00.954	2025-07-11 18:38:20.895
cmcxmduhe0009p3pqmm30ogi4	file-read	file	read	read files	2025-07-10 16:46:19.539	2025-07-11 18:38:20.895
cmcxmed04000ap3pqm95lsa1z	file-update	file	update	update files	2025-07-10 16:46:43.541	2025-07-11 18:38:20.895
cmcxmeqhv000bp3pqr9mcz71g	file-delete	file	delete	delete files	2025-07-10 16:47:01.027	2025-07-11 18:38:20.895
cmcz5w14e0008p3rh8hasima4	team-create	team	create	create teams	2025-07-11 18:40:06.83	2025-07-11 18:38:23.223
cmcz5w14e0009p3rhzluxb6pu	team-read	team	read	read teams	2025-07-11 18:40:06.83	2025-07-11 18:38:41.304
cmcz5w14e000ap3rh2s61468f	team-update	team	update	update teams	2025-07-11 18:40:06.83	2025-07-11 18:38:41.432
cmcz5w14e000bp3rh6u4fc7xs	team-delete	team	delete	delete teams	2025-07-11 18:40:06.83	2025-07-11 18:39:32.11
cmcz5xoi0000cp3rhenll2wc8	folder-create	folder	create	create folders	2025-07-11 18:41:23.784	2025-07-11 18:40:40.752
cmcz5xoi0000dp3rhi0qlp8bc	folder-read	folder	read	read folders	2025-07-11 18:41:23.784	2025-07-11 18:40:54.677
cmcz5y588000ep3rhaivmqw3m	folder-update	folder	update	update folders	2025-07-11 18:41:45.465	2025-07-11 18:42:33.037
cmcz5zgvu000gp3rheftg3flp	folder-delete	folder	delete	delete folders	2025-07-11 18:42:47.227	2025-07-11 18:42:33.849
cmddkkdyj0023p3rhyaiypp06	file-download	file	download	download files	2025-07-21 20:39:44.299	2025-07-21 20:39:18.123
cmddkkqu60024p3rhf2kq41li	user-promote	user	promote	promote users	2025-07-21 20:40:00.99	2025-07-21 20:39:47.329
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description, "createdAt", "updatedAt") FROM stdin;
cmcxjxcg80004p3pq7saogf8c	Moderator	This role is in charge of the system	2025-07-10 15:37:30.441	2025-07-10 15:21:22.101
cmcxk0b640005p3pqtn5cq0cu	Admin	This role has the highest privilege within a team aside from owner	2025-07-10 15:39:48.749	2025-07-10 15:38:02.382
cmcxk19n90007p3pqx45afa2d	User	This is the lowest role with only read access	2025-07-10 15:40:33.429	2025-07-10 15:40:10.643
cmddk4y650022p3rh1mn302p3	Distributor	This role is like User, but can also print and download files	2025-07-21 20:27:43.997	2025-07-21 20:26:53.954
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" (id, "roleId", "permissionId", granted, "createdAt") FROM stdin;
cmcxmhuiq000cp3pqoah6e18o	cmcxjxcg80004p3pq7saogf8c	cmcxmdg560008p3pq1g5vkb5e	t	2025-07-10 16:49:26.21
cmcxmhuiq000dp3pqopb8vmva	cmcxk0b640005p3pqtn5cq0cu	cmcxmdg560008p3pq1g5vkb5e	t	2025-07-10 16:49:26.21
cmcxmjvuj000fp3pqthkwp5wh	cmcxjxcg80004p3pq7saogf8c	cmcxmeqhv000bp3pqr9mcz71g	t	2025-07-10 16:51:01.244
cmcxmjvuk000gp3pqd38zkq8d	cmcxk0b640005p3pqtn5cq0cu	cmcxmeqhv000bp3pqr9mcz71g	t	2025-07-10 16:51:01.244
cmcxmmegh000ip3pqm41hzww5	cmcxjxcg80004p3pq7saogf8c	cmcxmduhe0009p3pqmm30ogi4	t	2025-07-10 16:52:58.673
cmcxmmegh000jp3pq1s46y9il	cmcxk0b640005p3pqtn5cq0cu	cmcxmduhe0009p3pqmm30ogi4	t	2025-07-10 16:52:58.673
cmcxmmegh000lp3pq5yx1yns3	cmcxk19n90007p3pqx45afa2d	cmcxmduhe0009p3pqmm30ogi4	t	2025-07-10 16:52:58.673
cmcxmomsi000mp3pq9ob1vp1q	cmcxjxcg80004p3pq7saogf8c	cmcxmed04000ap3pqm95lsa1z	t	2025-07-10 16:54:42.786
cmcxmomsi000np3pq6qyv59bw	cmcxk0b640005p3pqtn5cq0cu	cmcxmed04000ap3pqm95lsa1z	t	2025-07-10 16:54:42.786
cmdd6i97d000hp3rhoehc8238	cmcxjxcg80004p3pq7saogf8c	cmcz5trdr0001p3rh61s5xewj	t	2025-07-21 14:06:10.201
cmdd6inbg000ip3rhxaroli5a	cmcxjxcg80004p3pq7saogf8c	cmcz5trdr0002p3rhj9f4hjx2	t	2025-07-21 14:06:28.492
cmdd6j04v000jp3rh4pzqn66j	cmcxjxcg80004p3pq7saogf8c	cmcz5trdr0003p3rhxoan671s	t	2025-07-21 14:06:45.104
cmdd6jijt000kp3rhq00o05k3	cmcxjxcg80004p3pq7saogf8c	cmcz5trdr0004p3rh36ovug7s	t	2025-07-21 14:07:08.969
cmdd6juhl000lp3rhl1vramca	cmcxjxcg80004p3pq7saogf8c	cmcz5w14e0008p3rh8hasima4	t	2025-07-21 14:07:24.441
cmdd6k1xf000mp3rh3mxqp2hi	cmcxjxcg80004p3pq7saogf8c	cmcz5w14e0009p3rhzluxb6pu	t	2025-07-21 14:07:34.083
cmdd6k8t8000np3rhdfpdtq5z	cmcxjxcg80004p3pq7saogf8c	cmcz5w14e000ap3rh2s61468f	t	2025-07-21 14:07:43.004
cmdd6ki9g000op3rh9xymk26p	cmcxjxcg80004p3pq7saogf8c	cmcz5w14e000bp3rh6u4fc7xs	t	2025-07-21 14:07:55.253
cmdd6kq5j000pp3rhsjr6q4m4	cmcxjxcg80004p3pq7saogf8c	cmcz5xoi0000cp3rhenll2wc8	t	2025-07-21 14:08:05.48
cmdd6lojz000rp3rhv98cojjm	cmcxjxcg80004p3pq7saogf8c	cmcz5xoi0000dp3rhi0qlp8bc	t	2025-07-21 14:08:50.063
cmdd6lv0v000sp3rhye78plh9	cmcxjxcg80004p3pq7saogf8c	cmcz5y588000ep3rhaivmqw3m	t	2025-07-21 14:08:58.448
cmdd6m2f9000tp3rhrf8xjczd	cmcxjxcg80004p3pq7saogf8c	cmcz5zgvu000gp3rheftg3flp	t	2025-07-21 14:09:08.037
cmdd90ju0000up3rhjzf2ok5n	cmcxk0b640005p3pqtn5cq0cu	cmcz5trdr0001p3rh61s5xewj	t	2025-07-21 15:16:23.016
cmdd914no000vp3rh7osene4i	cmcxk0b640005p3pqtn5cq0cu	cmcz5trdr0002p3rhj9f4hjx2	t	2025-07-21 15:16:50.004
cmdd91e9i000wp3rhn97fgli8	cmcxk0b640005p3pqtn5cq0cu	cmcz5trdr0003p3rhxoan671s	t	2025-07-21 15:17:02.455
cmdd91lq1000xp3rh72018t96	cmcxk0b640005p3pqtn5cq0cu	cmcz5trdr0004p3rh36ovug7s	t	2025-07-21 15:17:12.122
cmdd91ups000yp3rhw0hibje5	cmcxk0b640005p3pqtn5cq0cu	cmcz5xoi0000cp3rhenll2wc8	t	2025-07-21 15:17:23.777
cmdd921he000zp3rh3xdowx2x	cmcxk0b640005p3pqtn5cq0cu	cmcz5xoi0000dp3rhi0qlp8bc	t	2025-07-21 15:17:32.546
cmdd929xg0010p3rhcotom4h5	cmcxk0b640005p3pqtn5cq0cu	cmcz5y588000ep3rhaivmqw3m	t	2025-07-21 15:17:43.492
cmdd92fwu0011p3rhrx6y7bmq	cmcxk0b640005p3pqtn5cq0cu	cmcz5zgvu000gp3rheftg3flp	t	2025-07-21 15:17:51.247
cmdd92tb90012p3rh49vo8bkq	cmcxk0b640005p3pqtn5cq0cu	cmcz5w14e0009p3rhzluxb6pu	t	2025-07-21 15:18:08.614
cmdd965s70014p3rhjhffaif7	cmcxk19n90007p3pqx45afa2d	cmcz5trdr0002p3rhj9f4hjx2	t	2025-07-21 15:20:44.743
cmdd96gt10015p3rhgwf3qpcl	cmcxk19n90007p3pqx45afa2d	cmcz5xoi0000dp3rhi0qlp8bc	t	2025-07-21 15:20:59.029
cmdd97d1m0016p3rhq5254usx	cmcxk19n90007p3pqx45afa2d	cmcz5w14e0009p3rhzluxb6pu	t	2025-07-21 15:21:40.81
cmddklp1u0025p3rhda8d2cnl	cmcxjxcg80004p3pq7saogf8c	cmddkkdyj0023p3rhyaiypp06	t	2025-07-21 20:40:45.331
cmddkm8hg0026p3rhr3aeu7a9	cmcxjxcg80004p3pq7saogf8c	cmddkkqu60024p3rhf2kq41li	t	2025-07-21 20:41:10.517
cmddkn0cv0027p3rh3it5c2pe	cmcxk0b640005p3pqtn5cq0cu	cmddkkdyj0023p3rhyaiypp06	t	2025-07-21 20:41:46.64
cmddkvw860028p3rhjgxl144l	cmddk4y650022p3rh1mn302p3	cmcxmduhe0009p3pqmm30ogi4	t	2025-07-21 20:48:41.19
cmddkw9xh0029p3rhzncc5nar	cmddk4y650022p3rh1mn302p3	cmddkkdyj0023p3rhyaiypp06	t	2025-07-21 20:48:58.95
cmddkwj95002ap3rhprf0iwlg	cmddk4y650022p3rh1mn302p3	cmcz5trdr0002p3rhj9f4hjx2	t	2025-07-21 20:49:11.033
cmddkwx1a002bp3rhvl877pbo	cmddk4y650022p3rh1mn302p3	cmcz5xoi0000dp3rhi0qlp8bc	t	2025-07-21 20:49:28.895
cmddkx5ms002cp3rhic427nu6	cmddk4y650022p3rh1mn302p3	cmcz5w14e0009p3rhzluxb6pu	t	2025-07-21 20:49:40.036
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
cmcxt017d000xp3pqsxehqjuh	test	cmcwcynve0002p3pqwwjcbpob	2030-01-01 00:00:00
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Team" (id, name, description, "ownerId", "createdAt", "updatedAt") FROM stdin;
cmcxjcayj0003p3pqqw5bpqkv	CFI	Center For Innovation	cmcwcynve0002p3pqwwjcbpob	2025-07-10 15:21:08.731	2025-07-10 15:20:05.916
cmddawb0u001fp3rhtpa78tsg	SSE	Security, Safety, Environmental	cmddapdu5001bp3rhr2m8mnpw	2025-07-21 16:09:04.207	2025-07-21 16:07:51.431
cmddb3rms001jp3rhha4z4bxj	QUA	Quality	cmdd9hka90019p3rh8kz1daq3	2025-07-21 16:14:52.324	2025-07-21 16:14:23.191
cmddbchlp001op3rhuon4pglv	ASB	Assembly	cmddbbydz001np3rhkeultef3	2025-07-21 16:21:39.229	2025-07-21 16:18:41.676
\.


--
-- Data for Name: TeamUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamUser" (id, "userId", "teamId", "roleId", "accessLevel", "isAdmin", "joinedAt", "leftAt", "updatedAt", "addedById", "promotedById") FROM stdin;
cmddb0rma001hp3rhr2jjt483	cmddar1ky001cp3rhhexf01rb	cmddawb0u001fp3rhtpa78tsg	cmcxk0b640005p3pqtn5cq0cu	2	t	2025-07-21 16:12:32.337	\N	2025-07-21 16:11:13.83	cmddapdu5001bp3rhr2m8mnpw	cmddapdu5001bp3rhr2m8mnpw
cmcz5qa4s0000p3rhh6ctk42v	cmcwcynve0002p3pqwwjcbpob	cmcxjcayj0003p3pqqw5bpqkv	cmcxjxcg80004p3pq7saogf8c	1	t	2025-07-11 18:35:38.572	\N	2025-07-21 16:12:32.337	cmcwcynve0002p3pqwwjcbpob	cmcwcynve0002p3pqwwjcbpob
cmddb6958001lp3rhu24fka9l	cmdd9jgow001ap3rhi0nd1ddt	cmddb3rms001jp3rhha4z4bxj	cmcxk0b640005p3pqtn5cq0cu	2	t	2025-07-21 16:16:48.332	\N	2025-07-21 16:15:39.837	cmdd9hka90019p3rh8kz1daq3	cmdd9hka90019p3rh8kz1daq3
cmddb4rnz001kp3rhlpm5s004	cmdd9hka90019p3rh8kz1daq3	cmddb3rms001jp3rhha4z4bxj	cmcxk0b640005p3pqtn5cq0cu	1	t	2025-07-21 16:15:39.024	\N	2025-07-21 16:16:48.332	cmcwcynve0002p3pqwwjcbpob	cmcwcynve0002p3pqwwjcbpob
cmddaz2c2001gp3rh7k855g84	cmddapdu5001bp3rhr2m8mnpw	cmddawb0u001fp3rhtpa78tsg	cmcxk0b640005p3pqtn5cq0cu	1	t	2025-07-21 16:11:12.914	\N	2025-07-21 16:16:48.332	cmcwcynve0002p3pqwwjcbpob	cmcwcynve0002p3pqwwjcbpob
cmddb7pk7001mp3rhgpdgqfyx	cmddauhsj001ep3rhnt43j96e	cmddb3rms001jp3rhha4z4bxj	cmcxk19n90007p3pqx45afa2d	4	f	2025-07-21 16:17:56.263	\N	2025-07-21 16:16:49.894	cmddar1ky001cp3rhhexf01rb	\N
cmddb1wip001ip3rh34fjo8x8	cmddasj0z001dp3rhf9n529hz	cmddawb0u001fp3rhtpa78tsg	cmcxk19n90007p3pqx45afa2d	4	f	2025-07-21 16:13:25.346	\N	2025-07-21 16:17:56.263	cmddar1ky001cp3rhhexf01rb	\N
cmddbdw0n001pp3rhio8me7xx	cmddbbydz001np3rhkeultef3	cmddbchlp001op3rhuon4pglv	cmcxk0b640005p3pqtn5cq0cu	1	t	2025-07-21 16:22:44.567	\N	2025-07-21 16:17:59.457	cmcwcynve0002p3pqwwjcbpob	cmcwcynve0002p3pqwwjcbpob
cmddbfa6s001qp3rhyh424xur	cmdd9engx0018p3rh7j405qow	cmddbchlp001op3rhuon4pglv	cmcxk19n90007p3pqx45afa2d	3	f	2025-07-21 16:23:49.588	\N	2025-07-21 16:22:46.422	cmddbbydz001np3rhkeultef3	\N
cmddbfa6t001rp3rhqhlmg1r1	cmdd9bybw0017p3rhx8qrsynf	cmddbchlp001op3rhuon4pglv	cmcxk19n90007p3pqx45afa2d	4	f	2025-07-21 16:23:49.588	\N	2025-07-21 16:22:57.713	cmddbbydz001np3rhkeultef3	\N
\.


--
-- Data for Name: TeamUserPermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamUserPermission" (id, "teamUserId", "permissionId", granted, "grantedById", reason, "createdAt", "expiresAt") FROM stdin;
cmddlkuuv002jp3rh7iaplitv	cmddb6958001lp3rhu24fka9l	cmcz5zgvu000gp3rheftg3flp	f	cmdd9hka90019p3rh8kz1daq3	\N	2025-07-21 21:08:05.816	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "firstName", "lastName", password, "emailVerified", image, "costCenter", "jobTitle", settings, "managementLevelId", "isActive", "isApprover", "createdAt", "updatedAt", "lastLoginAt", "globalAccess", "roleId", "aNumber") FROM stdin;
cmdd9engx0018p3rh7j405qow	approver@mazdatoyota.com	approver	approver	\N	2025-07-09 19:14:00	\N	7400QU00	Quality Engineer	null	cmcxt3kwr000zp3pqy21pgrg2	t	t	2025-07-21 15:27:20.913	2025-07-21 15:25:20.385	\N	5	cmcxk19n90007p3pqx45afa2d	a00003
cmdd9bybw0017p3rhx8qrsynf	user@mazdatoyota.com	user	user	\N	2025-07-09 19:14:00	\N	8200QU00	Quality Engineer	null	cmcxt3kwr000zp3pqy21pgrg2	t	f	2025-07-21 15:25:15.02	2025-07-21 15:27:20.913	\N	5	cmcxk19n90007p3pqx45afa2d	a00002
cmcwcynve0002p3pqwwjcbpob	ashton.johnson1@mazdatoyota.com	Ashton	Johnson	\N	2025-07-09 19:14:00	\N	4700CI00	Software and System Architect	null	cmcxt84ko0016p3pqppfjapcu	t	t	2025-07-09 19:12:42.229	2025-07-21 15:27:20.913	\N	2	cmcxjxcg80004p3pq7saogf8c	a00001
cmdd9hka90019p3rh8kz1daq3	qualityowner@mazdatoyota.com	qualityowner	qualityowner	\N	2025-07-09 19:14:00	\N	6200QU00	Quality Specialist	null	cmcxt76cv0014p3pq2z7f0mv1	t	t	2025-07-21 15:29:36.753	2025-07-21 15:27:26.252	\N	5	cmcxk19n90007p3pqx45afa2d	a00004
cmdd9jgow001ap3rhi0nd1ddt	qualityadmin@mazdatoyota.com	qualityadmin	qualityadmin	\N	2025-07-09 19:14:00	\N	8200QU00	Quality Specialist	null	cmcxt84ko0016p3pqppfjapcu	t	t	2025-07-21 15:31:05.408	2025-07-21 15:29:40.24	\N	5	cmcxk19n90007p3pqx45afa2d	a00005
cmddapdu5001bp3rhr2m8mnpw	sseowner@mazdatoyota.com	sseowner	sseowner	\N	2025-07-09 19:14:00	\N	7700SS00	SSE Specialist	null	cmcxt84ko0016p3pqppfjapcu	t	t	2025-07-21 16:03:41.261	2025-07-21 16:02:21.532	\N	5	cmcxk19n90007p3pqx45afa2d	a00006
cmddasj0z001dp3rhf9n529hz	sseuser@mazdatoyota.com	sseuser	sseuser	\N	2025-07-09 19:14:00	\N	7700SS00	SSE Member	null	cmcxt45kk0010p3pqv7u0nkkn	t	f	2025-07-21 16:06:07.955	2025-07-21 16:06:25.461	\N	5	cmcxk19n90007p3pqx45afa2d	a00008
cmddbbydz001np3rhkeultef3	assemblyowner@mazdatoyota.com	assemblyowner	assemblyowner	\N	2025-07-09 19:14:00	\N	9100AS00	Assembly Manager	null	cmcxt94040018p3pqj4ty1foo	t	t	2025-07-21 16:21:14.327	2025-07-21 16:19:11.453	\N	5	cmcxk19n90007p3pqx45afa2d	a00010
cmddar1ky001cp3rhhexf01rb	sseadmin@mazdatoyota.com	sseadmin	sseadmin	\N	2025-07-09 19:14:00	\N	7700SS00	SSE Specialist	null	cmcxt76cv0014p3pq2z7f0mv1	t	t	2025-07-21 16:04:58.69	2025-07-21 16:21:14.327	\N	5	cmcxk19n90007p3pqx45afa2d	a00007
cmddauhsj001ep3rhnt43j96e	qualityuser@mazdatoyota.com	qualityuser	qualityuser	\N	2025-07-09 19:14:00	\N	8200QU00	Quality Engineer	null	cmcxt45kk0010p3pqv7u0nkkn	t	f	2025-07-21 16:07:39.668	2025-07-21 16:21:14.327	\N	5	cmcxk19n90007p3pqx45afa2d	a00009
\.


--
-- Data for Name: UserPermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserPermission" (id, "userId", "permissionId", granted, "grantedById", reason, "createdAt", "expiresAt") FROM stdin;
cmddlrzjo002kp3rhkkd2qu18	cmdd9bybw0017p3rhx8qrsynf	cmcxmeqhv000bp3pqr9mcz71g	t	cmcwcynve0002p3pqwwjcbpob	\N	2025-07-21 21:13:38.485	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3b3707e5-3fbf-4ec9-a200-ccd4d60c19df	6cf4921bb382130e305da30e5c14264a063eb188df9e8d869f817591763c0843	2025-07-09 19:33:40.28068+00	20250709193339_init	\N	\N	2025-07-09 19:33:39.890447+00	1
57f5443b-a049-4ed3-8dc8-756e0ce95cf2	f5af59e759254f6bd21a9e52f16ddac2adf3cf3e2ddb89207e59b5f4941e9f33	2025-07-11 18:33:33.626888+00	20250711183333_update1	\N	\N	2025-07-11 18:33:33.514316+00	1
\.


--
-- Name: File_version_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."File_version_seq"', 6, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: Folder Folder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_pkey" PRIMARY KEY (id);


--
-- Name: Form Form_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Form"
    ADD CONSTRAINT "Form_pkey" PRIMARY KEY (id);


--
-- Name: Header Header_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Header"
    ADD CONSTRAINT "Header_pkey" PRIMARY KEY (id);


--
-- Name: ManagementLevel ManagementLevel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ManagementLevel"
    ADD CONSTRAINT "ManagementLevel_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: TeamUserPermission TeamUserPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUserPermission"
    ADD CONSTRAINT "TeamUserPermission_pkey" PRIMARY KEY (id);


--
-- Name: TeamUser TeamUser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUser"
    ADD CONSTRAINT "TeamUser_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: UserPermission UserPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_userId_idx" ON public."Account" USING btree ("userId");


--
-- Name: File_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_createdAt_idx" ON public."File" USING btree ("createdAt" DESC);


--
-- Name: File_filename_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_filename_idx" ON public."File" USING btree (filename);


--
-- Name: File_folderId_filename_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "File_folderId_filename_key" ON public."File" USING btree ("folderId", filename);


--
-- Name: File_folderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_folderId_idx" ON public."File" USING btree ("folderId");


--
-- Name: File_formId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_formId_idx" ON public."File" USING btree ("formId");


--
-- Name: File_headerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_headerId_idx" ON public."File" USING btree ("headerId");


--
-- Name: File_mongoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_mongoId_idx" ON public."File" USING btree ("mongoId");


--
-- Name: File_mongoId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "File_mongoId_key" ON public."File" USING btree ("mongoId");


--
-- Name: File_originalName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_originalName_idx" ON public."File" USING btree ("originalName");


--
-- Name: File_ownerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_ownerId_idx" ON public."File" USING btree ("ownerId");


--
-- Name: File_securityLevel_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_securityLevel_idx" ON public."File" USING btree ("securityLevel");


--
-- Name: File_tags_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_tags_idx" ON public."File" USING gin (tags);


--
-- Name: File_teamId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "File_teamId_idx" ON public."File" USING btree ("teamId");


--
-- Name: Folder_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Folder_createdAt_idx" ON public."Folder" USING btree ("createdAt" DESC);


--
-- Name: Folder_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Folder_name_idx" ON public."Folder" USING btree (name);


--
-- Name: Folder_name_parentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Folder_name_parentId_key" ON public."Folder" USING btree (name, "parentId");


--
-- Name: Folder_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Folder_parentId_idx" ON public."Folder" USING btree ("parentId");


--
-- Name: Folder_updatedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Folder_updatedAt_idx" ON public."Folder" USING btree ("updatedAt" DESC);


--
-- Name: Form_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Form_name_idx" ON public."Form" USING btree (name);


--
-- Name: Form_name_teamId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Form_name_teamId_key" ON public."Form" USING btree (name, "teamId");


--
-- Name: Form_teamId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Form_teamId_idx" ON public."Form" USING btree ("teamId");


--
-- Name: Header_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Header_name_idx" ON public."Header" USING btree (name);


--
-- Name: Header_name_teamId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Header_name_teamId_key" ON public."Header" USING btree (name, "teamId");


--
-- Name: Header_teamId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Header_teamId_idx" ON public."Header" USING btree ("teamId");


--
-- Name: ManagementLevel_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ManagementLevel_id_idx" ON public."ManagementLevel" USING btree (id);


--
-- Name: ManagementLevel_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ManagementLevel_name_key" ON public."ManagementLevel" USING btree (name);


--
-- Name: ManagementLevel_rank_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ManagementLevel_rank_idx" ON public."ManagementLevel" USING btree (rank);


--
-- Name: Permission_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_action_idx" ON public."Permission" USING btree (action);


--
-- Name: Permission_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_name_idx" ON public."Permission" USING btree (name);


--
-- Name: Permission_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_name_key" ON public."Permission" USING btree (name);


--
-- Name: Permission_resource_action_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_resource_action_key" ON public."Permission" USING btree (resource, action);


--
-- Name: Permission_resource_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_resource_idx" ON public."Permission" USING btree (resource);


--
-- Name: RolePermission_permissionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_permissionId_idx" ON public."RolePermission" USING btree ("permissionId");


--
-- Name: RolePermission_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_roleId_idx" ON public."RolePermission" USING btree ("roleId");


--
-- Name: RolePermission_roleId_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON public."RolePermission" USING btree ("roleId", "permissionId");


--
-- Name: Role_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Role_name_idx" ON public."Role" USING btree (name);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Session_expires_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_expires_idx" ON public."Session" USING btree (expires DESC);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: TeamUserPermission_permissionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamUserPermission_permissionId_idx" ON public."TeamUserPermission" USING btree ("permissionId");


--
-- Name: TeamUserPermission_teamUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamUserPermission_teamUserId_idx" ON public."TeamUserPermission" USING btree ("teamUserId");


--
-- Name: TeamUserPermission_teamUserId_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TeamUserPermission_teamUserId_permissionId_key" ON public."TeamUserPermission" USING btree ("teamUserId", "permissionId");


--
-- Name: TeamUser_joinedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamUser_joinedAt_idx" ON public."TeamUser" USING btree ("joinedAt" DESC);


--
-- Name: TeamUser_teamId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamUser_teamId_idx" ON public."TeamUser" USING btree ("teamId");


--
-- Name: TeamUser_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamUser_userId_idx" ON public."TeamUser" USING btree ("userId");


--
-- Name: TeamUser_userId_teamId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TeamUser_userId_teamId_key" ON public."TeamUser" USING btree ("userId", "teamId");


--
-- Name: Team_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Team_name_idx" ON public."Team" USING btree (name);


--
-- Name: Team_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Team_name_key" ON public."Team" USING btree (name);


--
-- Name: Team_ownerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Team_ownerId_idx" ON public."Team" USING btree ("ownerId");


--
-- Name: UserPermission_permissionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserPermission_permissionId_idx" ON public."UserPermission" USING btree ("permissionId");


--
-- Name: UserPermission_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserPermission_userId_idx" ON public."UserPermission" USING btree ("userId");


--
-- Name: UserPermission_userId_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserPermission_userId_permissionId_key" ON public."UserPermission" USING btree ("userId", "permissionId");


--
-- Name: User_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_createdAt_idx" ON public."User" USING btree ("createdAt" DESC);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_firstName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_firstName_idx" ON public."User" USING btree ("firstName");


--
-- Name: User_firstName_lastName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_firstName_lastName_idx" ON public."User" USING btree ("firstName", "lastName");


--
-- Name: User_isApprover_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_isApprover_idx" ON public."User" USING btree ("isApprover");


--
-- Name: User_lastName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_lastName_idx" ON public."User" USING btree ("lastName");


--
-- Name: User_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_roleId_idx" ON public."User" USING btree ("roleId");


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: File File_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: File File_folderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES public."Folder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: File File_formId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_formId_fkey" FOREIGN KEY ("formId") REFERENCES public."Form"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: File File_headerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES public."Header"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: File File_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: File File_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Folder Folder_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Folder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Folder Folder_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Form Form_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Form"
    ADD CONSTRAINT "Form_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Header Header_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Header"
    ADD CONSTRAINT "Header_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamUserPermission TeamUserPermission_grantedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUserPermission"
    ADD CONSTRAINT "TeamUserPermission_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TeamUserPermission TeamUserPermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUserPermission"
    ADD CONSTRAINT "TeamUserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamUserPermission TeamUserPermission_teamUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUserPermission"
    ADD CONSTRAINT "TeamUserPermission_teamUserId_fkey" FOREIGN KEY ("teamUserId") REFERENCES public."TeamUser"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamUser TeamUser_addedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUser"
    ADD CONSTRAINT "TeamUser_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TeamUser TeamUser_promotedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUser"
    ADD CONSTRAINT "TeamUser_promotedById_fkey" FOREIGN KEY ("promotedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TeamUser TeamUser_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUser"
    ADD CONSTRAINT "TeamUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TeamUser TeamUser_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUser"
    ADD CONSTRAINT "TeamUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamUser TeamUser_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamUser"
    ADD CONSTRAINT "TeamUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Team Team_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserPermission UserPermission_grantedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserPermission UserPermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserPermission UserPermission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_managementLevelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_managementLevelId_fkey" FOREIGN KEY ("managementLevelId") REFERENCES public."ManagementLevel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2025-08-13 15:29:00

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

--
-- TOC entry 832 (class 1247 OID 26040)
-- Name: enum_Turnos_estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Turnos_estado" AS ENUM (
    'disponible',
    'reservado',
    'cancelado',
    'cortado'
);


ALTER TYPE public."enum_Turnos_estado" OWNER TO postgres;

--
-- TOC entry 826 (class 1247 OID 26025)
-- Name: enum_Usuarios_rol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Usuarios_rol" AS ENUM (
    'cliente',
    'admin'
);


ALTER TYPE public."enum_Usuarios_rol" OWNER TO postgres;

--
-- TOC entry 847 (class 1247 OID 25646)
-- Name: enum_Usuarios_tipo_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Usuarios_tipo_usuario" AS ENUM (
    'barbero',
    'cliente'
);


ALTER TYPE public."enum_Usuarios_tipo_usuario" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 213 (class 1259 OID 26087)
-- Name: Comentarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comentarios" (
    id uuid NOT NULL,
    contenido text NOT NULL,
    creado_en timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    usuario_id uuid,
    post_id uuid
);


ALTER TABLE public."Comentarios" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 26072)
-- Name: Likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Likes" (
    id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    usuario_id uuid,
    post_id uuid
);


ALTER TABLE public."Likes" OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 26060)
-- Name: Posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Posts" (
    id uuid NOT NULL,
    imagen_url text NOT NULL,
    descripcion text,
    creado_en timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    usuario_id uuid
);


ALTER TABLE public."Posts" OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 26047)
-- Name: Turnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Turnos" (
    id uuid NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    estado public."enum_Turnos_estado" DEFAULT 'disponible'::public."enum_Turnos_estado",
    nombre_manual character varying(255),
    email_manual character varying(255),
    telefono character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    cliente_id uuid,
    ip character varying(255)
);


ALTER TABLE public."Turnos" OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 26029)
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuarios" (
    id uuid NOT NULL,
    nombre character varying(255) NOT NULL,
    email character varying(255),
    "contraseña" character varying(255),
    telefono character varying(255),
    rol public."enum_Usuarios_rol" DEFAULT 'cliente'::public."enum_Usuarios_rol",
    creado_en timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    foto_perfil character varying(255),
    instagram character varying(255)
);


ALTER TABLE public."Usuarios" OWNER TO postgres;

--
-- TOC entry 3371 (class 0 OID 26087)
-- Dependencies: 213
-- Data for Name: Comentarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Comentarios" VALUES ('eb9077b5-aefc-4b6f-9c31-ab31d132bbf9', 'Lindooo', '2025-07-28 00:46:05.161-03', '2025-07-28 00:46:05.162-03', '2025-07-28 00:46:05.162-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('d890f9bc-969b-46a1-bc99-34b9eb884f4d', 'Meteme esa pelado porfa', '2025-07-28 00:27:51.443-03', '2025-07-28 00:27:51.443-03', '2025-07-28 00:27:51.443-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('4205257a-9ca6-4679-980d-c3ac17a7e96f', 'sad', '2025-07-28 00:45:32.03-03', '2025-07-28 00:45:32.03-03', '2025-07-28 00:45:32.03-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('5f8d1cc4-7fc9-4c82-819a-757cd302b348', 'Pero que negro puto!! ', '2025-07-28 00:16:01.096-03', '2025-07-28 00:16:01.096-03', '2025-07-28 00:16:01.096-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('7229ce97-1fa1-4e65-939a-86caf670e693', 'Buena cabeza', '2025-07-28 00:01:46.69-03', '2025-07-28 00:01:46.691-03', '2025-07-28 00:01:46.691-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('f693a49c-80a8-4fd2-a986-b6091d194b69', 'Jajaja un crack el naza', '2025-07-28 00:02:55.184-03', '2025-07-28 00:02:55.184-03', '2025-07-28 00:02:55.184-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('eb7d74d9-a94a-4595-9eb0-6e1c4bb09165', 'Gracias amigoo!! ', '2025-07-28 16:21:35.178-03', '2025-07-28 16:21:35.178-03', '2025-07-28 16:21:35.178-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', NULL);
INSERT INTO public."Comentarios" VALUES ('adae1703-84de-433a-b651-fad6d4382a71', 'crackkk', '2025-07-28 16:24:35.587-03', '2025-07-28 16:24:35.588-03', '2025-07-28 16:24:35.588-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('0cf5946c-29bb-4cd2-860c-4c1fc9715287', 'Esoo amigo, vamos con actitud y buena vibra!! ', '2025-07-28 16:23:28.486-03', '2025-07-28 16:23:28.486-03', '2025-07-28 16:23:28.486-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('38328fea-c5bc-429e-bd98-7134639f8712', 'No duden en consultar!! ', '2025-07-29 16:20:33.377-03', '2025-07-29 16:20:33.377-03', '2025-07-29 16:20:33.377-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', 'c4967849-e7d2-476e-8578-090618338f3e');
INSERT INTO public."Comentarios" VALUES ('795da7b9-5f3c-408b-9d2b-43c9c3e3650d', 'Buena pelada brooo', '2025-07-29 16:23:16.102-03', '2025-07-29 16:23:16.102-03', '2025-07-29 16:23:16.102-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('bb768a4f-3b9a-4b75-94a6-87480d03e3de', 'Lo mas parecido a mi hievo derecho', '2025-07-29 16:23:23.004-03', '2025-07-29 16:23:23.004-03', '2025-07-29 16:23:23.004-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Comentarios" VALUES ('0b59fdb3-c360-493f-a11f-949edcc23cc6', 'Holaaa brooo', '2025-07-28 16:18:43.405-03', '2025-07-28 16:18:43.406-03', '2025-07-28 16:18:43.406-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', NULL);
INSERT INTO public."Comentarios" VALUES ('e730d798-3705-4ba2-aafd-78f0ebb7a3d5', 'Muy buenos diseños!! ', '2025-07-30 14:02:05.902-03', '2025-07-30 14:02:05.903-03', '2025-07-30 14:02:05.903-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', 'c4967849-e7d2-476e-8578-090618338f3e');
INSERT INTO public."Comentarios" VALUES ('cc8c3ca8-ba90-4c0d-ae67-fc7e73842e6f', 'asd', '2025-08-07 16:08:37.806-03', '2025-08-07 16:08:37.806-03', '2025-08-07 16:08:37.806-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);


--
-- TOC entry 3370 (class 0 OID 26072)
-- Dependencies: 212
-- Data for Name: Likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Likes" VALUES ('f78f9001-0678-4993-9f9b-99c1c8a1cd56', '2025-07-28 14:56:18.435-03', '2025-07-28 14:56:18.435-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('2ce3669e-66ea-4307-9f93-9dcba5982208', '2025-07-28 00:45:39.377-03', '2025-07-28 00:45:39.377-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('a69b6c2a-757f-420f-9660-7c13066bf1ab', '2025-07-28 00:15:50.504-03', '2025-07-28 00:15:50.504-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('97ac3eed-8a09-4808-ba49-7e5d0aa8be68', '2025-07-28 00:24:57.613-03', '2025-07-28 00:24:57.613-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('c632f6e9-66e5-4c7e-8943-86c445b7bb6c', '2025-07-28 00:01:32.285-03', '2025-07-28 00:01:32.285-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('0008b63f-cca5-4da3-8427-98f4bc52f2aa', '2025-07-28 16:55:13.358-03', '2025-07-28 16:55:13.358-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', NULL);
INSERT INTO public."Likes" VALUES ('8f54871a-6a82-4e14-9e7f-6d3e2e09db50', '2025-07-28 16:56:28.151-03', '2025-07-28 16:56:28.151-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('9fc9e53f-56a8-4966-af57-5006156d06e9', '2025-07-28 16:55:11.416-03', '2025-07-28 16:55:11.416-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', NULL);
INSERT INTO public."Likes" VALUES ('bf3bf1f9-8346-4ec1-b5fe-e20fbbbad017', '2025-07-28 16:55:35.349-03', '2025-07-28 16:55:35.349-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('e0525695-22c5-44be-9cf8-b2a093e63ea9', '2025-07-29 16:23:06.09-03', '2025-07-29 16:23:06.09-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('ba20029a-dffb-4a32-a00a-b0836961a444', '2025-07-28 16:55:15.484-03', '2025-07-28 16:55:15.484-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', NULL);
INSERT INTO public."Likes" VALUES ('c470eae5-c570-4e46-b432-fff0ed397821', '2025-07-29 16:23:26.528-03', '2025-07-29 16:23:26.528-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);
INSERT INTO public."Likes" VALUES ('56b094ff-cbcd-4970-aef0-3e743fee2c76', '2025-08-06 14:30:57.246-03', '2025-08-06 14:30:57.246-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', NULL);
INSERT INTO public."Likes" VALUES ('62ce8934-c399-4003-961d-17c8810d9734', '2025-08-07 14:54:43.915-03', '2025-08-07 14:54:43.915-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', 'c4967849-e7d2-476e-8578-090618338f3e');
INSERT INTO public."Likes" VALUES ('707c3787-c060-430d-bb20-359ebbb35d03', '2025-08-07 15:50:03.637-03', '2025-08-07 15:50:03.637-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f', 'c4967849-e7d2-476e-8578-090618338f3e');
INSERT INTO public."Likes" VALUES ('0b2bd6d0-8890-4e1f-8fc0-a9add3a0483c', '2025-08-07 16:08:31.246-03', '2025-08-07 16:08:31.246-03', '4a5192c3-a94a-43aa-b881-9519b76d3335', NULL);


--
-- TOC entry 3369 (class 0 OID 26060)
-- Dependencies: 211
-- Data for Name: Posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Posts" VALUES ('c4967849-e7d2-476e-8578-090618338f3e', 'uploads\1753816811877-imagen.jpeg', 'Muchas gracias muchachos, esta semana se vienen nuevos diseños!! ', '2025-07-29 16:20:11.887-03', '2025-07-29 16:20:11.89-03', '2025-07-29 16:20:11.89-03', 'a4f7665c-eb35-427b-9352-3dc7a0767f6f');


--
-- TOC entry 3368 (class 0 OID 26047)
-- Dependencies: 210
-- Data for Name: Turnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Turnos" VALUES ('3758f21d-5133-4331-99b3-7981aa938fe0', '2025-08-13', '10:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.344-03', '2025-08-12 15:08:14.344-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('d3f99a3c-db87-4ddc-89df-2d0f9ad4fa1e', '2025-08-12', '09:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:13.864-03', '2025-08-12 15:08:13.864-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('9fbddb1c-bc53-4b00-900f-d79f02b24615', '2025-08-12', '09:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:13.93-03', '2025-08-12 15:08:13.93-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('fef23be4-a957-441f-8750-9f5254cc76c7', '2025-08-12', '10:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:13.968-03', '2025-08-12 15:08:13.968-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('27acc205-6cd7-46a2-b7cb-15290e3186b7', '2025-08-12', '11:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.035-03', '2025-08-12 15:08:14.035-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('d02510d1-aaa1-4374-8c37-6730603129d6', '2025-08-12', '11:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.105-03', '2025-08-12 15:08:14.105-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('e48cc9d4-91cd-4ff0-92cc-da60cfb1d543', '2025-08-12', '13:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.166-03', '2025-08-12 15:08:14.166-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('08b57bfa-1d0d-4604-aecc-85febd0d407e', '2025-08-12', '14:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.216-03', '2025-08-12 15:08:14.216-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('6acd7492-6774-4933-afbd-5c19204e308f', '2025-08-12', '15:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.265-03', '2025-08-12 15:08:14.265-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('3c93f158-b3f8-418c-a4c7-acbde0f739fb', '2025-08-13', '11:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.356-03', '2025-08-12 15:08:14.356-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('88d5bb82-d56b-4587-be15-312fe68b8286', '2025-08-13', '11:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.366-03', '2025-08-12 15:08:14.366-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('a49f786b-5f61-4a0a-b580-dd2a5f0ca2e3', '2025-08-13', '13:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.381-03', '2025-08-12 15:08:14.381-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('6743c988-a76e-46d2-b104-e011f29a5a3b', '2025-08-13', '14:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.388-03', '2025-08-12 15:08:14.388-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('3b693abb-0a34-48ce-99b2-90de4d5a8d8d', '2025-08-13', '15:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.395-03', '2025-08-12 15:08:14.395-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('44d65a7a-46d2-48d1-80dc-d8c1af8f1dd6', '2025-08-13', '15:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.401-03', '2025-08-12 15:08:14.401-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('34264a69-52e2-46d7-bb06-0b2ab28dbbf4', '2025-08-14', '09:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.408-03', '2025-08-12 15:08:14.408-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('1d43ecbb-a539-4456-a7b1-63f1b9e059ae', '2025-08-14', '09:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.415-03', '2025-08-12 15:08:14.415-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('a368f35d-7a03-4a2b-b398-ef63d49d6a15', '2025-08-14', '10:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.429-03', '2025-08-12 15:08:14.429-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('ae6779b5-de47-4234-84b1-9fe7c628508a', '2025-08-14', '11:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.437-03', '2025-08-12 15:08:14.437-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('49670e21-00c4-4a54-8cdd-e3840d10befe', '2025-08-14', '11:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.444-03', '2025-08-12 15:08:14.444-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('09e1bcc1-72b8-442e-8018-8d16b25862ae', '2025-08-14', '13:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.454-03', '2025-08-12 15:08:14.454-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('f55a278e-099a-494d-b459-ff6ff6164d3f', '2025-08-14', '14:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.474-03', '2025-08-12 15:08:14.474-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('f0fe5524-a57f-4362-a084-404a4658c723', '2025-08-14', '15:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.493-03', '2025-08-12 15:08:14.493-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('6bafb3a4-827b-4f14-b26e-d9bb8dd63c14', '2025-08-14', '15:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.51-03', '2025-08-12 15:08:14.51-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('984ef970-1e9f-4c68-961a-bccde1d77a00', '2025-08-15', '09:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.555-03', '2025-08-12 15:08:14.555-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('cda35918-86a1-4c59-9af7-cc68e2bbe1ae', '2025-08-15', '10:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.578-03', '2025-08-12 15:08:14.578-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('967a0d25-9aa8-44a9-937f-30aa1768acf0', '2025-08-15', '11:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.591-03', '2025-08-12 15:08:14.591-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('953ba4cb-c5a5-45b6-a4d7-1e401b5021ab', '2025-08-15', '11:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.606-03', '2025-08-12 15:08:14.606-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('9a69ebe3-dae6-4b27-ab6e-44566adcccc3', '2025-08-15', '13:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.62-03', '2025-08-12 15:08:14.62-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('dae7464a-add0-40a4-9717-42db9819cb05', '2025-08-15', '14:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.636-03', '2025-08-12 15:08:14.636-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('97f35322-93dd-4846-980f-ddb50a831851', '2025-08-15', '15:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.657-03', '2025-08-12 15:08:14.657-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('c469d22c-84b2-4364-87c2-426576d5fed3', '2025-08-15', '15:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.672-03', '2025-08-12 15:08:14.672-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('293f0d50-957b-4e9a-ae51-5b45bc71d549', '2025-08-16', '09:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.694-03', '2025-08-12 15:08:14.694-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('cf46afc6-bcf7-4164-8582-128a2e996a83', '2025-08-16', '09:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.707-03', '2025-08-12 15:08:14.707-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('e458db62-1b89-4cfe-946f-e62f774ec554', '2025-08-16', '10:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.721-03', '2025-08-12 15:08:14.721-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('6df19584-f671-4562-9356-6294cf682179', '2025-08-16', '11:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.736-03', '2025-08-12 15:08:14.736-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('48ada98f-febb-4f3a-8c98-fdf07ef1a936', '2025-08-16', '11:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.756-03', '2025-08-12 15:08:14.756-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('31062c10-ba3d-4f69-a90a-857237efd525', '2025-08-16', '13:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.785-03', '2025-08-12 15:08:14.785-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('3368da52-c2fe-4c75-8d98-ff863f483030', '2025-08-16', '14:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.811-03', '2025-08-12 15:08:14.811-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('2ba6ff91-f41c-48ec-9801-84d1108f18c8', '2025-08-16', '15:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.833-03', '2025-08-12 15:08:14.833-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('d0aad67e-ca35-4242-b453-3d05cb19b672', '2025-08-16', '15:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.85-03', '2025-08-12 15:08:14.85-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('abcd44fd-97e6-446c-b906-21bebd3c00d8', '2025-08-18', '09:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.868-03', '2025-08-12 15:08:14.868-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('d551f6b3-03c3-4a55-a3da-3c4f21676778', '2025-08-18', '09:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.888-03', '2025-08-12 15:08:14.888-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('0ebffcd0-5ce2-4d36-b80a-999f8e58d4c2', '2025-08-18', '10:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.905-03', '2025-08-12 15:08:14.905-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('791fbfbc-0e4f-4d33-9ed7-873548ece302', '2025-08-18', '11:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.934-03', '2025-08-12 15:08:14.934-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('0836a8fb-691b-448b-893b-d7820e8acb78', '2025-08-18', '11:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.957-03', '2025-08-12 15:08:14.957-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('ef5b93ee-4bda-4930-9674-c4717651fb51', '2025-08-18', '13:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.971-03', '2025-08-12 15:08:14.971-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('c4fd7bda-e271-4302-af66-afdc67bac0bb', '2025-08-18', '14:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.983-03', '2025-08-12 15:08:14.983-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('babe8ad9-415f-4c30-af50-cdefd2be898e', '2025-08-18', '15:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:14.997-03', '2025-08-12 15:08:14.997-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('fe4b844f-2a72-4497-9c3d-7459ca753bdd', '2025-08-18', '15:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.007-03', '2025-08-12 15:08:15.007-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('e0e5238c-6ca2-4cdd-a032-8ae5f0b9d2a4', '2025-08-19', '09:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.018-03', '2025-08-12 15:08:15.018-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('47fc5ba9-23ea-4ac8-baa1-528e7569e5ed', '2025-08-19', '09:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.032-03', '2025-08-12 15:08:15.032-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('87544d26-8de6-4004-8f31-dab4d80ebd15', '2025-08-19', '10:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.038-03', '2025-08-12 15:08:15.038-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('964eee64-8406-4e68-be46-56b523850885', '2025-08-19', '11:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.052-03', '2025-08-12 15:08:15.052-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('a298a2e3-a847-4eb7-b06d-113b31a90374', '2025-08-19', '11:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.064-03', '2025-08-12 15:08:15.064-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('13978ddb-a0d1-4534-9380-b1c13bb60eeb', '2025-08-19', '13:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.071-03', '2025-08-12 15:08:15.071-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('35f0df26-d6de-4520-94fa-62119fb91cdd', '2025-08-19', '14:20:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.084-03', '2025-08-12 15:08:15.084-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('22c89689-a9f0-4d68-b382-df50cbc05c9a', '2025-08-19', '15:00:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.097-03', '2025-08-12 15:08:15.097-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('2c5068db-f1d2-4011-a998-b7675e90292b', '2025-08-12', '15:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:12:26.504-03', '2025-08-12 15:13:44.446-03', NULL, NULL);
INSERT INTO public."Turnos" VALUES ('d796f884-8845-45f6-bc10-d6e59ebef105', '2025-08-13', '09:00:00', 'reservado', 'Juan Pedro Fasola', 'juanpredritofasola@gmail.com', '3447505050', '2025-08-12 15:08:14.288-03', '2025-08-12 15:33:31.145-03', NULL, '::1');
INSERT INTO public."Turnos" VALUES ('66591bd5-897b-4e63-b9f9-b720df5405ea', '2025-08-15', '09:00:00', 'reservado', 'Juan Pedro Fasola', 'juanpredritofasola@gmail.com', '3447505050', '2025-08-12 15:08:14.535-03', '2025-08-12 15:36:14.993-03', NULL, '::1');
INSERT INTO public."Turnos" VALUES ('0048e5d6-8afb-428d-9b6f-e782b6223afb', '2025-08-13', '09:40:00', 'reservado', 'Juan Pedro Fasola', 'juanpredritofasola@gmail.com', '3447505050', '2025-08-12 15:08:14.33-03', '2025-08-12 15:39:51.859-03', NULL, '::1');
INSERT INTO public."Turnos" VALUES ('e5b49207-54ae-4a6f-82ae-ea3b1794253e', '2025-08-19', '15:40:00', 'disponible', NULL, NULL, NULL, '2025-08-12 15:08:15.104-03', '2025-08-12 15:08:15.104-03', NULL, NULL);


--
-- TOC entry 3367 (class 0 OID 26029)
-- Dependencies: 209
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Usuarios" VALUES ('4a5192c3-a94a-43aa-b881-9519b76d3335', 'Lihuen', 'lihuensg@gmail.com', '$2b$10$k9D6dO9gIVewj.7SsfBhCee4Sd5V3Wl3IOUWPHIG8QUjc1ogVXukC', '3447504626', 'cliente', '2025-07-22 16:30:34.853-03', '2025-07-22 16:30:34.855-03', '2025-07-30 14:02:36.195-03', '1753894944529-foto_perfil.jpg', NULL);
INSERT INTO public."Usuarios" VALUES ('1d0d836a-cc5c-47f5-8566-9f070c8a6a15', 'Juan', 'juan@gmail.com', '$2b$10$vQBjN5Wb4SfEerq5egCsLu0swhw4I6nEmK6g/bYAUT7Ji3sSQxmVa', '3447505050', 'cliente', '2025-08-05 13:23:29.633-03', '2025-08-05 13:23:29.635-03', '2025-08-05 13:23:29.635-03', NULL, NULL);
INSERT INTO public."Usuarios" VALUES ('63a35a88-1edf-4252-a2ad-29748c4bc499', 'gorito', 'gorito@gmail.com', '$2b$10$a2oTlEibRCwaYw/L4E25nO6Unm9iZ4bg2d4eoUJwqVYzGu9r/p6eO', '1235', 'cliente', '2025-08-05 13:24:54.653-03', '2025-08-05 13:24:54.653-03', '2025-08-05 13:24:54.653-03', NULL, NULL);
INSERT INTO public."Usuarios" VALUES ('01f9a338-aa6d-48a7-8b56-f81755b21380', 'Gorito', 'brian@gmail.com', '$2b$10$jdFOVUUguZis14cZm7W23OkWsKWpHizSKJ9sdwyO4Cl.oFS7vxR4a', '12345', 'cliente', '2025-08-06 14:26:57.138-03', '2025-08-06 14:26:57.139-03', '2025-08-06 14:26:57.139-03', NULL, NULL);
INSERT INTO public."Usuarios" VALUES ('a4f7665c-eb35-427b-9352-3dc7a0767f6f', 'Naza', 'admin@barber.com', '$2b$10$D/c7OpbEOwOpb5J3ZH9jyupA24D8f4m9fZesJ3MaQDiW5aEuBchS.', '3447562289', 'admin', '2025-07-22 16:29:30.439-03', '2025-07-22 16:29:30.441-03', '2025-08-12 15:33:16.292-03', NULL, 'naza.wicky');


--
-- TOC entry 3221 (class 2606 OID 26093)
-- Name: Comentarios Comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comentarios"
    ADD CONSTRAINT "Comentarios_pkey" PRIMARY KEY (id);


--
-- TOC entry 3219 (class 2606 OID 26076)
-- Name: Likes Likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3217 (class 2606 OID 26066)
-- Name: Posts Posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_pkey" PRIMARY KEY (id);


--
-- TOC entry 3215 (class 2606 OID 26054)
-- Name: Turnos Turnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3191 (class 2606 OID 26511)
-- Name: Usuarios Usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key" UNIQUE (email);


--
-- TOC entry 3193 (class 2606 OID 26513)
-- Name: Usuarios Usuarios_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key1" UNIQUE (email);


--
-- TOC entry 3195 (class 2606 OID 26531)
-- Name: Usuarios Usuarios_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key10" UNIQUE (email);


--
-- TOC entry 3197 (class 2606 OID 26515)
-- Name: Usuarios Usuarios_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key2" UNIQUE (email);


--
-- TOC entry 3199 (class 2606 OID 26517)
-- Name: Usuarios Usuarios_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key3" UNIQUE (email);


--
-- TOC entry 3201 (class 2606 OID 26519)
-- Name: Usuarios Usuarios_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key4" UNIQUE (email);


--
-- TOC entry 3203 (class 2606 OID 26521)
-- Name: Usuarios Usuarios_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key5" UNIQUE (email);


--
-- TOC entry 3205 (class 2606 OID 26523)
-- Name: Usuarios Usuarios_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key6" UNIQUE (email);


--
-- TOC entry 3207 (class 2606 OID 26525)
-- Name: Usuarios Usuarios_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key7" UNIQUE (email);


--
-- TOC entry 3209 (class 2606 OID 26527)
-- Name: Usuarios Usuarios_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key8" UNIQUE (email);


--
-- TOC entry 3211 (class 2606 OID 26529)
-- Name: Usuarios Usuarios_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key9" UNIQUE (email);


--
-- TOC entry 3213 (class 2606 OID 26036)
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);


--
-- TOC entry 3227 (class 2606 OID 26562)
-- Name: Comentarios Comentarios_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comentarios"
    ADD CONSTRAINT "Comentarios_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Posts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3226 (class 2606 OID 26557)
-- Name: Comentarios Comentarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comentarios"
    ADD CONSTRAINT "Comentarios_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3225 (class 2606 OID 26552)
-- Name: Likes Likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Posts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3224 (class 2606 OID 26547)
-- Name: Likes Likes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3223 (class 2606 OID 26542)
-- Name: Posts Posts_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3222 (class 2606 OID 26537)
-- Name: Turnos Turnos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_cliente_id_fkey" FOREIGN KEY (cliente_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-08-13 15:29:01

--
-- PostgreSQL database dump complete
--


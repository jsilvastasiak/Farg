-- Geração de Modelo físico
-- Sql ANSI 2003 - brModelo.

CREATE SEQUENCE public."Categorias_cdg_categoria_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Categorias_cdg_categoria_seq"
    OWNER TO postgres;
	
CREATE SEQUENCE public."Clientes_cdg_cliente_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Clientes_cdg_cliente_seq"
    OWNER TO postgres;
	
CREATE SEQUENCE public."Enderecos_cdg_endereco_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Enderecos_cdg_endereco_seq"
    OWNER TO postgres;
	
CREATE SEQUENCE public."Formas_pagamentos_cdg_forma_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Formas_pagamentos_cdg_forma_seq"
    OWNER TO postgres;
	
CREATE SEQUENCE public."Grades_cdg_grade_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Grades_cdg_grade_seq"
    OWNER TO postgres;

CREATE SEQUENCE public."Pedidos_cdg_pedido_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Pedidos_cdg_pedido_seq"
    OWNER TO postgres;
	
CREATE SEQUENCE public."Produtos_cdg_produto_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Produtos_cdg_produto_seq"
    OWNER TO postgres;
	
CREATE SEQUENCE public."Usuarios_cdg_usuario_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Usuarios_cdg_usuario_seq"
    OWNER TO postgres;

-- Table: public."Usuarios"

-- DROP TABLE public."Usuarios";

CREATE TABLE public."Usuarios"
(
    cdg_usuario integer NOT NULL DEFAULT nextval('"Usuarios_cdg_usuario_seq"'::regclass),
    nom_login text COLLATE pg_catalog."default",
    snh_usuario text COLLATE pg_catalog."default",
    idc_administrador text COLLATE pg_catalog."default",
    idc_representante text COLLATE pg_catalog."default",
    idc_cliente text COLLATE pg_catalog."default",
    idc_ativo text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Usuarios_pkey" PRIMARY KEY (cdg_usuario),
    CONSTRAINT "Usuarios_nom_login_key" UNIQUE (nom_login)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Usuarios"
    OWNER to postgres;

-- Table: public."Clientes"

-- DROP TABLE public."Clientes";

CREATE TABLE public."Clientes"
(
    cdg_cliente integer NOT NULL DEFAULT nextval('"Clientes_cdg_cliente_seq"'::regclass),
    nom_cliente character varying(50) COLLATE pg_catalog."default" NOT NULL,
    tip_pessoa character varying(1) COLLATE pg_catalog."default" NOT NULL,
    per_desconto numeric(5, 2),
    nro_cnpj character varying(14) COLLATE pg_catalog."default",
    nro_cpf character varying(11) COLLATE pg_catalog."default",
    dta_cadastro timestamp with time zone,
    end_email character varying(50) COLLATE pg_catalog."default",
    cdg_representante integer,
    cdg_usuario integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Clientes_pkey" PRIMARY KEY (cdg_cliente),
    CONSTRAINT "Clientes_cdg_representante_fkey" FOREIGN KEY (cdg_representante)
        REFERENCES public."Usuarios" (cdg_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE,
    CONSTRAINT "Clientes_cdg_usuario_fkey" FOREIGN KEY (cdg_usuario)
        REFERENCES public."Usuarios" (cdg_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Clientes"
    OWNER to postgres;

-- Table: public."Enderecos"

-- DROP TABLE public."Enderecos";

CREATE TABLE public."Enderecos"
(
    cdg_cliente integer NOT NULL,
    cdg_endereco integer NOT NULL DEFAULT nextval('"Enderecos_cdg_endereco_seq"'::regclass),
    tip_endereco text COLLATE pg_catalog."default" NOT NULL,
    sgl_estado character varying(2) COLLATE pg_catalog."default" NOT NULL,
    nom_cidade text COLLATE pg_catalog."default" NOT NULL,
    nom_rua text COLLATE pg_catalog."default" NOT NULL,
    nom_bairro text COLLATE pg_catalog."default" NOT NULL,
    nro_end integer NOT NULL,
    nro_cep text COLLATE pg_catalog."default",
    cpl_end text COLLATE pg_catalog."default",
    nro_fon_pri text COLLATE pg_catalog."default",
    ddd_fon_pri text COLLATE pg_catalog."default",
    nro_fon_sec text COLLATE pg_catalog."default",
    ddd_fon_sec text COLLATE pg_catalog."default",
    nro_celular text COLLATE pg_catalog."default",
    ddd_celular text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Enderecos_pkey" PRIMARY KEY (cdg_cliente, cdg_endereco),
    CONSTRAINT "Enderecos_cdg_cliente_fkey" FOREIGN KEY (cdg_cliente)
        REFERENCES public."Clientes" (cdg_cliente) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Enderecos"
    OWNER to postgres;
	
-- Table: public."Categorias"

-- DROP TABLE public."Categorias";

CREATE TABLE public."Categorias"
(
    cdg_categoria integer NOT NULL DEFAULT nextval('"Categorias_cdg_categoria_seq"'::regclass),
    nom_categoria text COLLATE pg_catalog."default" NOT NULL,
    idc_ativo character varying(1) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Categorias_pkey" PRIMARY KEY (cdg_categoria)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Categorias"
    OWNER to postgres;

-- Table: public."Grades"

-- DROP TABLE public."Grades";

CREATE TABLE public."Grades"
(
    cdg_grade integer NOT NULL DEFAULT nextval('"Grades_cdg_grade_seq"'::regclass),
    dsc_grade text COLLATE pg_catalog."default" NOT NULL,
    per_desconto numeric(5, 4),
    qtd_minima integer NOT NULL,
    idc_ativo text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Grades_pkey" PRIMARY KEY (cdg_grade)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Grades"
    OWNER to postgres;

-- Table: public."Formas_pagamentos"

-- DROP TABLE public."Formas_pagamentos";

CREATE TABLE public."Formas_pagamentos"
(
    cdg_forma integer NOT NULL DEFAULT nextval('"Formas_pagamentos_cdg_forma_seq"'::regclass),
    dsc_forma text COLLATE pg_catalog."default" NOT NULL,
    per_desconto numeric(5, 4),
    idc_ativo character varying(1) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Formas_pagamentos_pkey" PRIMARY KEY (cdg_forma)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Formas_pagamentos"
    OWNER to postgres;

-- Table: public."Produtos"

-- DROP TABLE public."Produtos";

CREATE TABLE public."Produtos"
(
    cdg_produto integer NOT NULL DEFAULT nextval('"Produtos_cdg_produto_seq"'::regclass),
    cdg_categoria integer,
    nom_produto text COLLATE pg_catalog."default" NOT NULL,
    vlr_icms_8 numeric(10, 2) NOT NULL,
    vlr_icms_12 numeric(10, 2) NOT NULL,
    vlr_icms_17 numeric(10, 2) NOT NULL,
    idc_ativo text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Produtos_pkey" PRIMARY KEY (cdg_produto),
    CONSTRAINT "Produtos_cdg_categoria_fkey" FOREIGN KEY (cdg_categoria)
        REFERENCES public."Categorias" (cdg_categoria) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Produtos"
    OWNER to postgres;	

-- Table: public."Pedidos"

-- DROP TABLE public."Pedidos";

CREATE TABLE public."Pedidos"
(
    cdg_pedido integer NOT NULL DEFAULT nextval('"Pedidos_cdg_pedido_seq"'::regclass),
    cdg_cliente integer NOT NULL,
    cdg_forma integer NOT NULL,
    dta_pedido timestamp with time zone,
    sts_pedido text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Pedidos_pkey" PRIMARY KEY (cdg_pedido, cdg_cliente),
    CONSTRAINT "Pedidos_cdg_cliente_fkey" FOREIGN KEY (cdg_cliente)
        REFERENCES public."Clientes" (cdg_cliente) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE,
    CONSTRAINT "Pedidos_cdg_forma_fkey" FOREIGN KEY (cdg_forma)
        REFERENCES public."Formas_pagamentos" (cdg_forma) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Pedidos"
    OWNER to postgres;


CREATE TABLE Items_pedido (
cdg_item Number(5),
cdg_pedido Number(5),
cdg_produto Number(5),
vlr_atribuido Number(10,2),
qtd_produto Number(5),
cdg_grade Número(2),
PRIMARY KEY(cdg_item,cdg_pedido),
FOREIGN KEY(/*erro: ??*/) REFERENCES Pedidos (cdg_pedido,cdg_cliente)
)


-- Table: public.cg_ref_codes

-- DROP TABLE public.cg_ref_codes;

CREATE TABLE public.cg_ref_codes
(
    dsc_dominio character varying(20) COLLATE pg_catalog."default",
    sgl_dominio character varying(1) COLLATE pg_catalog."default",
    dsc_significado character varying(50) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.cg_ref_codes
    OWNER to postgres;
COMMENT ON TABLE public.cg_ref_codes
    IS 'Tabela de Siglas e Significados do sistema';
	
-- Table: public."Codigo_icms"

-- DROP TABLE public."Codigo_icms";

CREATE TABLE public."Codigo_icms"
(
    uf_origem character varying(3) COLLATE pg_catalog."default" NOT NULL,
    uf_destino character varying(3) COLLATE pg_catalog."default" NOT NULL,
    cdg_icms integer NOT NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Codigo_icms"
    OWNER to postgres;
COMMENT ON TABLE public."Codigo_icms"
    IS 'Tabela de códigos icms para clientes';

INSERT INTO public."Usuarios"(
	cdg_usuario, nom_login, snh_usuario, idc_administrador, idc_representante, idc_cliente, idc_ativo, "createdAt", "updatedAt")
	VALUES (nextval('"Usuarios_cdg_usuario_seq"'::regclass), 'FARG', '1234', 'S', 'N', 'N', 'A', Current_date, Current_date);

INSERT INTO public.cg_ref_codes(
	dsc_dominio, sgl_dominio, dsc_significado)
	VALUES ('ACTIVE_INACTIVE', 'I', 'Inativo');

INSERT INTO public.cg_ref_codes(
	dsc_dominio, sgl_dominio, dsc_significado)
	VALUES ('ACTIVE_INACTIVE', 'A', 'Ativo');

INSERT INTO public.cg_ref_codes(
	dsc_dominio, sgl_dominio, dsc_significado)
	VALUES ('TIPO_ENDERECO', 'C', 'Cobrança');

INSERT INTO public.cg_ref_codes(
	dsc_dominio, sgl_dominio, dsc_significado)
	VALUES ('TIPO_ENDERECO', 'M', 'Comercial');
    
INSERT INTO public.cg_ref_codes(
	dsc_dominio, sgl_dominio, dsc_significado)
	VALUES ('TIPO_ENDERECO', 'O', 'Outros');

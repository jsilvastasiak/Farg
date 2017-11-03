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
    cdg_pedido integer NOT NULL,
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


-- Table: public."Items_pedidos"

-- DROP TABLE public."Items_pedidos";

CREATE TABLE public."Items_pedidos"
(
    cdg_item integer NOT NULL,
    cdg_pedido integer NOT NULL,
    cdg_cliente integer NOT NULL,
    cdg_produto integer NOT NULL,
    vlr_atribuido numeric(10, 2) NOT NULL,
    qtd_grade integer NOT NULL,
    cdg_grade integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Items_pedidos_pkey" PRIMARY KEY (cdg_item, cdg_pedido, cdg_cliente),
    CONSTRAINT "Items_pedidos_cdg_grade_fkey" FOREIGN KEY (cdg_grade)
        REFERENCES public."Grades" (cdg_grade) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE,
    CONSTRAINT "Items_pedidos_cdg_produto_fkey" FOREIGN KEY (cdg_produto)
        REFERENCES public."Produtos" (cdg_produto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE,
    CONSTRAINT cdg_pedido_cdg_cliente_fk FOREIGN KEY (cdg_pedido, cdg_cliente)
        REFERENCES public."Pedidos" (cdg_pedido, cdg_cliente) MATCH FULL
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Items_pedidos"
    OWNER to postgres;


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

-- Table: public."Constantes"

-- DROP TABLE public."Constantes";

CREATE TABLE public."Constantes"
(
    codigo integer NOT NULL,
    descricao character varying(50) COLLATE pg_catalog."default" NOT NULL,
    valor character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Constantes_pkey" PRIMARY KEY (codigo)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Constantes"
    OWNER to postgres;
COMMENT ON TABLE public."Constantes"
    IS 'Valores padrão do sistema.';

ALTER TABLE public."Codigo_icms"
    OWNER to postgres;
COMMENT ON TABLE public."Codigo_icms"
    IS 'Tabela de códigos icms para clientes';

-- Regra de chave estrangeira não colocada pelo sequelize	
alter table "Items_pedidos" add constraint cdg_pedido_cdg_cliente_fk foreign key (cdg_pedido, cdg_cliente) references "Pedidos" (cdg_pedido, cdg_cliente) match full;	

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
	
INSERT INTO public.cg_ref_codes(
	dsc_dominio, sgl_dominio, dsc_significado)
	VALUES ('TIPO_ENDERECO', 'E', 'Entrega');

-- Inclusão de constantes
INSERT INTO public."Constantes"(
	codigo, descricao, valor)
	VALUES (1, 'Estado da empresa', 'SC');

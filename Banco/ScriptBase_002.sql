INSERT INTO cg_ref_codes(dsc_dominio, sgl_dominio, dsc_significado)
	  VALUES ('STATUS_PEDIDO', 'A', 'Análise');
INSERT INTO cg_ref_codes(dsc_dominio, sgl_dominio, dsc_significado)
	  VALUES ('STATUS_PEDIDO', 'E', 'Entregue');
INSERT INTO cg_ref_codes(dsc_dominio, sgl_dominio, dsc_significado)
	  VALUES ('STATUS_PEDIDO', 'P', 'Em produção');
INSERT INTO cg_ref_codes(dsc_dominio, sgl_dominio, dsc_significado)
	  VALUES ('STATUS_PEDIDO', 'R', 'Recusado');
	  
CREATE TABLE "Parametros_gerais"
(
    cdg_empresa integer NOT NULL,
    cdg_filial integer NOT NULL,
    nom_fantasia text COLLATE pg_catalog."default",
    nom_host_email text COLLATE pg_catalog."default",
    nro_port_email integer,
    nom_usuario_email text COLLATE pg_catalog."default",
    snh_usuario_email text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Parametros_gerais_pkey" PRIMARY KEY (cdg_empresa, cdg_filial)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE "Parametros_gerais"
    ADD COLUMN email_remetente character varying(50) COLLATE pg_catalog."default";

	
CREATE TABLE "Grade_produtos"
(
    cdg_grade integer NOT NULL,
    cdg_produto integer NOT NULL,
    idc_habilitado text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Grade_produtos_pkey" PRIMARY KEY (cdg_grade, cdg_produto),
    CONSTRAINT "Grade_produtos_cdg_grade_fkey" FOREIGN KEY (cdg_grade)
        REFERENCES "Grades" (cdg_grade) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE,
    CONSTRAINT "Grade_produtos_cdg_produto_fkey" FOREIGN KEY (cdg_produto)
        REFERENCES "Produtos" (cdg_produto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE
)
WITH (
    OIDS = FALSE
);

COMMENT ON COLUMN "Parametros_gerais".email_remetente
    IS 'Email que será usado como remetente pelo sistema para envio de mensagens para outros.';

INSERT INTO "Parametros_gerais"(
	cdg_empresa, cdg_filial, nom_fantasia, nom_host_email, nro_port_email, nom_usuario_email, snh_usuario_email, email_remetente, "createdAt", "updatedAt")
	VALUES (1, 1, null, null, null, null, null, null, current_date, current_date);
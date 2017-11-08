CREATE OR REPLACE FUNCTION pegadata(
	prm_date timestamp with time zone)
    RETURNS text
    LANGUAGE 'plpgsql'
    
AS $BODY$

begin
  
  return to_char(prm_date,'MM/DD/YYYY');
  
exception
  when others then  	
    return null;
    --result_message := 'Erro genérico na stored procedure InsereCliente -> ' || MESSAGE_TEXT || ' ' || PG_EXCEPTION_DETAIL;
end;
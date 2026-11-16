-- =============================================================================
-- Elimina la organización demo creada por supabase/seeds/demo-org.sql.
-- Solo toca filas del tenant fijo de-3…0001. No borra el usuario de auth.users
-- (eso se hace a mano en el dashboard); sí lo desvincula del tenant.
-- =============================================================================
do $$
declare
  v_tenant constant uuid := 'de300000-0000-4000-8000-000000000001';
  v_role   constant uuid := 'de300000-0000-4000-8000-000000000003';
begin
  if not exists (select 1 from public.tenants where id = v_tenant) then
    raise notice 'No existe el tenant demo; nada que limpiar.';
    return;
  end if;

  delete from ong.participaciones_proyecto where tenant_id = v_tenant;
  delete from ong.beneficiarios           where tenant_id = v_tenant;
  delete from ong.horas_actividad         where tenant_id = v_tenant;
  delete from ong.aprobaciones            where tenant_id = v_tenant;
  delete from ong.asignaciones_actividad  where tenant_id = v_tenant;
  delete from ong.asistencias             where tenant_id = v_tenant;
  delete from ong.tareas                  where tenant_id = v_tenant;
  delete from ong.actividades             where tenant_id = v_tenant;
  delete from ong.asignaciones_proyecto   where tenant_id = v_tenant;
  delete from ong.proyectos               where tenant_id = v_tenant;
  delete from ong.voluntarios             where tenant_id = v_tenant;
  delete from ong.ubicaciones             where tenant_id = v_tenant;
  delete from ong.areas                   where tenant_id = v_tenant;

  delete from public.user_roles_sedes where tenant_id = v_tenant;
  delete from public.memberships      where tenant_id = v_tenant;
  delete from public.role_permissions where role_id = v_role;
  delete from public.roles            where tenant_id = v_tenant;
  delete from public.sedes            where tenant_id = v_tenant;
  update public.profiles set tenant_id = null where tenant_id = v_tenant;
  delete from public.tenants          where id = v_tenant;

  raise notice 'Tenant demo eliminado.';
end $$;

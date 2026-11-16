-- =============================================================================
-- Organización demo FICTICIA para capturas del landing (módulo ONG).
--
-- Requisito previo: el usuario demo ya existe en auth.users, confirmado.
-- Puede crearse en el dashboard de Supabase (Authentication → Add user, "Auto confirm")
-- o por SQL sin contraseña, y luego fijarla con «Send password recovery».
-- El trigger on_auth_user_created le crea su fila en public.profiles.
-- Este script NO crea usuarios ni contraseñas.
-- Uso:  set demo.email = 'correo@ejemplo.com';  y luego este bloque.
--
-- Idempotente: si el tenant demo ya existe, no hace nada.
-- Limpieza: supabase/seeds/demo-org-cleanup.sql
-- Todos los nombres, documentos y teléfonos son inventados.
-- =============================================================================
do $$
declare
  -- Correo del usuario demo: `set demo.email = '...';` antes del bloque, o el valor por defecto.
  v_email     constant text := coalesce(nullif(current_setting('demo.email', true), ''), 'demo@democra.pro');
  v_tenant    constant uuid := 'de300000-0000-4000-8000-000000000001';
  v_sede      constant uuid := 'de300000-0000-4000-8000-000000000002';
  v_role      constant uuid := 'de300000-0000-4000-8000-000000000003';
  v_user      uuid;
  v_area_edu  uuid := gen_random_uuid();
  v_area_amb  uuid := gen_random_uuid();
  v_area_sal  uuid := gen_random_uuid();
  v_ubi1      uuid := gen_random_uuid();
  v_ubi2      uuid := gen_random_uuid();
  v_p1        uuid := gen_random_uuid();
  v_p2        uuid := gen_random_uuid();
  v_p3        uuid := gen_random_uuid();
  v_p4        uuid := gen_random_uuid();
  v_a         uuid[] := array[gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
                              gen_random_uuid(), gen_random_uuid(), gen_random_uuid()];
  v_v         uuid[] := array[]::uuid[];
  v_h         uuid;
  i           int;
  nombres     text[] := array['Lucía','Mateo','Valeria','Diego','Camila','Andrés','Sofía','Joaquín','Renata','Gabriel'];
  apellidos   text[] := array['Quispe Rojas','Huamán Torres','Cárdenas Vega','Ccori Mendoza','Palomino Ruiz',
                              'Gutiérrez Soto','Tineo Flores','Medina Prado','Bellido Ramos','Sulca Núñez'];
  estados_v   text[] := array['activo','activo','activo','activo','activo','activo','en_proceso','activo','en_proceso','inactivo'];
begin
  select id into v_user from auth.users where email = v_email;
  if v_user is null then
    raise exception 'No existe el usuario % en auth.users. Créalo primero en el dashboard.', v_email;
  end if;

  if exists (select 1 from public.tenants where id = v_tenant) then
    raise notice 'El tenant demo ya existe; no se hace nada.';
    return;
  end if;

  -- 1. Organización, sede, rol Owner con todos los permisos del catálogo
  insert into public.tenants (id, name, tax_id, industry_type_id, plan_id, status_financial_id, billing_day, max_licenses)
  values (v_tenant, 'Red Solidaria Andina (demo)', '20999999901', 'ong', 'basic', 'FIN-ACTIVE', 1, 5);

  insert into public.sedes (id, tenant_id, name, is_active) values (v_sede, v_tenant, 'Sede central', true);

  insert into public.roles (id, tenant_id, name, hierarchy_level, is_system_role)
  values (v_role, v_tenant, 'Owner', 0, true);

  insert into public.role_permissions (role_id, permission)
  select v_role, id from public.cat_permissions
  on conflict do nothing;

  insert into public.profiles (id, tenant_id, full_name, email_verified)
  values (v_user, v_tenant, 'Coordinación Demo', true)
  on conflict (id) do update
    set tenant_id = excluded.tenant_id, full_name = excluded.full_name, email_verified = true;

  insert into public.user_roles_sedes (tenant_id, user_id, role_id, sede_id)
  values (v_tenant, v_user, v_role, v_sede)
  on conflict do nothing;

  -- 2. Catálogos propios del tenant
  insert into ong.areas (id, tenant_id, codigo, nombre_area, descripcion) values
    (v_area_edu, v_tenant, 'EDU', 'Educación', 'Refuerzo escolar y lectura'),
    (v_area_amb, v_tenant, 'AMB', 'Medio ambiente', 'Reforestación y limpieza de cuencas'),
    (v_area_sal, v_tenant, 'SAL', 'Salud comunitaria', 'Campañas de prevención');

  insert into ong.ubicaciones (id, tenant_id, codigo, nombre_ubicacion, direccion, latitud, longitud) values
    (v_ubi1, v_tenant, 'UBI-01', 'Local comunal Las Flores', 'Jr. Ejemplo 123', -13.1588, -74.2232),
    (v_ubi2, v_tenant, 'UBI-02', 'Parque del Río', 'Av. Demostración s/n', -13.1631, -74.2180);

  -- 3. Proyectos (uno por etapa)
  insert into ong.proyectos (id, tenant_id, codigo, nombre_proyecto, descripcion, fecha_inicio, fecha_fin, id_area, codigo_estado, presupuesto) values
    (v_p1, v_tenant, 'PRY-001', 'Leer para crecer', 'Talleres de lectura para niños de primaria.',
       current_date - 60, current_date + 90, v_area_edu, 'ejecucion', 12000),
    (v_p2, v_tenant, 'PRY-002', 'Cuenca limpia', 'Jornadas mensuales de limpieza y reforestación.',
       current_date - 20, current_date + 160, v_area_amb, 'ejecucion', 8500),
    (v_p3, v_tenant, 'PRY-003', 'Salud en tu barrio', 'Campaña de prevención y tamizaje.',
       current_date + 15, current_date + 120, v_area_sal, 'planificacion', 15000),
    (v_p4, v_tenant, 'PRY-000', 'Útiles para todos', 'Colecta y entrega de útiles escolares.',
       current_date - 150, current_date - 30, v_area_edu, 'completado', 4000);

  -- 4. Voluntarios
  for i in 1..10 loop
    v_v := v_v || gen_random_uuid();
    insert into ong.voluntarios (id, tenant_id, numero_documento, tipo_documento, nombre, apellido, email, telefono, codigo_estado, genero)
    values (v_v[i], v_tenant, lpad((90000000 + i)::text, 8, '0'), 'DNI', nombres[i], apellidos[i],
            'voluntario' || i || '@ejemplo.invalid', '900000' || lpad(i::text, 3, '0'), estados_v[i],
            case when i % 2 = 1 then 'F' else 'M' end);
  end loop;

  insert into ong.asignaciones_proyecto (tenant_id, id_proyecto, id_voluntario, rol_en_proyecto, fecha_ingreso)
  select v_tenant, p, v, r, current_date - 30
  from (values
    (v_p1, 1, 'Coordinadora'), (v_p1, 2, 'Facilitador'), (v_p1, 3, 'Facilitadora'), (v_p1, 4, 'Apoyo'),
    (v_p2, 5, 'Coordinadora'), (v_p2, 6, 'Apoyo'), (v_p2, 7, 'Apoyo'), (v_p2, 8, 'Apoyo'),
    (v_p3, 9, 'Coordinadora'), (v_p3, 2, 'Apoyo')
  ) as x(p, idx, r), lateral (select v_v[idx] as v) vv;

  -- 5. Actividades
  insert into ong.actividades (id, tenant_id, id_proyecto, titulo, descripcion, codigo_estado, fecha_inicio, fecha_fin, horas_estimadas, id_ubicacion) values
    (v_a[1], v_tenant, v_p1, 'Taller de lectura — grupo A', 'Sesión semanal con 3.º y 4.º grado.', 'completada',
       now() - interval '9 days', now() - interval '9 days' + interval '3 hours', 3, v_ubi1),
    (v_a[2], v_tenant, v_p1, 'Taller de lectura — grupo B', 'Sesión semanal con 5.º y 6.º grado.', 'completada',
       now() - interval '2 days', now() - interval '2 days' + interval '3 hours', 3, v_ubi1),
    (v_a[3], v_tenant, v_p1, 'Feria del libro', 'Intercambio de libros con las familias.', 'planificada',
       now() + interval '12 days', now() + interval '12 days' + interval '5 hours', 5, v_ubi1),
    (v_a[4], v_tenant, v_p2, 'Limpieza ribera norte', 'Recolección de residuos y clasificación.', 'completada',
       now() - interval '5 days', now() - interval '5 days' + interval '4 hours', 4, v_ubi2),
    (v_a[5], v_tenant, v_p2, 'Plantación de queñuales', 'Plantación de 200 plantones nativos.', 'en_progreso',
       now(), now() + interval '6 hours', 6, v_ubi2),
    (v_a[6], v_tenant, v_p3, 'Capacitación de promotores', 'Formación previa a la campaña.', 'pendiente',
       now() + interval '20 days', now() + interval '20 days' + interval '4 hours', 4, v_ubi1);

  insert into ong.asignaciones_actividad (tenant_id, id_actividad, id_voluntario, rol_en_actividad)
  select v_tenant, a, v_v[idx], 'Voluntario'
  from (values (1,1),(1,2),(1,3),(2,1),(2,2),(2,4),(3,1),(3,3),(4,5),(4,6),(4,7),(5,5),(5,6),(5,8),(6,9),(6,2)) as x(ai, idx),
       lateral (select v_a[ai] as a) aa;

  -- 6. Horas registradas: aprobadas, rechazada y pendientes (con su aprobación)
  insert into ong.horas_actividad (tenant_id, id_actividad, id_voluntario, horas_registradas, fecha, estado_aprobacion, aprobado_por)
  select v_tenant, v_a[ai], v_v[idx], h, (current_date - d), 'aprobada', v_user
  from (values (1,1,3,9),(1,2,3,9),(1,3,2.5,9),(4,5,4,5),(4,6,4,5),(4,7,3.5,5)) as x(ai, idx, h, d);

  insert into ong.horas_actividad (tenant_id, id_actividad, id_voluntario, horas_registradas, fecha, estado_aprobacion, aprobado_por, comentario_resolucion)
  values (v_tenant, v_a[4], v_v[8], 6, current_date - 5, 'rechazada', v_user, 'Supera la duración de la actividad.');

  -- Pendientes: voluntarios 1, 2 y 4 en el taller B (hace 2 días)
  foreach i in array array[1, 2, 4] loop
    v_h := gen_random_uuid();
    insert into ong.horas_actividad (id, tenant_id, id_actividad, id_voluntario, horas_registradas, fecha, estado_aprobacion)
    values (v_h, v_tenant, v_a[2], v_v[i], case when i = 4 then 2.5 else 3 end, current_date - 2, 'pendiente');

    insert into ong.aprobaciones (id, tenant_id, modulo, entidad_schema, entidad_tabla, entidad_id, tipo_aprobacion, estado, solicitado_por, requested_at)
    values (gen_random_uuid(), v_tenant, 'operation', 'ong', 'horas_actividad', v_h, 'hora', 'pendiente', v_user, now() - interval '2 days')
    returning id into v_h;

    update ong.horas_actividad set id_aprobacion = v_h
    where tenant_id = v_tenant and id_aprobacion is null and estado_aprobacion = 'pendiente' and id_voluntario = v_v[i];
  end loop;

  -- 7. Beneficiarios
  insert into ong.beneficiarios (tenant_id, nombre, apellido, tipo_documento, numero_documento, genero, fecha_nacimiento)
  select v_tenant, n, a, 'DNI', lpad((80000000 + g)::text, 8, '0'), case when g % 2 = 0 then 'F' else 'M' end,
         current_date - ((8 + g % 4) * 365)
  from (values ('Ana','Pérez Lima',1),('Bruno','Ayala Cruz',2),('Clara','Ríos Mamani',3),
               ('Dante','León Huayta',4),('Elena','Vargas Poma',5),('Fabio','Rojas Ccasa',6)) as x(n, a, g);

  insert into ong.participaciones_proyecto (tenant_id, id_proyecto, id_beneficiario)
  select v_tenant, v_p1, id from ong.beneficiarios where tenant_id = v_tenant;

  raise notice 'Tenant demo creado: %', v_tenant;
end $$;

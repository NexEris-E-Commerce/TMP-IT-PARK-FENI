-- ============================================================================
-- Stock reservation (atomic, race-condition-safe)
-- ============================================================================
-- Products have no client-writable RLS policy on purpose (see "products:
-- public read" above) — the anon/authenticated keys used by the storefront
-- can't UPDATE stock directly. These SECURITY DEFINER functions are the one
-- narrow, validated way checkout is allowed to touch stock: they only ever
-- move stock by the caller-specified amount for caller-specified products,
-- nothing else.
--
-- `reserve_stock_for_order` locks each product row (FOR UPDATE) inside a
-- single transaction, so two customers checking out the last unit of the
-- same product at the same time can't both succeed — the second call waits
-- for the first to finish, then correctly sees the reduced stock and fails
-- if there's not enough left. On any shortfall the whole function raises an
-- exception, which rolls back every decrement it already made in this call.
create or replace function public.reserve_stock_for_order(items jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_current_stock integer;
  v_name text;
begin
  for item in select * from jsonb_array_elements(items)
  loop
    v_product_id := (item->>'product_id')::uuid;
    v_quantity := (item->>'quantity')::integer;

    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Invalid quantity for product %', v_product_id;
    end if;

    select stock, name into v_current_stock, v_name
    from public.products
    where id = v_product_id
    for update;

    if v_current_stock is null then
      raise exception 'Product % not found', v_product_id;
    end if;

    if v_current_stock < v_quantity then
      raise exception 'Sorry, "%" only has % left in stock (you requested %)', v_name, v_current_stock, v_quantity;
    end if;

    update public.products set stock = stock - v_quantity where id = v_product_id;
  end loop;
end;
$$;

-- Compensating action: gives stock back. Used when (a) an order insert fails
-- right after a successful reservation, so the reserved units aren't lost,
-- and (b) an admin cancels an order, so its reserved units return to sale.
create or replace function public.restore_stock_for_order(items jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  item jsonb;
  v_product_id uuid;
  v_quantity integer;
begin
  for item in select * from jsonb_array_elements(items)
  loop
    v_product_id := (item->>'product_id')::uuid;
    v_quantity := (item->>'quantity')::integer;
    if v_product_id is null or v_quantity is null or v_quantity <= 0 then
      continue;
    end if;
    update public.products set stock = stock + v_quantity where id = v_product_id;
  end loop;
end;
$$;

grant execute on function public.reserve_stock_for_order(jsonb) to anon, authenticated, service_role;
grant execute on function public.restore_stock_for_order(jsonb) to anon, authenticated, service_role;

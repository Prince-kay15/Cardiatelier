CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid() AND EXISTS (
    SELECT 1
    FROM public.user_roles AS ur
    JOIN auth.users AS u ON u.id = ur.user_id
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND (
        _role <> 'admin'::public.app_role
        OR lower(u.email) IN ('princekay043@gmail.com', 'cardiatelier1@gmail.com')
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN ('princekay043@gmail.com', 'cardiatelier1@gmail.com')
     AND NOT EXISTS (
       SELECT 1
       FROM public.user_roles AS ur
       JOIN auth.users AS u ON u.id = ur.user_id
       WHERE ur.role = 'admin'
         AND lower(u.email) IN ('princekay043@gmail.com', 'cardiatelier1@gmail.com')
     ) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- Create invitations table
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  role app_role NOT NULL DEFAULT 'profissional',
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  used_by uuid,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Gestores can manage invitations
CREATE POLICY "Gestores can manage invitations"
ON public.invitations
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));

-- Public can read valid (unused, not expired) invitations by token for registration
CREATE POLICY "Anyone can read valid invitation by token"
ON public.invitations
FOR SELECT
USING (used_at IS NULL AND expires_at > now());

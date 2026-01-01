-- Create professional_memberships table
CREATE TABLE public.professional_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  member_since DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.professional_memberships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage professional_memberships" 
ON public.professional_memberships 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view professional_memberships" 
ON public.professional_memberships 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_professional_memberships_updated_at
BEFORE UPDATE ON public.professional_memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create user_preferences table for AI configuration memory
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Last used platform and modules
  last_platform TEXT,
  last_modules JSONB DEFAULT '[]'::jsonb,
  
  -- Frequently used configurations (auto-learned)
  frequent_platforms JSONB DEFAULT '[]'::jsonb,
  frequent_visual_styles JSONB DEFAULT '[]'::jsonb,
  frequent_scenes JSONB DEFAULT '[]'::jsonb,
  
  -- Custom presets saved by user
  custom_presets JSONB DEFAULT '[]'::jsonb,
  
  -- Usage statistics for AI learning
  usage_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
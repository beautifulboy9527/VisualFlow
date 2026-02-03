-- 创建生成历史表，保存用户的每次生成记录
CREATE TABLE public.generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- 输入数据
  input_images JSONB NOT NULL DEFAULT '[]',  -- 原始上传的产品图片URLs
  platform TEXT,  -- 选择的平台 (amazon, shopify, tiktok等)
  modules JSONB DEFAULT '[]',  -- 选择的输出模块
  visual_style TEXT,  -- 视觉风格
  layout_style TEXT,  -- 布局风格
  scenes JSONB DEFAULT '[]',  -- 选择的场景
  
  -- AI分析结果
  ai_analysis JSONB,  -- 产品分析结果缓存
  
  -- 输出数据
  output_images JSONB NOT NULL DEFAULT '[]',  -- 生成的图片URLs和metadata
  
  -- 状态
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed
  credits_used INTEGER NOT NULL DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 创建用户模板/预设表
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,  -- NULL表示系统模板
  
  -- 模板信息
  name TEXT NOT NULL,
  name_zh TEXT,
  description TEXT,
  description_zh TEXT,
  thumbnail_url TEXT,
  
  -- 模板配置
  platform TEXT,
  modules JSONB DEFAULT '[]',
  visual_style TEXT,
  layout_style TEXT,
  scenes JSONB DEFAULT '[]',
  
  -- 分类和标签
  category TEXT,  -- beauty, fashion, tech, food等
  tags JSONB DEFAULT '[]',
  
  -- 统计
  use_count INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建灵感/社区作品表（公开展示）
CREATE TABLE public.showcase (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  generation_id UUID REFERENCES public.generations(id) ON DELETE SET NULL,
  
  -- 展示信息
  title TEXT,
  title_zh TEXT,
  description TEXT,
  description_zh TEXT,
  image_url TEXT NOT NULL,
  
  -- 分类
  category TEXT,
  tags JSONB DEFAULT '[]',
  
  -- 互动统计
  likes_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  
  -- 状态
  is_approved BOOLEAN NOT NULL DEFAULT false,  -- 需要审核
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 启用RLS
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase ENABLE ROW LEVEL SECURITY;

-- Generations策略：用户只能看自己的
CREATE POLICY "Users can view own generations" 
ON public.generations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own generations" 
ON public.generations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations" 
ON public.generations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations" 
ON public.generations FOR DELETE 
USING (auth.uid() = user_id);

-- Templates策略：公开模板所有人可见，私有模板只有owner可见
CREATE POLICY "Anyone can view public templates" 
ON public.templates FOR SELECT 
USING (is_public = true OR user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can create own templates" 
ON public.templates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" 
ON public.templates FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" 
ON public.templates FOR DELETE 
USING (auth.uid() = user_id);

-- Showcase策略：已审核的公开可见
CREATE POLICY "Anyone can view approved showcase" 
ON public.showcase FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can view own showcase" 
ON public.showcase FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own showcase" 
ON public.showcase FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own showcase" 
ON public.showcase FOR DELETE 
USING (auth.uid() = user_id);

-- 创建索引
CREATE INDEX idx_generations_user_id ON public.generations(user_id);
CREATE INDEX idx_generations_created_at ON public.generations(created_at DESC);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_is_public ON public.templates(is_public);
CREATE INDEX idx_showcase_is_approved ON public.showcase(is_approved);
CREATE INDEX idx_showcase_is_featured ON public.showcase(is_featured);

-- 为templates添加updated_at触发器
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
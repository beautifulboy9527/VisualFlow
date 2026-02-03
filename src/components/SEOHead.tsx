import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
  lang?: 'zh' | 'en';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'VisualFlow - AI电商设计平台',
  description = '一键生成专业电商产品图、主图、详情页。支持亚马逊、Shopify、TikTok等多平台，AI智能分析产品自动推荐最佳设计方案。',
  keywords = 'AI电商设计, 产品图生成, 亚马逊主图, Shopify产品图, TikTok电商, AI设计工具, 跨境电商, 产品摄影',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  jsonLd,
  lang = 'zh',
}) => {
  const fullTitle = title.includes('VisualFlow') ? title : `${title} | VisualFlow`;
  
  // Default JSON-LD for the website
  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'VisualFlow',
    description: lang === 'zh' 
      ? 'AI驱动的电商产品图片生成平台，一键创建专业级产品展示图'
      : 'AI-powered e-commerce product image generation platform',
    url: 'https://visualflow.app',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      lang === 'zh' ? 'AI产品分析' : 'AI Product Analysis',
      lang === 'zh' ? '多平台尺寸适配' : 'Multi-platform Size Adaptation',
      lang === 'zh' ? '场景智能替换' : 'Smart Scene Replacement',
      lang === 'zh' ? 'AI超分辨率放大' : 'AI Super-resolution Upscaling',
    ],
  };

  const structuredData = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="VisualFlow" />
      <meta property="og:locale" content={lang === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0d9488" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;

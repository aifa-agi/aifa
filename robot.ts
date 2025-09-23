// app/robots.ts

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || 'https://aifa.dev';

  return {
    rules: [
      {
        userAgent: '*', // Правила для всех поисковых роботов
        allow: '/', // Разрешить индексировать все страницы
        disallow: ['/admin', '/private/'], // Запретить индексацию админ-панели и приватных страниц
      },
      {
        userAgent: 'Googlebot', // Отдельные правила для Google
        allow: ['/'],
        disallow: '/admin/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`, // Указание пути к карте сайта
  };
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://veneraup.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/doctor_dashboard/', // منع أرشفة لوحات تحكم الدكاترة الخاصة
        '/api/',              // منع أرشفة مسارات الـ API
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';
import { supabase } from './Components/assets/supabase-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://veneraup.com';

  // 1. الصفحات الثابتة الأساسية
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. جلب بروفايلات الدكاترة ديناميكياً من جدول الدكاترة/البروفايلات
  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: profiles, error } = await supabase
      .from('user') // تأكد إن اسم الجدول مطابق عندك في Supabase
      .select('id, created_at');

    if (!error && profiles) {
      profileRoutes = profiles.map((profile:any) => ({
        url: `${baseUrl}/profile/${profile.id}`, // أو مسار بروفايل الدكتور حسب الـ Routing عندك
        lastModified: profile.updated_at ? new Date(profile.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Error fetching profiles for sitemap:', err);
  }

  // 3. جلب البوستات ديناميكياً (لو كل بوست ليه صفحة أو رابط خاص بيه)
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: posts, error } = await supabase
      .from('posts') // تأكد إن اسم جدول البوستات مطابق عندك
      .select('id, created_at');

    if (!error && posts) {
      postRoutes = posts.map((post:any) => ({
        url: `${baseUrl}/post/${post.id}`, // عدل مسار عرض البوست المنفرد لو موجود عندك
        lastModified: post.created_at ? new Date(post.created_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error('Error fetching posts for sitemap:', err);
  }

  // دمج كل الروابط معاً في خريطة واحدة شاملة
  return [...staticRoutes, ...profileRoutes, ...postRoutes];
}
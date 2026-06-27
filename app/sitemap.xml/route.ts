import { NextResponse } from 'next/server';
import projects from '@/app/data/projects.json';

export async function GET() {
  const baseUrl = "https://wahb.space";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/llms.txt</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/ai.json</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

  projects.forEach((project: any) => {
    xml += `  <url>
    <loc>${baseUrl}/projects/${project.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
`;
    if (project.images && project.images.length > 0) {
      project.images.forEach((img: string) => {
        const imgUrl = img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
        xml += `    <image:image>
      <image:loc>${imgUrl}</image:loc>
    </image:image>
`;
      });
    }
    
    if (project.video || project.videos) {
      const videos = project.videos || [project.video];
      videos.forEach((vid: string) => {
        if (!vid) return;
        const vidUrl = vid.startsWith('/') ? `${baseUrl}${vid}` : (vid.startsWith('http') ? vid : `${baseUrl}/${vid}`);
        xml += `    <video:video>
      <video:content_loc>${vidUrl}</video:content_loc>
      <video:title><![CDATA[${project.title}]]></video:title>
      <video:description><![CDATA[${project.short}]]></video:description>
    </video:video>
`;
      });
    }
    
    xml += `  </url>
`;
  });

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}

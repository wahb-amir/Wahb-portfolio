// app/robots.txt/route.ts
export async function GET() {
  return new Response(
`User-agent: *
Allow: /

Disallow: /_next/
Disallow: /api/
Disallow: /drafts/
Disallow: /private/

Sitemap: https://wahb.buttnetworks.com/sitemap.xml
Sitemap: https://clearpath.buttnetworks.com/sitemap.xml
Sitemap: https://eco.buttnetworks.com/sitemap.xml
Sitemap: https://econoquest.buttnetworks.com/sitemap.xml
Sitemap: https://boltform.buttnetworks.com/sitemap.xml

#     __    __      _     _         _             _
#    / / /\\ \\ \\__ _| |__ | |__     /_\\  _ __ ___ (_)_ __
#    \\ \\/  \\/ / _\` | '_ \\| '_ \\   //_\\\\| '_ \` _ \\| | '__|
#     \\  /\\  / (_| | | | | |_) | /  _  \\ | | | | | | |
#      \\/  \\/ \\__,_|_| |_|_.__/  \\_/ \\_/_| |_| |_|_|_|
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
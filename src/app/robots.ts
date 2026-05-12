export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://koliapp.netlify.app/sitemap.xml',
  }
}
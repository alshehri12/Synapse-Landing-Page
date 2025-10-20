# Supabase Deployment Configuration

## Quick Deploy Steps

### 1. Using Supabase Storage (Recommended for Static Sites)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if not already done)
supabase init

# Deploy the HTML file
# Upload main.html to Supabase Storage bucket
```

### 2. Manual Upload via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** → **Create Bucket**
3. Create a public bucket named `landing-page`
4. Upload `main.html` and `AppImages` folder
5. Set the file as publicly accessible
6. Access via: `https://[project-id].supabase.co/storage/v1/object/public/landing-page/main.html`

### 3. Using Supabase Edge Functions (Advanced)

Create an edge function to serve the static HTML:

```typescript
// supabase/functions/landing/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const html = `<!-- Paste your main.html content here -->`

serve(async (req) => {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    },
  })
})
```

Deploy:
```bash
supabase functions deploy landing
```

---

## Security Headers Configuration

### Option A: Via Edge Function (Recommended)

Add these headers in your edge function response:

```typescript
headers: {
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data:;"
}
```

### Option B: Via Cloudflare (If using custom domain)

Add transform rules in Cloudflare dashboard to inject headers.

---

## Custom Domain Setup

1. **Add Custom Domain in Supabase:**
   - Go to **Settings** → **API**
   - Add your custom domain

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: www (or @)
   Value: [your-project].supabase.co
   ```

3. **Enable SSL:**
   - Supabase automatically provisions SSL certificates

---

## Environment Variables

If you plan to add backend functionality later:

```bash
# .env.local (DO NOT commit to git)
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

Add `.env.local` to `.gitignore`:
```
.env.local
.env*.local
```

---

## Monitoring & Analytics

### Supabase Logs
Monitor your deployment:
```bash
supabase functions logs landing
```

### Add Analytics (Optional)

For Google Analytics, add before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
```

---

## Caching Strategy

### For Static Assets (Images, Fonts)

Configure cache headers in Supabase Storage or via Edge Function:

```typescript
"Cache-Control": "public, max-age=31536000, immutable"
```

### For HTML (Landing Page)

```typescript
"Cache-Control": "public, max-age=3600, must-revalidate"
```

---

## Backup & Version Control

### Keep your code in Git
```bash
git init
git add main.html AppImages/ SECURITY_REPORT.md
git commit -m "Initial landing page"
git remote add origin [your-repo-url]
git push -u origin main
```

### .gitignore template
```
node_modules/
.env.local
.env*.local
.DS_Store
*.log
.supabase/
```

---

## Testing Checklist

After deployment, test:

- [ ] Homepage loads correctly
- [ ] All internal links work (#features, #download, etc.)
- [ ] Images load from Unsplash CDN
- [ ] Smooth scroll functionality works
- [ ] Mobile responsive design
- [ ] All buttons are clickable
- [ ] Navigation works on mobile
- [ ] HTTPS is enforced
- [ ] No console errors
- [ ] Page loads in < 3 seconds

### Testing Tools
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test SSL configuration
- [Security Headers](https://securityheaders.com/) - Check security headers
- [GTmetrix](https://gtmetrix.com/) - Performance testing
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## Troubleshooting

### Issue: CSS not loading
- Check Tailwind CDN is accessible
- Verify CSP headers allow `cdn.tailwindcss.com`

### Issue: Images not loading
- Verify Unsplash URLs are correct
- Check CSP allows `images.unsplash.com`

### Issue: 404 errors
- Ensure file is uploaded to correct bucket
- Check bucket is set to public
- Verify URL path is correct

### Issue: CORS errors
- Configure CORS in Supabase Storage settings
- Allow origins: `*` for public site

---

## Performance Optimization

### 1. Optimize Images
Consider downloading and optimizing Unsplash images:
```bash
# Convert to WebP for better compression
cwebp input.jpg -q 80 -o output.webp
```

### 2. Build Tailwind Locally
Instead of CDN, build production CSS:
```bash
npm install -D tailwindcss
npx tailwindcss -i ./input.css -o ./output.css --minify
```

### 3. Minify HTML
Use an HTML minifier before deployment:
```bash
npm install -g html-minifier
html-minifier --collapse-whitespace --remove-comments main.html -o main.min.html
```

---

## Cost Estimation

**Supabase Free Tier includes:**
- 500 MB Storage
- 2 GB Bandwidth
- Edge Functions (500K requests/month)

**Expected Costs:**
- Landing page size: ~50 KB (HTML)
- Images: ~2 MB (if hosting locally)
- Estimated traffic: 10,000 visits/month
- **Cost: FREE** (within free tier limits)

---

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Community Discord](https://discord.supabase.com)

---

**Ready to Deploy!** 🚀

Follow the steps above and your landing page will be live on Supabase.

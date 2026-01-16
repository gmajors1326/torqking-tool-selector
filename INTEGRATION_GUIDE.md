# Integration Guide: Linking from Main Website

This guide shows you how to link to the Tool Selector from your main TorqKing website.

## Quick Start

Once deployed, add this link to your main website:

```html
<a href="https://tool-selector.torqking.com" 
   target="_blank"
   rel="noopener noreferrer"
   class="your-button-class">
  Use Torque Tool Selector
</a>
```

## Integration Examples

### Option 1: Simple Button Link (Recommended)

```html
<!-- HTML -->
<div class="tool-selector-section">
  <h2>Find the Right Torque Tool</h2>
  <p>Use our interactive tool selector to get expert recommendations.</p>
  <a href="https://tool-selector.torqking.com" 
     class="btn btn-primary"
     target="_blank"
     rel="noopener noreferrer">
    Launch Tool Selector →
  </a>
</div>
```

### Option 2: Card/Feature Section

```html
<div class="feature-card">
  <div class="feature-icon">🔧</div>
  <h3>Torque Tool Selector</h3>
  <p>Get expert recommendations for your industrial bolting applications. 
     Select by torque requirement, industry, and application type.</p>
  <a href="https://tool-selector.torqking.com" 
     class="btn btn-outline"
     target="_blank">
    Try Tool Selector
  </a>
</div>
```

### Option 3: Navigation Menu Item

```html
<!-- Add to your main navigation -->
<nav>
  <a href="/products">Products</a>
  <a href="/services">Services</a>
  <a href="https://tool-selector.torqking.com" target="_blank">Tool Selector</a>
  <a href="/contact">Contact</a>
</nav>
```

### Option 4: Hero Section CTA

```html
<section class="hero">
  <h1>Industrial Torque Solutions</h1>
  <p>Expert torque tool selection for your applications</p>
  <div class="cta-buttons">
    <a href="/products" class="btn btn-primary">View Products</a>
    <a href="https://tool-selector.torqking.com" 
       class="btn btn-secondary"
       target="_blank">
      Use Tool Selector
    </a>
  </div>
</section>
```

### Option 5: Sidebar Widget

```html
<aside class="sidebar-widget">
  <h3>Need Help Selecting a Tool?</h3>
  <p>Our interactive selector helps you find the right torque tool 
     for your specific application.</p>
  <a href="https://tool-selector.torqking.com" 
     class="btn btn-small"
     target="_blank">
    Launch Selector
  </a>
</aside>
```

## CSS Styling Examples

```css
/* Button styles to match your site */
.tool-selector-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.tool-selector-link:hover {
  background-color: #0052a3;
}

.tool-selector-link:visited {
  color: white;
}
```

## WordPress Integration

If your main site is WordPress:

### Using a Button Block

1. Add a "Button" block
2. Set URL: `https://tool-selector.torqking.com`
3. Set link to open in new tab
4. Style as needed

### Using HTML Block

```html
<a href="https://tool-selector.torqking.com" 
   class="wp-block-button__link"
   target="_blank"
   rel="noopener noreferrer">
  Use Torque Tool Selector
</a>
```

### Using Shortcode (if custom)

```php
// Add to functions.php or custom plugin
function tool_selector_button() {
  return '<a href="https://tool-selector.torqking.com" 
              class="tool-selector-btn" 
              target="_blank"
              rel="noopener noreferrer">
            Use Torque Tool Selector
          </a>';
}
add_shortcode('tool_selector', 'tool_selector_button');

// Then use: [tool_selector]
```

## React/Next.js Integration

If your main site is also React/Next.js:

```tsx
import Link from 'next/link';

export function ToolSelectorLink() {
  return (
    <a 
      href="https://tool-selector.torqking.com"
      target="_blank"
      rel="noopener noreferrer"
      className="tool-selector-cta"
    >
      Use Torque Tool Selector
    </a>
  );
}
```

## Best Practices

1. **Always use `target="_blank"`** - Opens in new tab so users don't lose your main site
2. **Always use `rel="noopener noreferrer"`** - Security best practice for external links
3. **Clear Call-to-Action** - Use descriptive text like "Use Tool Selector" or "Find Your Tool"
4. **Visual Consistency** - Style the link to match your site's design
5. **Mobile Friendly** - Ensure the link works well on mobile devices

## Testing Checklist

- [ ] Link opens in new tab
- [ ] Tool selector loads correctly
- [ ] Works on mobile devices
- [ ] Styling matches your site
- [ ] No console errors
- [ ] Analytics tracking (if applicable)

## Analytics Tracking

If you want to track clicks, add analytics:

### Google Analytics 4

```html
<a href="https://tool-selector.torqking.com" 
   onclick="gtag('event', 'click', {
     'event_category': 'Tool Selector',
     'event_label': 'Main Site Link'
   });"
   target="_blank">
  Use Tool Selector
</a>
```

### Custom Event Tracking

```javascript
document.querySelector('.tool-selector-link').addEventListener('click', function() {
  // Your analytics code here
  console.log('Tool selector clicked');
});
```

## Troubleshooting

**Link doesn't open:**
- Check URL is correct
- Verify no JavaScript errors blocking
- Test in incognito mode

**Styling issues:**
- Check CSS specificity
- Verify classes are applied
- Test in different browsers

**Mobile issues:**
- Ensure touch target is large enough (min 44x44px)
- Test on actual devices, not just browser dev tools

---

**Need Help?** Check `VERCEL_DEPLOYMENT.md` for deployment details.

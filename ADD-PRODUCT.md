# Add a product using GitHub

## Fast method: one color

Create a folder inside `assets/products/catalog`, for example:

```text
assets/products/catalog/nike-air-max/
├── product.json
├── 01-front.webp
├── 02-side.webp
└── 03-back.webp
```

Copy the contents of `_template/product.json` into the new `product.json`. The title section is the first line:

```json
{
  "title": "Nike Air Max",
  "brand": "Nike",
  "price": 35,
  "description": "Comfortable everyday sneaker.",
  "sizes": [37, 38, 39, 40, 41],
  "newDrop": true,
  "order": 100
}
```

Commit the folder. The uploaded images are detected and the product appears after Netlify finishes publishing.

## Product with colors

Put images inside color folders. Each folder becomes a color button automatically:

```text
assets/products/catalog/nike-air-max/
├── product.json
├── black/
│   ├── 01-front.webp
│   └── 02-side.webp
└── white/
    ├── 01-front.webp
    └── 02-side.webp
```

You do not need to list image filenames anywhere. Uploading another photo to one of these folders adds it to that product's gallery on the next deployment.

## Useful fields

- `title`: product title shown in the store.
- `brand`: brand shown above the title.
- `price`: number in US dollars. Use `0` to show “Price on WhatsApp.”
- `description`: text inside the product page.
- `sizes`: available sizes.
- `newDrop`: use `true` or `false`.
- `order`: lower numbers appear first.
- `hidden`: add `"hidden": true` to temporarily remove a product.

Use JPG, JPEG, PNG, WebP, AVIF, or GIF images. Number filenames to control gallery order.

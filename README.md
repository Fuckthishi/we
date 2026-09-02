# Sharif Store

The storefront builds its product list from folders in `assets/products/catalog`.

## Add a product from GitHub

1. Open `assets/products/catalog` in GitHub.
2. Copy the `_template` folder and rename it with the product name, for example `nike-air-max`.
3. Edit that folder's `product.json`. Put the product title in `title` and change the other details.
4. Upload product photos into the same folder. Put photos in color folders such as `black`, `white`, or `blue-white` to create color choices automatically.
5. Commit the files. Netlify rebuilds the catalog and publishes the product automatically.

Photos can be JPG, JPEG, PNG, WebP, AVIF, or GIF. The first photo alphabetically is used as the product card image. Prefix filenames with numbers (`01-front.webp`, `02-side.webp`) to control their order.

See `ADD-PRODUCT.md` for the exact folder layout and examples.

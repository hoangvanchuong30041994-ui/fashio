import 'dotenv/config';
import { PrismaClient } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const categories = [
  {
    name: 'Women Essentials',
    slug: 'women-essentials',
    description: 'Polished everyday pieces for modern wardrobes.',
    image: '/products/product-1.png',
  },
  {
    name: 'Streetwear',
    slug: 'streetwear',
    description: 'Relaxed silhouettes, textured layers, and city-ready staples.',
    image: '/products/product-2.png',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Finishing touches for every outfit.',
    image: '/products/product-3.png',
  },
];

const products = [
  {
    name: 'Satin Wrap Blazer',
    slug: 'satin-wrap-blazer',
    description:
      'A softly structured wrap blazer with a satin finish, designed for day-to-night styling.',
    basePrice: '129.00',
    categorySlug: 'women-essentials',
    tags: ['blazer', 'satin', 'workwear'],
    images: [
      { url: '/products/product-4.png', alt: 'Satin wrap blazer front view', position: 0 },
      { url: '/products/product-5.png', alt: 'Satin wrap blazer detail', position: 1 },
    ],
    variants: [
      { sku: 'SWB-BLK-S', size: 'S', color: 'Black', price: '129.00', stock: 12 },
      { sku: 'SWB-BLK-M', size: 'M', color: 'Black', price: '129.00', stock: 18 },
      { sku: 'SWB-IVY-M', size: 'M', color: 'Ivory', price: '135.00', stock: 10 },
    ],
  },
  {
    name: 'Ribbed Knit Midi Dress',
    slug: 'ribbed-knit-midi-dress',
    description:
      'A comfortable ribbed midi dress with a streamlined fit and versatile seasonal weight.',
    basePrice: '89.00',
    categorySlug: 'women-essentials',
    tags: ['dress', 'knit', 'minimal'],
    images: [
      { url: '/products/product-6.png', alt: 'Ribbed knit midi dress', position: 0 },
      { url: '/products/product-7.png', alt: 'Ribbed knit midi dress styled', position: 1 },
    ],
    variants: [
      { sku: 'RKD-OAT-S', size: 'S', color: 'Oat', price: '89.00', stock: 16 },
      { sku: 'RKD-OAT-M', size: 'M', color: 'Oat', price: '89.00', stock: 14 },
      { sku: 'RKD-CHR-M', size: 'M', color: 'Charcoal', price: '92.00', stock: 8 },
    ],
  },
  {
    name: 'Oversized Cargo Jacket',
    slug: 'oversized-cargo-jacket',
    description:
      'A utility-inspired cargo jacket with roomy pockets and an oversized streetwear cut.',
    basePrice: '149.00',
    categorySlug: 'streetwear',
    tags: ['jacket', 'cargo', 'streetwear'],
    images: [
      { url: '/products/product-8.png', alt: 'Oversized cargo jacket', position: 0 },
      { url: '/products/product-9.png', alt: 'Cargo jacket pocket detail', position: 1 },
    ],
    variants: [
      { sku: 'OCJ-OLV-M', size: 'M', color: 'Olive', price: '149.00', stock: 9 },
      { sku: 'OCJ-OLV-L', size: 'L', color: 'Olive', price: '149.00', stock: 11 },
      { sku: 'OCJ-BLK-L', size: 'L', color: 'Black', price: '155.00', stock: 7 },
    ],
  },
  {
    name: 'Boxy Graphic Tee',
    slug: 'boxy-graphic-tee',
    description: 'A heavyweight cotton tee with a boxy fit and minimal seasonal graphic.',
    basePrice: '49.00',
    categorySlug: 'streetwear',
    tags: ['tee', 'cotton', 'graphic'],
    images: [
      { url: '/products/product-10.png', alt: 'Boxy graphic tee', position: 0 },
      { url: '/products/product-11.png', alt: 'Boxy graphic tee back print', position: 1 },
    ],
    variants: [
      { sku: 'BGT-WHT-S', size: 'S', color: 'White', price: '49.00', stock: 24 },
      { sku: 'BGT-WHT-M', size: 'M', color: 'White', price: '49.00', stock: 26 },
      { sku: 'BGT-INK-M', size: 'M', color: 'Ink', price: '52.00', stock: 13 },
    ],
  },
  {
    name: 'Leather Crescent Bag',
    slug: 'leather-crescent-bag',
    description: 'A compact crescent shoulder bag crafted for daily carry essentials.',
    basePrice: '119.00',
    categorySlug: 'accessories',
    tags: ['bag', 'leather', 'accessory'],
    images: [
      { url: '/products/product-12.png', alt: 'Leather crescent bag', position: 0 },
      { url: '/products/product-13.png', alt: 'Leather crescent bag interior', position: 1 },
    ],
    variants: [
      { sku: 'LCB-BLK-OS', size: 'One size', color: 'Black', price: '119.00', stock: 15 },
      { sku: 'LCB-TAN-OS', size: 'One size', color: 'Tan', price: '119.00', stock: 12 },
    ],
  },
  {
    name: 'Silk Square Scarf',
    slug: 'silk-square-scarf',
    description: 'A lightweight silk scarf with a hand-drawn print and soft rolled edges.',
    basePrice: '59.00',
    categorySlug: 'accessories',
    tags: ['scarf', 'silk', 'print'],
    images: [
      { url: '/products/product-14.png', alt: 'Silk square scarf', position: 0 },
      { url: '/products/product-15.png', alt: 'Silk square scarf print detail', position: 1 },
    ],
    variants: [
      { sku: 'SSS-RSE-OS', size: 'One size', color: 'Rose', price: '59.00', stock: 20 },
      { sku: 'SSS-NVY-OS', size: 'One size', color: 'Navy', price: '59.00', stock: 18 },
    ],
  },
  {
    name: 'Tailored Wide-Leg Trousers',
    slug: 'tailored-wide-leg-trousers',
    description:
      'High-waisted wide-leg trousers with a crisp tailored finish for elevated everyday looks.',
    basePrice: '99.00',
    categorySlug: 'women-essentials',
    tags: ['trousers', 'tailored', 'workwear'],
    images: [
      {
        url: '/products/product-16.png',
        alt: 'Tailored wide-leg trousers front view',
        position: 0,
      },
      { url: '/products/product-17.png', alt: 'Tailored wide-leg trousers detail', position: 1 },
    ],
    variants: [
      { sku: 'TWT-BLK-S', size: 'S', color: 'Black', price: '99.00', stock: 14 },
      { sku: 'TWT-BLK-M', size: 'M', color: 'Black', price: '99.00', stock: 16 },
      { sku: 'TWT-BEG-M', size: 'M', color: 'Beige', price: '99.00', stock: 11 },
    ],
  },
  {
    name: 'Cropped Knit Cardigan',
    slug: 'cropped-knit-cardigan',
    description: 'A cropped cardigan in a soft knit blend, perfect for layering in any season.',
    basePrice: '79.00',
    categorySlug: 'women-essentials',
    tags: ['cardigan', 'knit', 'layering'],
    images: [
      { url: '/products/product-18.png', alt: 'Cropped knit cardigan', position: 0 },
      { url: '/products/product-19.png', alt: 'Cropped knit cardigan styled', position: 1 },
    ],
    variants: [
      { sku: 'CKC-CRM-S', size: 'S', color: 'Cream', price: '79.00', stock: 15 },
      { sku: 'CKC-CRM-M', size: 'M', color: 'Cream', price: '79.00', stock: 13 },
      { sku: 'CKC-SGE-M', size: 'M', color: 'Sage', price: '82.00', stock: 9 },
    ],
  },
  {
    name: 'Pleated Satin Skirt',
    slug: 'pleated-satin-skirt',
    description: 'A fluid pleated midi skirt in liquid satin with a fitted waistband.',
    basePrice: '85.00',
    categorySlug: 'women-essentials',
    tags: ['skirt', 'satin', 'pleated'],
    images: [
      { url: '/products/product-20.png', alt: 'Pleated satin skirt front view', position: 0 },
      { url: '/products/product-21.png', alt: 'Pleated satin skirt movement detail', position: 1 },
    ],
    variants: [
      { sku: 'PSS-CHM-S', size: 'S', color: 'Champagne', price: '85.00', stock: 12 },
      { sku: 'PSS-CHM-M', size: 'M', color: 'Champagne', price: '85.00', stock: 10 },
      { sku: 'PSS-BLK-M', size: 'M', color: 'Black', price: '85.00', stock: 14 },
    ],
  },
  {
    name: 'Utility Denim Jacket',
    slug: 'utility-denim-jacket',
    description: 'A washed denim jacket with utility pockets and a relaxed streetwear fit.',
    basePrice: '109.00',
    categorySlug: 'streetwear',
    tags: ['jacket', 'denim', 'streetwear'],
    images: [
      { url: '/products/product-22.png', alt: 'Utility denim jacket', position: 0 },
      { url: '/products/product-23.png', alt: 'Utility denim jacket pocket detail', position: 1 },
    ],
    variants: [
      { sku: 'UDJ-LBL-M', size: 'M', color: 'Light Blue', price: '109.00', stock: 13 },
      { sku: 'UDJ-LBL-L', size: 'L', color: 'Light Blue', price: '109.00', stock: 15 },
      { sku: 'UDJ-BLK-L', size: 'L', color: 'Black', price: '112.00', stock: 8 },
    ],
  },
  {
    name: 'Track Pants with Side Stripe',
    slug: 'track-pants-side-stripe',
    description: 'Tapered track pants with a signature side stripe and an elastic waistband.',
    basePrice: '69.00',
    categorySlug: 'streetwear',
    tags: ['pants', 'track', 'streetwear'],
    images: [
      { url: '/products/product-24.png', alt: 'Track pants with side stripe', position: 0 },
      { url: '/products/product-25.png', alt: 'Track pants side stripe detail', position: 1 },
    ],
    variants: [
      { sku: 'TPS-BLK-S', size: 'S', color: 'Black', price: '69.00', stock: 20 },
      { sku: 'TPS-BLK-M', size: 'M', color: 'Black', price: '69.00', stock: 22 },
      { sku: 'TPS-GRY-M', size: 'M', color: 'Grey', price: '69.00', stock: 17 },
    ],
  },
  {
    name: 'Hooded Puffer Vest',
    slug: 'hooded-puffer-vest',
    description:
      'A lightweight puffer vest with a detachable hood, built for layering in cold weather.',
    basePrice: '95.00',
    categorySlug: 'streetwear',
    tags: ['vest', 'puffer', 'outerwear'],
    images: [
      { url: '/products/product-26.png', alt: 'Hooded puffer vest', position: 0 },
      { url: '/products/product-27.png', alt: 'Hooded puffer vest hood detail', position: 1 },
    ],
    variants: [
      { sku: 'HPV-BLK-M', size: 'M', color: 'Black', price: '95.00', stock: 11 },
      { sku: 'HPV-BLK-L', size: 'L', color: 'Black', price: '95.00', stock: 9 },
      { sku: 'HPV-OLV-L', size: 'L', color: 'Olive', price: '98.00', stock: 6 },
    ],
  },
  {
    name: 'Chunky Sole Sneakers',
    slug: 'chunky-sole-sneakers',
    description: 'Statement sneakers with a chunky platform sole and breathable knit upper.',
    basePrice: '139.00',
    categorySlug: 'streetwear',
    tags: ['sneakers', 'footwear', 'streetwear'],
    images: [
      { url: '/products/product-28.png', alt: 'Chunky sole sneakers', position: 0 },
      { url: '/products/product-29.png', alt: 'Chunky sole sneakers side view', position: 1 },
    ],
    variants: [
      { sku: 'CSS-WHT-39', size: '39', color: 'White', price: '139.00', stock: 10 },
      { sku: 'CSS-WHT-40', size: '40', color: 'White', price: '139.00', stock: 12 },
      { sku: 'CSS-BLK-41', size: '41', color: 'Black', price: '139.00', stock: 9 },
    ],
  },
  {
    name: 'Gold Chain Layer Necklace',
    slug: 'gold-chain-layer-necklace',
    description:
      'A set of layered gold-tone chain necklaces designed to be worn together or apart.',
    basePrice: '45.00',
    categorySlug: 'accessories',
    tags: ['necklace', 'gold', 'layering'],
    images: [
      { url: '/products/product-30.png', alt: 'Gold chain layer necklace', position: 0 },
      { url: '/products/product-31.png', alt: 'Gold chain layer necklace worn', position: 1 },
    ],
    variants: [
      { sku: 'GCN-GLD-OS', size: 'One size', color: 'Gold', price: '45.00', stock: 22 },
      { sku: 'GCN-SLV-OS', size: 'One size', color: 'Silver', price: '45.00', stock: 19 },
    ],
  },
  {
    name: 'Structured Bucket Hat',
    slug: 'structured-bucket-hat',
    description: 'A structured cotton bucket hat with a stitched brim and adjustable inner band.',
    basePrice: '39.00',
    categorySlug: 'accessories',
    tags: ['hat', 'bucket', 'cotton'],
    images: [
      { url: '/products/product-32.png', alt: 'Structured bucket hat', position: 0 },
      { url: '/products/product-33.png', alt: 'Structured bucket hat worn', position: 1 },
    ],
    variants: [
      { sku: 'SBH-BLK-OS', size: 'One size', color: 'Black', price: '39.00', stock: 25 },
      { sku: 'SBH-KHK-OS', size: 'One size', color: 'Khaki', price: '39.00', stock: 21 },
    ],
  },
  {
    name: 'Woven Leather Belt',
    slug: 'woven-leather-belt',
    description: 'A hand-woven leather belt with a matte metal buckle, sized to fit true.',
    basePrice: '55.00',
    categorySlug: 'accessories',
    tags: ['belt', 'leather', 'woven'],
    images: [
      { url: '/products/product-34.png', alt: 'Woven leather belt', position: 0 },
      { url: '/products/product-35.png', alt: 'Woven leather belt buckle detail', position: 1 },
    ],
    variants: [
      { sku: 'WLB-BRN-S', size: 'S', color: 'Brown', price: '55.00', stock: 17 },
      { sku: 'WLB-BRN-M', size: 'M', color: 'Brown', price: '55.00', stock: 15 },
      { sku: 'WLB-BLK-M', size: 'M', color: 'Black', price: '55.00', stock: 18 },
    ],
  },
  {
    name: 'Oversized Sunglasses',
    slug: 'oversized-sunglasses',
    description: 'Oversized acetate sunglasses with UV-protective polarized lenses.',
    basePrice: '65.00',
    categorySlug: 'accessories',
    tags: ['sunglasses', 'acetate', 'summer'],
    images: [
      { url: '/products/product-36.png', alt: 'Oversized sunglasses', position: 0 },
      { url: '/products/product-37.png', alt: 'Oversized sunglasses worn', position: 1 },
    ],
    variants: [
      { sku: 'OSG-TRT-OS', size: 'One size', color: 'Tortoise', price: '65.00', stock: 16 },
      { sku: 'OSG-BLK-OS', size: 'One size', color: 'Black', price: '65.00', stock: 20 },
    ],
  },
  {
    name: 'Quilted Crossbody Bag',
    slug: 'quilted-crossbody-bag',
    description: 'A quilted crossbody bag with a chain strap and structured flap closure.',
    basePrice: '99.00',
    categorySlug: 'accessories',
    tags: ['bag', 'quilted', 'crossbody'],
    images: [
      { url: '/products/product-38.png', alt: 'Quilted crossbody bag', position: 0 },
      {
        url: '/products/product-39.png',
        alt: 'Quilted crossbody bag chain strap detail',
        position: 1,
      },
    ],
    variants: [
      { sku: 'QCB-BLK-OS', size: 'One size', color: 'Black', price: '99.00', stock: 14 },
      { sku: 'QCB-CRM-OS', size: 'One size', color: 'Cream', price: '99.00', stock: 11 },
    ],
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug },
      select: { id: true },
    });

    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        isActive: true,
        tags: product.tags,
        categoryId: category.id,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice,
        isActive: true,
        tags: product.tags,
        categoryId: category.id,
      },
      select: { id: true },
    });

    await prisma.productImage.deleteMany({ where: { productId: savedProduct.id } });
    await prisma.productImage.createMany({
      data: product.images.map((image) => ({ ...image, productId: savedProduct.id })),
    });

    for (const variant of product.variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {
          size: variant.size,
          color: variant.color,
          price: variant.price,
          stock: variant.stock,
          productId: savedProduct.id,
        },
        create: {
          ...variant,
          productId: savedProduct.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

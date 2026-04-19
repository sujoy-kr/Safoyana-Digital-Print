import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = 'postgresql://postgres:1212@localhost:5432/safoyana?schema=public';

const pool = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter: pool });

async function main() {
  console.log('Starting seed...');

  console.log('Deleting existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Creating dummy categories...');
  const category1 = await prisma.category.create({
    data: { name: 'Business Cards', slug: 'business-cards', image: 'https://images.unsplash.com/photo-1563198804-b1545b736531?q=80&w=1470&auto=format&fit=crop' },
  });

  const category2 = await prisma.category.create({
    data: { name: 'Banners & Signs', slug: 'banners-and-signs', image: 'https://images.unsplash.com/photo-1559239855-900593457a4e?q=80&w=1471&auto=format&fit=crop' },
  });

  const category3 = await prisma.category.create({
    data: { name: 'Marketing Materials', slug: 'marketing-materials', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop' },
  });

  const category4 = await prisma.category.create({
    data: { name: 'Apparel', slug: 'apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop' },
  });

  console.log('Creating dummy products...');
  
  const product1 = await prisma.product.create({
    data: {
      name: 'Premium Business Cards',
      slug: 'premium-business-cards',
      description: 'High-quality premium business cards with a variety of finishes. Stand out from the crowd with ultra-thick paper and custom luxury finishes.',
      basePrice: 35.00,
      images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1512&auto=format&fit=crop'],
      attributes: [
        { id: 'bc-paper', name: 'Paper Weight', type: 'dropdown', options: [
          { value: '300gsm', label: '300gsm Standard', priceAdded: 0 }, 
          { value: '400gsm', label: '400gsm Premium', priceAdded: 15 },
          { value: '600gsm', label: '600gsm Ultra Thick', priceAdded: 35 }
        ]},
        { id: 'bc-finish', name: 'Special Finish', type: 'radio-text', options: [
          { value: 'none', label: 'None (Standard)', priceAdded: 0 }, 
          { value: 'spot-uv', label: 'Raised Spot UV', priceAdded: 25 },
          { value: 'gold-foil', label: 'Gold Foil Stamping', priceAdded: 45 },
          { value: 'silver-foil', label: 'Silver Foil Stamping', priceAdded: 45 }
        ]},
        { id: 'bc-corners', name: 'Corners', type: 'radio-text', options: [
          { value: 'standard', label: 'Standard Square', priceAdded: 0 }, 
          { value: 'rounded', label: 'Rounded Corners', priceAdded: 5 }
        ]},
        { id: 'bc-coating', name: 'Coating', type: 'dropdown', options: [
          { value: 'matte', label: 'Matte Soft-Touch', priceAdded: 0 }, 
          { value: 'glossy', label: 'High Gloss UV', priceAdded: 5 },
          { value: 'uncoated', label: 'Uncoated Texture', priceAdded: 0 }
        ]}
      ],
      categoryId: category1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Vinyl Banners',
      slug: 'vinyl-banners',
      description: 'Durable vinyl banners for indoor and outdoor use. Weather-resistant, vibrant colors, and reinforced edges for extreme durability.',
      basePrice: 55.0,
      images: ['https://images.unsplash.com/photo-1533038590840-1c76f254b03f?q=80&w=1470&auto=format&fit=crop'],
      attributes: [
        { id: 'vb-size', name: 'Banner Size', type: 'dropdown', options: [
          { value: '2x4', label: '2ft x 4ft', priceAdded: 0 }, 
          { value: '3x6', label: '3ft x 6ft', priceAdded: 35 }, 
          { value: '4x8', label: '4ft x 8ft', priceAdded: 75 },
          { value: '5x10', label: '5ft x 10ft', priceAdded: 140 }
        ]},
        { id: 'vb-material', name: 'Material Type', type: 'radio-text', options: [
          { value: '13oz', label: '13oz Standard Vinyl', priceAdded: 0 }, 
          { value: '18oz', label: '18oz Heavy Duty', priceAdded: 25 },
          { value: 'mesh', label: 'Mesh (Wind Resistant)', priceAdded: 30 }
        ]},
        { id: 'vb-finish', name: 'Edge Finishing', type: 'radio-text', options: [
          { value: 'hem-grommets', label: 'Hemmed with Grommets', priceAdded: 0 }, 
          { value: 'clean-cut', label: 'Clean Cut (No Hem)', priceAdded: -5 },
          { value: 'pole-pockets', label: 'Pole Pockets', priceAdded: 15 }
        ]},
        { id: 'vb-addons', name: 'Accessories', type: 'dropdown', options: [
          { value: 'none', label: 'None', priceAdded: 0 }, 
          { value: 'bungees', label: 'Bungee Cords (4-pack)', priceAdded: 10 },
          { value: 'zip-ties', label: 'Heavy Duty Zip Ties', priceAdded: 5 }
        ]}
      ],
      categoryId: category2.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Flyers & Brochures',
      slug: 'flyers-and-brochures',
      description: 'Custom printed flyers and brochures to promote your business effectively. Available in various folds and premium paper stocks.',
      basePrice: 45.5,
      images: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop'],
      attributes: [
        { id: 'fb-size', name: 'Size (Unfolded)', type: 'dropdown', options: [
          { value: '8.5x11', label: '8.5" x 11" (Letter)', priceAdded: 0 }, 
          { value: '8.5x14', label: '8.5" x 14" (Legal)', priceAdded: 15 },
          { value: '11x17', label: '11" x 17" (Tabloid)', priceAdded: 30 }
        ]},
        { id: 'fb-fold', name: 'Folding Options', type: 'radio-image', options: [
          { value: 'flat', label: 'No Fold (Flat Flyer)', priceAdded: 0 }, 
          { value: 'half-fold', label: 'Half-Fold', priceAdded: 10 }, 
          { value: 'tri-fold', label: 'Tri-Fold', priceAdded: 15 },
          { value: 'z-fold', label: 'Z-Fold', priceAdded: 15 }
        ]},
        { id: 'fb-paper', name: 'Paper Stock', type: 'dropdown', options: [
          { value: '100lb-gloss', label: '100lb Gloss Text', priceAdded: 0 },
          { value: '100lb-matte', label: '100lb Matte Text', priceAdded: 0 },
          { value: '14pt-card', label: '14pt Cardstock', priceAdded: 25 }
        ]}
      ],
      categoryId: category3.id,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Custom T-Shirts',
      slug: 'custom-t-shirts',
      description: 'High-quality cotton t-shirts with custom prints. Great for team building, merchandise, and promotional events.',
      basePrice: 18.99,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop'],
      attributes: [
        { id: 'ts-brand', name: 'Brand & Material', type: 'dropdown', options: [
          { value: 'gildan', label: 'Standard Cotton (Gildan)', priceAdded: 0 }, 
          { value: 'bella', label: 'Premium Soft Blend (Bella+Canvas)', priceAdded: 6 },
          { value: 'next-level', label: 'Tri-Blend (Next Level)', priceAdded: 8 }
        ]},
        { id: 'ts-size', name: 'Size', type: 'radio-text', options: [
          { value: 'S', label: 'Small', priceAdded: 0 }, 
          { value: 'M', label: 'Medium', priceAdded: 0 }, 
          { value: 'L', label: 'Large', priceAdded: 0 }, 
          { value: 'XL', label: 'X-Large', priceAdded: 2 },
          { value: '2XL', label: '2X-Large', priceAdded: 4 },
          { value: '3XL', label: '3X-Large', priceAdded: 6 }
        ]},
        { id: 'ts-color', name: 'Shirt Color', type: 'radio-text', options: [
          { value: 'white', label: 'White', priceAdded: 0 }, 
          { value: 'black', label: 'Black', priceAdded: 1 },
          { value: 'navy', label: 'Navy Blue', priceAdded: 1 },
          { value: 'heather', label: 'Heather Gray', priceAdded: 1 }
        ]},
        { id: 'ts-print', name: 'Print Location', type: 'dropdown', options: [
          { value: 'front-only', label: 'Front Only', priceAdded: 0 },
          { value: 'back-only', label: 'Back Only', priceAdded: 0 },
          { value: 'front-and-back', label: 'Front & Back', priceAdded: 8 },
          { value: 'front-back-sleeve', label: 'Front, Back & Sleeve', priceAdded: 14 }
        ]}
      ],
      categoryId: category4.id,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'Standard Business Cards',
      slug: 'standard-business-cards',
      description: 'Affordable, professional business cards for everyday networking. Quick turnaround without sacrificing quality.',
      basePrice: 15.00,
      images: ['https://images.unsplash.com/photo-1563198804-b1545b736531?q=80&w=1470&auto=format&fit=crop'],
      attributes: [
        { id: 'sbc-paper', name: 'Paper Type', type: 'radio-text', options: [
          { value: '14pt', label: '14pt Standard', priceAdded: 0 }, 
          { value: '16pt', label: '16pt Premium', priceAdded: 5 },
          { value: 'recycled', label: '100% Recycled Matte', priceAdded: 8 }
        ]},
        { id: 'sbc-sides', name: 'Printed Sides', type: 'radio-text', options: [
          { value: 'front', label: 'Front Only', priceAdded: 0 },
          { value: 'both', label: 'Front & Back', priceAdded: 4 }
        ]}
      ],
      categoryId: category1.id,
    },
  });

  const product6 = await prisma.product.create({
    data: {
      name: 'Custom Coffee Mugs',
      slug: 'custom-mugs',
      description: 'Personalized ceramic mugs perfect for corporate gifts, cafes, or promotional items. Microwave and dishwasher safe.',
      basePrice: 12.50,
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1470&auto=format&fit=crop'],
      attributes: [
        { id: 'mug-size', name: 'Mug Size', type: 'radio-text', options: [
          { value: '11oz', label: '11oz Standard', priceAdded: 0 }, 
          { value: '15oz', label: '15oz Large', priceAdded: 3.50 }
        ]},
        { id: 'mug-style', name: 'Color & Style', type: 'dropdown', options: [
          { value: 'classic-white', label: 'Classic White', priceAdded: 0 },
          { value: 'black-handle', label: 'White with Black Handle/Inside', priceAdded: 2 },
          { value: 'red-handle', label: 'White with Red Handle/Inside', priceAdded: 2 },
          { value: 'magic', label: 'Color-Changing Magic Mug', priceAdded: 6 }
        ]},
        { id: 'mug-print', name: 'Print Wrap', type: 'radio-text', options: [
          { value: 'one-side', label: 'One Side', priceAdded: 0 },
          { value: 'two-sides', label: 'Two Sides', priceAdded: 2 },
          { value: 'full-wrap', label: 'Full Edge-to-Edge Wrap', priceAdded: 4 }
        ]}
      ],
      categoryId: category3.id,
    },
  });

  const product7 = await prisma.product.create({
    data: {
      name: 'Presentation Folders',
      slug: 'presentation-folders',
      description: 'Professional presentation folders with pockets and business card slits. Make your proposals look polished and official.',
      basePrice: 85.00,
      images: ['https://images.unsplash.com/photo-1618422176882-62ce15c5eef6?q=80&w=1470&auto=format&fit=crop'],
      attributes: [
        { id: 'pf-finish', name: 'Exterior Finish', type: 'dropdown', options: [
          { value: 'glossy', label: 'High Gloss UV', priceAdded: 0 }, 
          { value: 'matte', label: 'Matte Soft-Touch', priceAdded: 15 },
          { value: 'spot-uv', label: 'Matte with Spot UV', priceAdded: 35 }
        ]},
        { id: 'pf-pockets', name: 'Pockets', type: 'radio-text', options: [
          { value: 'one-right', label: 'One Pocket (Right)', priceAdded: 0 },
          { value: 'two', label: 'Two Pockets', priceAdded: 10 }
        ]},
        { id: 'pf-slits', name: 'Business Card Slits', type: 'radio-text', options: [
          { value: 'none', label: 'None', priceAdded: 0 },
          { value: 'right', label: 'Right Pocket Slit', priceAdded: 0 },
          { value: 'both', label: 'Both Pockets Slits', priceAdded: 5 }
        ]}
      ],
      categoryId: category3.id,
    },
  });

  const product8 = await prisma.product.create({
    data: {
      name: 'Embroidered Polo Shirts',
      slug: 'embroidered-polo-shirts',
      description: 'Premium polo shirts with custom logo embroidery. Breathable fabric perfect for uniforms and corporate wear.',
      basePrice: 38.99,
      images: ['https://images.unsplash.com/photo-1586363104862-3a5e222ee1eb?q=80&w=1470&auto=format&fit=crop'],
      attributes: [
        { id: 'polo-material', name: 'Fabric Type', type: 'dropdown', options: [
          { value: 'cotton-blend', label: 'Cotton Pique Blend', priceAdded: 0 },
          { value: 'performance', label: 'Moisture-Wicking Performance', priceAdded: 6 }
        ]},
        { id: 'polo-size', name: 'Size', type: 'radio-text', options: [
          { value: 'S', label: 'S', priceAdded: 0 }, 
          { value: 'M', label: 'M', priceAdded: 0 }, 
          { value: 'L', label: 'L', priceAdded: 0 },
          { value: 'XL', label: 'XL', priceAdded: 2 },
          { value: '2XL', label: '2XL', priceAdded: 4 }
        ]},
        { id: 'polo-color', name: 'Color', type: 'dropdown', options: [
          { value: 'navy', label: 'Navy Blue', priceAdded: 0 },
          { value: 'black', label: 'Jet Black', priceAdded: 0 },
          { value: 'white', label: 'Classic White', priceAdded: 0 },
          { value: 'red', label: 'Crimson Red', priceAdded: 0 }
        ]},
        { id: 'polo-location', name: 'Embroidery Location', type: 'radio-text', options: [
          { value: 'left-chest', label: 'Left Chest', priceAdded: 0 },
          { value: 'right-chest', label: 'Right Chest', priceAdded: 0 },
          { value: 'sleeve', label: 'Sleeve', priceAdded: 2 },
          { value: 'chest-and-sleeve', label: 'Chest + Sleeve', priceAdded: 8 }
        ]}
      ],
      categoryId: category4.id,
    },
  });

  console.log('Fetching user for orders...');
  const user = await prisma.user.findFirst();
  if (user) {
    console.log('Creating dummy orders...');
    await prisma.order.create({
      data: {
        userId: user.id,
        status: 'COMPLETED',
        totalAmount: 119.98,
        items: {
          create: [
            { productId: product1.id, quantity: 2, unitPrice: 35.00, customConfig: { 'bc-paper': '400gsm', 'bc-finish': 'none' } },
            { productId: product4.id, quantity: 1, unitPrice: 20.99, customConfig: { 'ts-size': 'XL', 'ts-color': 'black' } }
          ],
        },
      },
    });
  }

  console.log('Seed completed successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

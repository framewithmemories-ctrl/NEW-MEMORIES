// Comprehensive Product Catalog Part 3
// 📚 Photo Albums, 🖼️ Canvas Prints, 🎁 Corporate Gifts, 🏢 Print Shop

export const expandedProductCatalogPart3 = [
  // 📚 PHOTO ALBUMS
  {
    id: 'professional-photo-album',
    name: 'Professional Photo Album',
    description: 'High-quality professional photo albums for special occasions',
    category: 'photo-albums',
    subcategory: 'professional-photo-album',
    base_price: 1299,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '20 Pages', price_add: 0 },
      { name: '40 Pages', price_add: 500 },
      { name: '60 Pages', price_add: 1000 }
    ]
  },
  {
    id: 'easy-photo-book',
    name: 'Easy Photo Book',
    description: 'Simple and elegant photo books for everyday memories',
    category: 'photo-albums',
    subcategory: 'easy-photo-book',
    base_price: 699,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '10 Pages', price_add: 0 },
      { name: '20 Pages', price_add: 200 },
      { name: '30 Pages', price_add: 400 }
    ]
  },

  // 🖼️ CANVAS PRINTS
  {
    id: 'canvas-prints-standard',
    name: 'Canvas Prints',
    description: 'Gallery-quality canvas prints of your favorite photos',
    category: 'canvas-prints',
    subcategory: 'canvas-prints',
    base_price: 899,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '12x16', price_add: 0 },
      { name: '16x20', price_add: 300 },
      { name: '20x24', price_add: 600 },
      { name: '24x30', price_add: 1000 }
    ]
  },
  {
    id: 'photo-collage-canvas',
    name: 'Photo Collage Canvas',
    description: 'Multiple photos arranged beautifully on canvas',
    category: 'canvas-prints',
    subcategory: 'photo-collage',
    base_price: 1199,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '4 Photos', price_add: 0 },
      { name: '6 Photos', price_add: 200 },
      { name: '9 Photos', price_add: 400 }
    ]
  },
  {
    id: 'canvas-wall-displays',
    name: 'Canvas Wall Displays',
    description: 'Large format canvas displays for wall decoration',
    category: 'canvas-prints',
    subcategory: 'canvas-wall-displays',
    base_price: 1599,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '20x30', price_add: 0 },
      { name: '30x40', price_add: 500 },
      { name: '40x60', price_add: 1200 }
    ]
  },

  // 🎁 CORPORATE GIFTS
  {
    id: 'mouse-pad-custom',
    name: 'Custom Mouse Pad',
    description: 'Professional mouse pads with company branding',
    category: 'corporate-gifts',
    subcategory: 'mouse-pad',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Standard', price_add: 0 },
      { name: 'Large', price_add: 50 },
      { name: 'XL Gaming', price_add: 100 }
    ]
  },
  {
    id: 'photo-magnets',
    name: 'Custom Photo Magnets',
    description: 'Promotional magnets with custom photos and branding',
    category: 'corporate-gifts',
    subcategory: 'photo-magnets',
    base_price: 79,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Small', price_add: 0 },
      { name: 'Medium', price_add: 20 },
      { name: 'Large', price_add: 40 }
    ]
  },

  // 🏢 PRINT SHOP - STATIONERY
  {
    id: 'booklet-printing',
    name: 'Booklet Printing',
    description: 'Professional booklet printing for business needs',
    category: 'print-shop',
    subcategory: 'booklet',
    base_price: 149,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'A5 - 8 Pages', price_add: 0 },
      { name: 'A4 - 16 Pages', price_add: 50 },
      { name: 'A4 - 32 Pages', price_add: 120 }
    ]
  },
  {
    id: 'certificate-printing',
    name: 'Certificate Printing',
    description: 'High-quality certificate printing on premium paper',
    category: 'print-shop',
    subcategory: 'certificate',
    base_price: 99,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'A4 Standard', price_add: 0 },
      { name: 'A3 Large', price_add: 50 }
    ]
  },
  {
    id: 'id-card-printing',
    name: 'ID Card Printing',
    description: 'Professional ID card printing with lamination',
    category: 'print-shop',
    subcategory: 'id-card',
    base_price: 49,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Standard ID', price_add: 0 },
      { name: 'PVC Card', price_add: 30 }
    ]
  },
  {
    id: 'leaflets-printing',
    name: 'Leaflets Printing',
    description: 'Marketing leaflets and flyers printing service',
    category: 'print-shop',
    subcategory: 'leaflets',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'A5 - 100 qty', price_add: 0 },
      { name: 'A4 - 100 qty', price_add: 100 },
      { name: 'A3 - 100 qty', price_add: 200 }
    ]
  },
  {
    id: 'letterhead-printing',
    name: 'Letterhead Printing',
    description: 'Professional letterhead printing for businesses',
    category: 'print-shop',
    subcategory: 'letterhead',
    base_price: 299,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '100 sheets', price_add: 0 },
      { name: '500 sheets', price_add: 200 },
      { name: '1000 sheets', price_add: 350 }
    ]
  },
  {
    id: 'envelope-cover-printing',
    name: 'Envelope Cover Printing',
    description: 'Custom envelope printing with company branding',
    category: 'print-shop',
    subcategory: 'envelope-cover',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '50 envelopes', price_add: 0 },
      { name: '100 envelopes', price_add: 100 }
    ]
  },
  {
    id: 'memo-pad-printing',
    name: 'Memo Pad Printing',
    description: 'Custom memo pads for office use',
    category: 'print-shop',
    subcategory: 'memo-pad',
    base_price: 149,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '50 sheets', price_add: 0 },
      { name: '100 sheets', price_add: 50 }
    ]
  },
  {
    id: 'presentation-folders',
    name: 'Presentation Folders',
    description: 'Professional presentation folders for business',
    category: 'print-shop',
    subcategory: 'presentation-folders',
    base_price: 399,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '25 folders', price_add: 0 },
      { name: '50 folders', price_add: 200 }
    ]
  },
  {
    id: 'school-label-printing',
    name: 'School Label Printing',
    description: 'Custom labels for school books and supplies',
    category: 'print-shop',
    subcategory: 'school-label',
    base_price: 99,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '50 labels', price_add: 0 },
      { name: '100 labels', price_add: 40 }
    ]
  },

  // MARKETING MATERIALS
  {
    id: 'brochures-printing',
    name: 'Brochures Printing',
    description: 'High-quality brochure printing for marketing',
    category: 'print-shop',
    subcategory: 'brochures',
    base_price: 399,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Tri-fold - 100 qty', price_add: 0 },
      { name: 'Bi-fold - 100 qty', price_add: 100 }
    ]
  },
  {
    id: 'flyers-printing',
    name: 'Flyers Printing',
    description: 'Eye-catching flyers for promotions and events',
    category: 'print-shop',
    subcategory: 'flyers',
    base_price: 299,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'A5 - 100 qty', price_add: 0 },
      { name: 'A4 - 100 qty', price_add: 100 }
    ]
  },
  {
    id: 'poster-printing',
    name: 'Poster Printing',
    description: 'Large format poster printing service',
    category: 'print-shop',
    subcategory: 'poster',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'A3', price_add: 0 },
      { name: 'A2', price_add: 100 },
      { name: 'A1', price_add: 200 },
      { name: 'A0', price_add: 400 }
    ]
  },

  // LABELS, STICKERS & PACKAGING
  {
    id: 'label-stickers-printing',
    name: 'Labels & Stickers',
    description: 'Custom labels and stickers for various purposes',
    category: 'print-shop',
    subcategory: 'label-stickers',
    base_price: 149,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '100 stickers', price_add: 0 },
      { name: '500 stickers', price_add: 200 }
    ]
  },
  {
    id: 'hanging-dangler',
    name: 'Hanging Dangler',
    description: 'Promotional hanging danglers for retail',
    category: 'print-shop',
    subcategory: 'hanging-dangler',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Small - 25 qty', price_add: 0 },
      { name: 'Large - 25 qty', price_add: 100 }
    ]
  },
  {
    id: 'tags-printing',
    name: 'Tags Printing',
    description: 'Custom tags for products and branding',
    category: 'print-shop',
    subcategory: 'tags',
    base_price: 99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '50 tags', price_add: 0 },
      { name: '100 tags', price_add: 50 }
    ]
  },

  // CORPORATE SIGNAGE & AWARDS
  {
    id: 'sign-board',
    name: 'Sign Board',
    description: 'Professional signage for business and offices',
    category: 'print-shop',
    subcategory: 'sign-board',
    base_price: 999,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '2x1 feet', price_add: 0 },
      { name: '3x2 feet', price_add: 500 },
      { name: '4x3 feet', price_add: 1000 }
    ]
  },
  {
    id: 'name-plate-office',
    name: 'Office Name Plate',
    description: 'Professional name plates for office use',
    category: 'print-shop',
    subcategory: 'name-plate',
    base_price: 299,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Standard', price_add: 0 },
      { name: 'Premium', price_add: 200 }
    ]
  },
  {
    id: 'awards-shields',
    name: 'Awards & Shields',
    description: 'Custom awards and shields for recognition',
    category: 'print-shop',
    subcategory: 'awards-shields',
    base_price: 699,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Small Award', price_add: 0 },
      { name: 'Medium Shield', price_add: 200 },
      { name: 'Large Trophy', price_add: 500 }
    ]
  },

  // INVITATIONS & CARDS
  {
    id: 'invitations-printing',
    name: 'Invitation Cards',
    description: 'Elegant invitation cards for special occasions',
    category: 'print-shop',
    subcategory: 'invitations',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '50 cards', price_add: 0 },
      { name: '100 cards', price_add: 150 }
    ]
  },
  {
    id: 'greeting-cards',
    name: 'Greeting Cards',
    description: 'Custom greeting cards for all occasions',
    category: 'print-shop',
    subcategory: 'greeting-cards',
    base_price: 149,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '25 cards', price_add: 0 },
      { name: '50 cards', price_add: 100 }
    ]
  },

  // VISITING CARDS WITH FINISHES
  {
    id: 'visiting-cards-glossy',
    name: 'Visiting Cards - Glossy',
    description: 'Professional visiting cards with glossy finish',
    category: 'print-shop',
    subcategory: 'visiting-cards',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    materials: [{ name: 'Glossy', price_add: 0 }],
    sizes: [
      { name: '100 cards', price_add: 0 },
      { name: '500 cards', price_add: 300 },
      { name: '1000 cards', price_add: 500 }
    ]
  },
  {
    id: 'visiting-cards-matte',
    name: 'Visiting Cards - Matte',
    description: 'Professional visiting cards with matte finish',
    category: 'print-shop',
    subcategory: 'visiting-cards',
    base_price: 199,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    materials: [{ name: 'Matte', price_add: 0 }],
    sizes: [
      { name: '100 cards', price_add: 0 },
      { name: '500 cards', price_add: 300 }
    ]
  },
  {
    id: 'visiting-cards-textured',
    name: 'Visiting Cards - Textured',
    description: 'Premium visiting cards with special textures',
    category: 'print-shop',
    subcategory: 'visiting-cards',
    base_price: 299,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    materials: [
      { name: 'Needle Point', price_add: 0 },
      { name: 'Lenin Textured', price_add: 50 },
      { name: 'Ivory', price_add: 100 },
      { name: 'Synthetic', price_add: 150 }
    ],
    sizes: [
      { name: '100 cards', price_add: 0 },
      { name: '500 cards', price_add: 400 }
    ]
  },
  {
    id: 'visiting-cards-metallic',
    name: 'Visiting Cards - Metallic',
    description: 'Luxury visiting cards with metallic finish',
    category: 'print-shop',
    subcategory: 'visiting-cards',
    base_price: 399,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=300',
    materials: [
      { name: 'Metallic Silver', price_add: 0 },
      { name: 'Metallic Dual Silver', price_add: 100 }
    ],
    sizes: [
      { name: '100 cards', price_add: 0 },
      { name: '500 cards', price_add: 500 }
    ]
  }
];

export default expandedProductCatalogPart3;
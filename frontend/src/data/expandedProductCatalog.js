// Comprehensive Product Catalog for Memories Photo Frames & Custom Gift Shop
// 📸 Photo Print Services, 🎁 Photo Gifts, 🌟 Specialized Photo Gift, 
// 🖼️ Photo Frames, 📚 Photo Albums, 🖼️ Canvas Prints, 🎁 Corporate Gifts, 🏢 Print Shop

export const expandedProductCatalog = [
  // 📸 PHOTO PRINT SERVICES
  {
    id: 'photo-prints-standard',
    name: 'Standard Photo Prints',
    description: 'High-quality photo prints on premium photo paper',
    category: 'photo-prints',
    subcategory: 'photo-prints',
    base_price: 15,
    image_url: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '4x6', price_add: 0 },
      { name: '5x7', price_add: 10 },
      { name: '8x10', price_add: 25 },
      { name: '11x14', price_add: 50 }
    ]
  },
  {
    id: 'photo-enlargement',
    name: 'Photo Enlargement',
    description: 'Professional photo enlargement service with crystal clarity',
    category: 'photo-prints',
    subcategory: 'photo-enlargement',
    base_price: 150,
    image_url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '16x20', price_add: 0 },
      { name: '20x24', price_add: 100 },
      { name: '24x30', price_add: 200 },
      { name: '30x40', price_add: 400 }
    ]
  },
  {
    id: 'polaroid-prints',
    name: 'Polaroid Style Prints',
    description: 'Vintage polaroid-style instant photo prints',
    category: 'photo-prints',
    subcategory: 'polaroid-prints',
    base_price: 25,
    image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Standard', price_add: 0 },
      { name: 'Large', price_add: 15 }
    ]
  },
  {
    id: 'passport-photo',
    name: 'Passport Photo Service',
    description: 'Professional passport photos meeting all official requirements',
    category: 'photo-prints',
    subcategory: 'passport-photo',
    base_price: 99,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Indian Passport', price_add: 0 },
      { name: 'US Visa', price_add: 20 },
      { name: 'UK Visa', price_add: 20 }
    ]
  },
  {
    id: 'digital-art',
    name: 'Digital Art Creation',
    description: 'Transform your photos into stunning digital artwork',
    category: 'photo-prints',
    subcategory: 'digital-art',
    base_price: 299,
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Portrait Style', price_add: 0 },
      { name: 'Abstract Style', price_add: 100 },
      { name: 'Watercolor Style', price_add: 150 }
    ]
  },
  {
    id: 'photo-restoration',
    name: 'Photo Restoration Service',
    description: 'Professional restoration of old and damaged photographs',
    category: 'photo-prints',
    subcategory: 'photo-restoration',
    base_price: 399,
    image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Basic Repair', price_add: 0 },
      { name: 'Advanced Restoration', price_add: 200 },
      { name: 'Colorization', price_add: 300 }
    ]
  },

  // 🎁 PHOTO GIFTS
  {
    id: 'led-photo-lamp',
    name: 'LED Photo Lamp',
    description: 'Illuminate your memories with customizable LED photo lamp',
    category: 'photo-gifts',
    subcategory: 'led-photo-lamp',
    base_price: 899,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Single Photo', price_add: 0 },
      { name: 'Multi Photo', price_add: 200 },
      { name: 'Color Changing', price_add: 300 }
    ]
  },
  {
    id: 'photo-mugs-premium',
    name: 'Premium Photo Mugs',
    description: 'High-quality ceramic mugs with your favorite photos',
    category: 'photo-gifts',
    subcategory: 'photo-mugs',
    base_price: 299,
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '11oz Standard', price_add: 0 },
      { name: '15oz Large', price_add: 50 },
      { name: 'Magic Mug', price_add: 150 }
    ]
  },
  {
    id: 'photo-pillows',
    name: 'Custom Photo Pillows',
    description: 'Soft, comfortable pillows with your precious memories',
    category: 'photo-gifts',
    subcategory: 'photo-pillows',
    base_price: 599,
    image_url: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa8c?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '12x12 Square', price_add: 0 },
      { name: '16x16 Large', price_add: 100 },
      { name: 'Heart Shape', price_add: 150 }
    ]
  },
  {
    id: '3d-crystal',
    name: '3D Crystal Photo',
    description: 'Laser engraved 3D crystal with your photo inside',
    category: 'photo-gifts',
    subcategory: '3d-crystal',
    base_price: 1299,
    image_url: 'https://images.unsplash.com/photo-1518709594023-6eab742d3a23?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Small Crystal', price_add: 0 },
      { name: 'Medium Crystal', price_add: 300 },
      { name: 'Large Crystal', price_add: 600 }
    ]
  },
  {
    id: 'photo-plates',
    name: 'Custom Photo Plates',
    description: 'Elegant ceramic plates with your favorite photos',
    category: 'photo-gifts',
    subcategory: 'photo-plates',
    base_price: 449,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Dinner Plate', price_add: 0 },
      { name: 'Decorative Plate', price_add: 100 }
    ]
  },
  {
    id: 'photo-tshirts',
    name: 'Custom Photo T-Shirts',
    description: 'Premium quality t-shirts with sublimation photo printing',
    category: 'photo-gifts',
    subcategory: 't-shirts',
    base_price: 349,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'S', price_add: 0 },
      { name: 'M', price_add: 0 },
      { name: 'L', price_add: 30 },
      { name: 'XL', price_add: 50 },
      { name: 'XXL', price_add: 80 }
    ]
  },
  {
    id: 'photo-calendars',
    name: 'Custom Photo Calendars',
    description: 'Personalized calendars featuring your favorite memories',
    category: 'photo-gifts',
    subcategory: 'calendars',
    base_price: 399,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Desktop Calendar', price_add: 0 },
      { name: 'Wall Calendar', price_add: 100 },
      { name: 'Spiral Calendar', price_add: 150 }
    ]
  },
  {
    id: 'photo-wall-clock',
    name: 'Photo Wall Clock',
    description: 'Functional wall clock with your custom photo design',
    category: 'photo-gifts',
    subcategory: 'photo-wall-clock',
    base_price: 699,
    image_url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: '10 inch', price_add: 0 },
      { name: '12 inch', price_add: 100 },
      { name: '14 inch', price_add: 200 }
    ]
  },
  {
    id: 'photo-keychains',
    name: 'Custom Photo Keychains',
    description: 'Portable memories on durable acrylic keychains',
    category: 'photo-gifts',
    subcategory: 'key-chains',
    base_price: 99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=300',
    sizes: [
      { name: 'Standard', price_add: 0 },
      { name: 'Heart Shape', price_add: 20 },
      { name: 'Circle Shape', price_add: 20 }
    ]
  }
];

export default expandedProductCatalog;
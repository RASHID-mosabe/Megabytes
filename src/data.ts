import { MenuItem, PromoDeal, ChooseFeature, InstagramPost } from './types';

export const HERO_PIZZA_IMAGE = 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1000&auto=format&fit=crop&q=80';
export const HERO_BG_IMAGE = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1400';

export const MENU_ITEMS: MenuItem[] = [
  // --- Sizzlers ---
  {
    id: 'sz1',
    name: 'Mega Chicken Sizzler',
    description: 'Our standout signature dish: succulent grilled chicken breast marinated in exotic spices, served sizzling hot with roasted veggies, seasoned chips, and our house-secret sizzler glaze.',
    priceMin: 1200,
    priceMax: 1800,
    prices: {
      Small: 1200,
      Medium: 1500,
      Large: 1800
    },
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80',
    category: 'Sizzlers',
    ingredients: ['Spiced Grilled Chicken', 'Sizzling Onions & Peppers', 'House Glaze', 'Crispy Potato Wedges', 'Fresh Herbs'],
    tags: ['Best Seller', 'Signature', 'Sizzling'],
    badge: 'Must Order',
    calories: 780
  },
  {
    id: 'sz2',
    name: 'Garden Vegetable Sizzler',
    description: 'A steaming sizzler plate packed with grilled paneer, crispy garden broccoli, bell peppers, carrots, and mushrooms tossed in chef’s signature aromatic glaze.',
    priceMin: 950,
    priceMax: 1450,
    prices: {
      Small: 950,
      Medium: 1200,
      Large: 1450
    },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    category: 'Sizzlers',
    ingredients: ['Grilled Paneer', 'Fresh Broccoli', 'Assorted Bell Peppers', 'Exotic Mushrooms', 'Garlic Glaze'],
    tags: ['Vegetarian', 'Healthy', 'Steaming'],
    badge: 'Popular',
    calories: 540
  },

  // --- Swahili ---
  {
    id: 'sw1',
    name: 'Swahili Beef Pilau',
    description: 'Fragrant, slow-simmered basmati rice infused with traditional Swahili spices, served with tender beef cubes and a side of fresh Kachumbari salad.',
    priceMin: 650,
    priceMax: 950,
    prices: {
      Small: 650,
      Medium: 800,
      Large: 950
    },
    image: 'https://images.unsplash.com/photo-1567153051010-b9894e77242c?w=800&auto=format&fit=crop&q=80',
    category: 'Swahili',
    ingredients: ['Aromatic Pilau Rice', 'Marinated Beef', 'Cardamom & Cloves', 'Kachumbari (Tomato & Onion)', 'Chili twist'],
    tags: ['Locals Choice', 'Authentic'],
    badge: 'Swahili Heritage',
    calories: 650
  },
  {
    id: 'sw2',
    name: 'Samaki wa Kupaka',
    description: 'Local fresh lake fish char-grilled to absolute perfection and coated with a rich, creamy Swahili coconut-tamarind sauce.',
    priceMin: 850,
    priceMax: 1250,
    prices: {
      Small: 850,
      Medium: 1050,
      Large: 1250
    },
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
    category: 'Swahili',
    ingredients: ['Grilled Tilapia Fish', 'Creamy Coconut Milk', 'Tamarind Paste', 'Ginger-Garlic Crush', 'Fresh Lime'],
    tags: ['Seafood', 'Rich Curry'],
    badge: 'Chef Special',
    calories: 590
  },

  // --- Indian ---
  {
    id: 'in1',
    name: 'Creamy Palak Paneer',
    description: 'Often cited as Kitale’s favorite vegetarian delight. Silky, spiced spinach curry studded with cubes of fresh pan-seared cottage cheese.',
    priceMin: 750,
    priceMax: 1150,
    prices: {
      Small: 750,
      Medium: 950,
      Large: 1150
    },
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    category: 'Indian',
    ingredients: ['Fresh Spinach Puree', 'Paneer (Cottage Cheese)', 'Garam Masala', 'Fresh Cream', 'Ginger & Garlic'],
    tags: ['Vegetarian', 'Highly Rated'],
    badge: 'Kitale Favorite',
    calories: 460
  },
  {
    id: 'in2',
    name: 'Mouthwatering Butter Chicken',
    description: 'Juicy tandoori chicken chunks cooked in a rich, velvety tomato butter gravy, infused with fenugreek leaves and cream.',
    priceMin: 850,
    priceMax: 1300,
    prices: {
      Small: 850,
      Medium: 1100,
      Large: 1300
    },
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80',
    category: 'Indian',
    ingredients: ['Tandoori Spiced Chicken', 'Velvety Tomato Gravy', 'Pure Butter & Cream', 'Kasuri Methi', 'Almond Paste'],
    tags: ['Rich', 'Mild Spicy'],
    badge: 'Best Seller',
    calories: 680
  },

  // --- Chinese ---
  {
    id: 'ch1',
    name: 'Fiery Chili Chicken',
    description: 'A go-to for Indo-Chinese cravings. Crispy chicken chunks tossed in a dark, sweet, spicy, and tangy soy-chili reduction with spring onions.',
    priceMin: 800,
    priceMax: 1200,
    prices: {
      Small: 800,
      Medium: 1000,
      Large: 1200
    },
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80',
    category: 'Chinese',
    ingredients: ['Wok-Fried Chicken Chunks', 'Tangy Soy-Chili Glaze', 'Green Peppers', 'Garlic & Ginger', 'Fresh Scallions'],
    tags: ['Indo-Chinese', 'Spicy', 'Tangy'],
    badge: 'Popular',
    calories: 510
  },

  // --- Sides ---
  {
    id: 'sd1',
    name: 'Mouth-Watering Garlic Chips',
    description: 'Our legendary side dish. Golden, crispy hand-cut chips tossed in a savory garlic herb butter infusion, sprinkled with fresh cilantro.',
    priceMin: 350,
    priceMax: 550,
    prices: {
      Small: 350,
      Medium: 450,
      Large: 550
    },
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80',
    category: 'Sides',
    ingredients: ['Hand-Cut Potatoes', 'Roasted Garlic Butter', 'Fresh Parsley & Cilantro', 'Sea Salt Flakes'],
    tags: ['Legendary Side', 'Garlicky', 'Crispy'],
    badge: 'Mouth-Watering',
    calories: 390
  },
  {
    id: 'sd2',
    name: 'Butter & Garlic Naan Trio',
    description: 'The ultimate bread pairing for your curries. Fresh tandoor-baked flatbreads brushed generously with salted butter and crushed garlic.',
    priceMin: 200,
    priceMax: 350,
    prices: {
      Small: 200,
      Medium: 280,
      Large: 350
    },
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&auto=format&fit=crop&q=80',
    category: 'Sides',
    ingredients: ['Tandoor Flatbread', 'Melted Ghee Butter', 'Fresh Minced Garlic', 'Coriander Leaves'],
    tags: ['Bread Pairing', 'Fluffy'],
    calories: 290
  }
];

export const PROMO_DEALS: PromoDeal[] = [
  {
    id: 'deal-1',
    title: 'Sizzler Feast Combo',
    subtitle: 'Sh 1,850',
    discountText: 'Get our standout Chicken Sizzler, a side of Garlic Chips, and Swahili Passion juice.',
    bgType: 'orange',
    buttonText: 'ORDER FEAST'
  },
  {
    id: 'deal-2',
    title: '15% OFF',
    subtitle: 'First Order',
    discountText: 'Use coupon code MEGABYTES15 at checkout to claim your warm welcome discount in Kitale.',
    bgType: 'cream',
    buttonText: 'APPLY COUPON'
  },
  {
    id: 'deal-3',
    title: 'Free Naan Bread',
    subtitle: 'on orders Sh 2,000+',
    discountText: 'Add fluffy butter naan to your feast automatically when ordering premium curries.',
    bgType: 'gold',
    buttonText: 'CLAIM OFFER'
  }
];

export const CHOOSE_FEATURES: ChooseFeature[] = [
  {
    id: 'feat-1',
    title: 'Serene Atmosphere',
    description: 'Catering to different dining preferences with beautifully designed indoor & outdoor garden seating options in Kitale.',
    iconName: 'Sprout'
  },
  {
    id: 'feat-2',
    title: 'Authentic Fusion Culinary',
    description: 'An exceptional diverse menu featuring fresh Swahili staples, classic North Indian curries, and Indo-Chinese favorites.',
    iconName: 'Sparkles'
  },
  {
    id: 'feat-3',
    title: 'Attentive & Serene Service',
    description: 'Renowned among locals and visitors alike for warm hospitality, cozy table setups, and exceptionally friendly staff.',
    iconName: 'Truck'
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=80',
    likes: 1245,
    comments: 48,
    caption: 'Sizzling hot, smoky goodness! Our legendary Chicken Sizzler has Kitale talking. 🍗🔥 #sizzler #foodie #kitale #megabytes',
    url: 'https://instagram.com'
  },
  {
    id: 'ig-2',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    likes: 984,
    comments: 32,
    caption: 'Creamy, rich Palak Paneer paired with hot garlic naan bread is the perfect serene dinner plan. 🥬🍛 #indian #paneer #megabytes',
    url: 'https://instagram.com'
  },
  {
    id: 'ig-3',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
    likes: 1530,
    comments: 76,
    caption: 'Golden, crispy hand-cut chips tossed in garlic-herb butter. Simply mouth-watering! 🧄🍟 #garlicchips #kitale #swahili',
    url: 'https://instagram.com'
  },
  {
    id: 'ig-4',
    imageUrl: 'https://images.unsplash.com/photo-1567153051010-b9894e77242c?w=500&auto=format&fit=crop&q=80',
    likes: 2110,
    comments: 112,
    caption: 'Aromatic, spice-infused Swahili Pilau cooked with love. Experience authentic hospitality today. 🌾🍛 #pilau #swahili #kenya',
    url: 'https://instagram.com'
  }
];

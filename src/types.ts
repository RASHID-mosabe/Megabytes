export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceMin: number;
  priceMax: number;
  prices: {
    Small: number;
    Medium: number;
    Large: number;
  };
  image: string;
  category: 'Sizzlers' | 'Swahili' | 'Indian' | 'Chinese' | 'Sides';
  ingredients?: string[];
  tags?: string[];
  badge?: string;
  calories?: number;
}

export interface CartItem {
  id: string; // Unique instance ID (item.id + size)
  menuItem: MenuItem;
  size: 'Small' | 'Medium' | 'Large';
  quantity: number;
  selectedPrice: number;
  extraNotes?: string;
}

export interface PromoDeal {
  id: string;
  title: string;
  subtitle: string;
  discountText?: string;
  badge?: string;
  bgType: 'orange' | 'cream' | 'gold';
  buttonText: string;
  image?: string;
}

export interface ChooseFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
  url: string;
}

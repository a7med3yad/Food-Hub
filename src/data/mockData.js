
export const mockRestaurants = [
  {
    id: '1',
    name: 'Italian Bistro',
    description: 'Authentic Italian cuisine with fresh pasta and wood-fired pizzas',
    image: '/images/restaurant1.jpg',
    deliveryTime: '30-40 min',
    minimumOrder: 15,
    categories: ['pizza', 'pasta', 'salads', 'desserts']
  },
  {
    id: '2',
    name: 'Sushi Palace',
    description: 'Fresh sushi and Japanese specialties made by expert chefs',
    image: '/images/restaurant2.jpg',
    deliveryTime: '25-35 min',
    minimumOrder: 20,
    categories: ['sushi', 'ramen', 'appetizers', 'desserts']
  },
  {
    id: '3',
    name: 'Burger House',
    description: 'Juicy burgers, crispy fries, and delicious milkshakes',
    image: '/images/restaurant3.jpg',
    deliveryTime: '20-30 min',
    minimumOrder: 10,
    categories: ['burgers', 'sides', 'drinks', 'desserts']
  },
  {
    id: '4',
    name: 'Thai Spice',
    description: 'Flavorful Thai dishes with authentic spices and herbs',
    image: '/images/restaurant4.jpg',
    deliveryTime: '35-45 min',
    minimumOrder: 18,
    categories: ['curries', 'noodles', 'rice', 'appetizers']
  },
  {
    id: '5',
    name: 'Mexican Cantina',
    description: 'Vibrant Mexican food with fresh ingredients and bold flavors',
    image: '/images/restaurant5.jpg',
    deliveryTime: '30-40 min',
    minimumOrder: 12,
    categories: ['tacos', 'burritos', 'sides', 'desserts']
  },
  {
    id: '6',
    name: 'Chinese Dragon',
    description: 'Traditional Chinese dishes with modern presentation',
    image: '/images/restaurant6.jpg',
    deliveryTime: '25-35 min',
    minimumOrder: 15,
    categories: ['mains', 'rice', 'noodles', 'appetizers']
  }
];

export const mockMenuItems = [
  { id: 'm1', restaurantId: '1', name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil', price: 12.99, image: '/images/item1.jpg', category: 'pizza' },
  { id: 'm2', restaurantId: '1', name: 'Carbonara Pasta', description: 'Creamy pasta with bacon, eggs, and parmesan cheese', price: 14.99, image: '/images/item2.jpeg', category: 'pasta' },
  { id: 'm3', restaurantId: '1', name: 'Caesar Salad', description: 'Crispy romaine lettuce with Caesar dressing and croutons', price: 8.99, image: '/images/item3.jpeg', category: 'salads' },
  { id: 'm4', restaurantId: '1', name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers', price: 6.99, image: '/images/item4.jpeg', category: 'desserts' },
  { id: 'm5', restaurantId: '2', name: 'California Roll', description: 'Crab, avocado, and cucumber wrapped in seaweed and rice', price: 9.99, image: '/images/item5.jpeg', category: 'sushi' },
  { id: 'm6', restaurantId: '2', name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo and sesame seeds', price: 11.99, image: '/images/item6.jpeg', category: 'sushi' },
  { id: 'm7', restaurantId: '2', name: 'Tonkotsu Ramen', description: 'Rich pork bone broth with noodles, egg, and chashu', price: 13.99, image: '/images/item7.jpeg', category: 'ramen' },
  { id: 'm8', restaurantId: '2', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 5.99, image: '/images/item8.jpg', category: 'appetizers' },
  { id: 'm9', restaurantId: '3', name: 'Classic Cheeseburger', description: 'Beef patty with cheese, lettuce, tomato, and special sauce', price: 10.99, image: '/images/item9.jpeg', category: 'burgers' },
  { id: 'm10', restaurantId: '3', name: 'BBQ Bacon Burger', description: 'Beef patty with bacon, BBQ sauce, and onion rings', price: 12.99, image: '/images/item10.jpeg', category: 'burgers' },
  { id: 'm11', restaurantId: '3', name: 'French Fries', description: 'Crispy golden fries with sea salt', price: 4.99, image: '/images/item11.jpeg', category: 'sides' },
  { id: 'm12', restaurantId: '3', name: 'Chocolate Milkshake', description: 'Thick and creamy chocolate milkshake', price: 5.99, image: '/images/item12.jpeg', category: 'drinks' },
  { id: 'm13', restaurantId: '4', name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp, peanuts, and lime', price: 12.99, image: '/images/item13.jpeg', category: 'noodles' },
  { id: 'm14', restaurantId: '4', name: 'Green Curry', description: 'Coconut curry with vegetables and your choice of protein', price: 13.99, image: '/images/item14.jpeg', category: 'curries' },
  { id: 'm15', restaurantId: '4', name: 'Thai Fried Rice', description: 'Jasmine rice stir-fried with vegetables and egg', price: 10.99, image: '/images/item15.jpeg', category: 'rice' },
  { id: 'm16', restaurantId: '4', name: 'Spring Rolls', description: 'Fresh vegetables wrapped in rice paper with peanut sauce', price: 6.99, image: '/images/item16.jpeg', category: 'appetizers' },
  { id: 'm17', restaurantId: '5', name: 'Beef Tacos', description: 'Three soft tacos with seasoned beef, salsa, and guacamole', price: 11.99, image: '/images/item17.jpeg', category: 'tacos' },
  { id: 'm18', restaurantId: '5', name: 'Chicken Burrito', description: 'Large flour tortilla filled with chicken, rice, beans, and cheese', price: 12.99, image: '/images/item18.jpeg', category: 'burritos' },
  { id: 'm19', restaurantId: '5', name: 'Nachos Supreme', description: 'Tortilla chips topped with cheese, jalapeños, and sour cream', price: 8.99, image: '/images/item19.jpeg', category: 'sides' },
  { id: 'm20', restaurantId: '5', name: 'Churros', description: 'Fried dough pastry with cinnamon sugar and chocolate sauce', price: 5.99, image: '/images/item20.webp', category: 'desserts' },
  { id: 'm21', restaurantId: '6', name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts and vegetables', price: 13.99, image: '/images/item21.jpeg', category: 'mains' },
  { id: 'm22', restaurantId: '6', name: 'Sweet and Sour Pork', description: 'Crispy pork with bell peppers in tangy sweet and sour sauce', price: 14.99, image: '/images/item22.jpeg', category: 'mains' },
  { id: 'm23', restaurantId: '6', name: 'Chow Mein', description: 'Stir-fried noodles with vegetables and your choice of protein', price: 11.99, image: '/images/item23.jpg', category: 'noodles' },
  { id: 'm24', restaurantId: '6', name: 'Dumplings', description: 'Steamed pork dumplings with soy dipping sauce', price: 7.99, image: '/images/item24.jpeg', category: 'appetizers' }
];
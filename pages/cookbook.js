import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

// Complete recipe database with ingredients
const RECIPES = [
  {
    id: 1,
    name: 'Chicken thighs, smashed potatoes, green beans',
    category: 'frequent',
    protein: 'chicken',
    hasLeftovers: true,
    ingredients: [
      { item: 'Chicken thighs, bone-in', qty: '3-4 lbs', category: 'protein' },
      { item: 'Mini potatoes', qty: '3 lbs', category: 'produce' },
      { item: 'Green beans', qty: '1.5 lbs', category: 'produce' },
      { item: 'Garlic', qty: '1 head', category: 'produce' },
      { item: 'Butter', qty: '1/2 cup', category: 'dairy', pantry: true },
    ],
    pantryStaples: ['Olive oil', 'Salt', 'Pepper', 'Paprika'],
    notes: 'Roast thighs at 425°F for 35-40 min. Boil potatoes until tender, smash and crisp in pan.'
  },
  {
    id: 2,
    name: 'Salmon, cous cous, roasted broccoli',
    category: 'moderate',
    protein: 'fish',
    hasLeftovers: false,
    ingredients: [
      { item: 'Salmon fillet', qty: '1.5 lbs', category: 'protein', source: "Dad's Store" },
      { item: 'Cous cous (Far East brand)', qty: '1 box', category: 'pantry' },
      { item: 'Broccoli', qty: '2 heads', category: 'produce' },
      { item: 'Lemon', qty: '2', category: 'produce' },
      { item: 'Butter', qty: '4 tbsp', category: 'dairy', pantry: true },
    ],
    pantryStaples: ['Olive oil', 'Salt', 'Pepper', 'Garlic powder'],
    notes: 'Get salmon from Dad\'s Store. Roast broccoli at 425°F for 20 min.'
  },
  {
    id: 3,
    name: 'Turkey patty melts and red pepper tomato soup',
    category: 'moderate',
    protein: 'turkey',
    hasLeftovers: false,
    ingredients: [
      { item: 'Ground turkey', qty: '1.5 lbs', category: 'protein' },
      { item: 'Bread (sourdough or rye)', qty: '1 loaf', category: 'bakery' },
      { item: 'Swiss cheese', qty: '8 slices', category: 'dairy' },
      { item: 'Onion', qty: '1 large', category: 'produce' },
      { item: 'Canned tomato soup', qty: '2 cans', category: 'pantry' },
      { item: 'Jarred roasted red peppers', qty: '1 jar', category: 'pantry' },
    ],
    pantryStaples: ['Butter', 'Worcestershire sauce', 'Salt', 'Pepper'],
    notes: 'No leftovers for this meal. Caramelize onions for the melts.'
  },
  {
    id: 4,
    name: 'Garlic chili shrimp and cous cous salad',
    category: 'moderate',
    protein: 'shrimp',
    hasLeftovers: false,
    ingredients: [
      { item: 'Shrimp, peeled & deveined', qty: '1.5 lbs', category: 'protein' },
      { item: 'Cous cous', qty: '1 box', category: 'pantry' },
      { item: 'Cucumber', qty: '2', category: 'produce' },
      { item: 'Cherry tomatoes', qty: '1 pint', category: 'produce' },
      { item: 'Red onion', qty: '1', category: 'produce' },
      { item: 'Feta cheese', qty: '6 oz', category: 'dairy' },
      { item: 'Lemon', qty: '2', category: 'produce' },
    ],
    pantryStaples: ['Olive oil', 'Honey', 'Chili flakes', 'Garlic', 'Salt'],
    notes: 'Cook shrimp 2-3 min per side. Make cous cous salad while shrimp cooks.'
  },
  {
    id: 5,
    name: 'Pork egg roll bowls',
    category: 'frequent',
    protein: 'pork',
    hasLeftovers: true,
    ingredients: [
      { item: 'Ground pork', qty: '2 lbs', category: 'protein' },
      { item: 'Broccoli slaw', qty: '2 bags (14 oz each)', category: 'produce' },
      { item: 'Garlic', qty: '6 cloves', category: 'produce' },
      { item: 'Ginger', qty: '2 tbsp fresh', category: 'produce' },
      { item: 'Green onions', qty: '1 bunch', category: 'produce' },
      { item: 'Wonton strips', qty: '1 bag', category: 'pantry' },
    ],
    pantryStaples: ['Sesame oil', 'Soy sauce', 'Rice vinegar', 'Sriracha'],
    notes: 'Cook pork, add slaw, stir fry 5 min. Top with wontons. No actual egg roll wrappers needed.'
  },
  {
    id: 6,
    name: 'Meatloaf',
    category: 'moderate',
    protein: 'beef',
    hasLeftovers: true,
    ingredients: [
      { item: 'Ground beef', qty: '2 lbs', category: 'protein' },
      { item: 'Bread crumbs', qty: '1 cup', category: 'pantry' },
      { item: 'Eggs', qty: '2', category: 'dairy' },
      { item: 'Onion', qty: '1', category: 'produce' },
      { item: 'Ketchup', qty: '1/2 cup', category: 'pantry', pantry: true },
    ],
    pantryStaples: ['Worcestershire sauce', 'Garlic powder', 'Salt', 'Pepper', 'Dried thyme'],
    notes: 'Bake at 375°F for 1 hour. Good for leftovers.'
  },
  {
    id: 7,
    name: 'Thai fish curry',
    category: 'moderate',
    protein: 'fish',
    hasLeftovers: true,
    ingredients: [
      { item: 'White fish (cod/tilapia)', qty: '1.5 lbs', category: 'protein' },
      { item: 'Coconut milk', qty: '2 cans (14 oz)', category: 'pantry' },
      { item: 'Thai red curry paste', qty: '3 tbsp', category: 'pantry' },
      { item: 'Bell peppers', qty: '2', category: 'produce' },
      { item: 'Snow peas', qty: '8 oz', category: 'produce' },
      { item: 'Basil', qty: '1 bunch', category: 'produce' },
      { item: 'Jasmine rice', qty: '2 cups dry', category: 'pantry' },
    ],
    pantryStaples: ['Fish sauce', 'Brown sugar', 'Lime', 'Garlic', 'Ginger'],
    notes: 'Simmer curry 15 min, add fish last 5 min. Serve over rice.'
  },
  {
    id: 8,
    name: 'Hamburger salad',
    category: 'rare',
    protein: 'beef',
    hasLeftovers: false,
    ingredients: [
      { item: 'Ground beef', qty: '1.5 lbs', category: 'protein' },
      { item: 'Iceberg lettuce', qty: '2 heads', category: 'produce' },
      { item: 'Tomatoes', qty: '3', category: 'produce' },
      { item: 'Pickles', qty: '1 jar', category: 'pantry', pantry: true },
      { item: 'Red onion', qty: '1', category: 'produce' },
      { item: 'Cheddar cheese', qty: '8 oz shredded', category: 'dairy' },
      { item: 'Bacon', qty: '8 slices', category: 'protein' },
    ],
    pantryStaples: ['Ketchup', 'Mustard', 'Mayo', 'Salt', 'Pepper'],
    notes: 'Cook burgers, chop toppings. Big Mac vibes without the bun.'
  },
  {
    id: 9,
    name: 'Sausage and kale',
    category: 'frequent',
    protein: 'pork',
    hasLeftovers: false,
    ingredients: [
      { item: 'Italian sausage', qty: '1.5 lbs', category: 'protein' },
      { item: 'Kale', qty: '2 bunches', category: 'produce' },
      { item: 'Navy beans (canned)', qty: '2 cans', category: 'pantry' },
      { item: 'Onion', qty: '1 large', category: 'produce' },
      { item: 'Chicken stock', qty: '4 cups', category: 'pantry' },
      { item: 'Crusty bread', qty: '1 loaf', category: 'bakery' },
    ],
    pantryStaples: ['Olive oil', 'Garlic', 'Red pepper flakes', 'Salt', 'Pepper'],
    notes: 'Brown sausage, add beans, stock, kale. Simmer 20 min.'
  },
  {
    id: 10,
    name: 'Lavash bread pizzas',
    category: 'rare',
    protein: 'varies',
    hasLeftovers: false,
    ingredients: [
      { item: 'Lavash bread', qty: '4 pieces', category: 'bakery' },
      { item: 'Pizza sauce', qty: '1 jar', category: 'pantry' },
      { item: 'Mozzarella cheese', qty: '16 oz', category: 'dairy' },
      { item: 'Pepperoni or toppings', qty: '8 oz', category: 'protein' },
    ],
    pantryStaples: ['Olive oil', 'Italian seasoning', 'Red pepper flakes'],
    notes: 'Deprioritized - make rarely.'
  },
  {
    id: 11,
    name: 'Cottage cheese arrabiata with protein pasta',
    category: 'moderate',
    protein: 'turkey',
    hasLeftovers: true,
    ingredients: [
      { item: 'Ground turkey', qty: '1.5 lbs', category: 'protein' },
      { item: 'Protein pasta', qty: '1 lb', category: 'pantry' },
      { item: 'Marinara sauce', qty: '2 jars', category: 'pantry' },
      { item: 'Cottage cheese', qty: '2 cups', category: 'dairy' },
      { item: 'Zucchini', qty: '3 medium', category: 'produce' },
      { item: 'Parmesan cheese', qty: '1/2 cup', category: 'dairy', pantry: true },
    ],
    pantryStaples: ['Olive oil', 'Garlic', 'Red pepper flakes', 'Salt', 'Basil'],
    notes: 'Spicy tomato sauce with cottage cheese instead of cream.'
  },
  {
    id: 12,
    name: 'Lemon garlic chicken and green beans',
    category: 'frequent',
    protein: 'chicken',
    hasLeftovers: true,
    ingredients: [
      { item: 'Chicken breasts', qty: '3 lbs', category: 'protein' },
      { item: 'Green beans', qty: '2 lbs', category: 'produce' },
      { item: 'Lemon', qty: '3', category: 'produce' },
      { item: 'Garlic', qty: '1 head', category: 'produce' },
      { item: 'Butter', qty: '1/2 cup', category: 'dairy', pantry: true },
    ],
    pantryStaples: ['Olive oil', 'Salt', 'Pepper', 'Dried oregano', 'Chicken broth'],
    notes: 'Pan-sear chicken, make lemon butter sauce in same pan.'
  },
  {
    id: 13,
    name: 'Slow cooker pork with carb and vegetable',
    category: 'frequent',
    protein: 'pork',
    hasLeftovers: true,
    ingredients: [
      { item: 'Pork shoulder/butt', qty: '4 lbs', category: 'protein' },
      { item: 'Baby potatoes', qty: '3 lbs', category: 'produce' },
      { item: 'Carrots', qty: '2 lbs', category: 'produce' },
      { item: 'Onion', qty: '2 large', category: 'produce' },
    ],
    pantryStaples: ['Chicken broth', 'Garlic', 'Paprika', 'Brown sugar', 'Salt', 'Pepper'],
    notes: 'Slow cook on low 8 hours. Pork should shred easily.'
  },
  {
    id: 14,
    name: 'Chicken tortilla soup and bagged salad',
    category: 'moderate',
    protein: 'chicken',
    hasLeftovers: true,
    ingredients: [
      { item: 'Chicken breasts', qty: '2 lbs', category: 'protein' },
      { item: 'Chicken broth', qty: '8 cups', category: 'pantry' },
      { item: 'Black beans (canned)', qty: '2 cans', category: 'pantry' },
      { item: 'Diced tomatoes (canned)', qty: '2 cans', category: 'pantry' },
      { item: 'Corn (frozen or canned)', qty: '2 cups', category: 'pantry' },
      { item: 'Tortilla chips', qty: '1 bag', category: 'pantry' },
      { item: 'Bagged salad', qty: '1 large bag', category: 'produce' },
      { item: 'Avocado', qty: '2', category: 'produce' },
      { item: 'Lime', qty: '3', category: 'produce' },
      { item: 'Cilantro', qty: '1 bunch', category: 'produce' },
    ],
    pantryStaples: ['Cumin', 'Chili powder', 'Garlic', 'Olive oil', 'Salt'],
    notes: 'Simmer soup 30 min. Top with crushed chips, avocado, cilantro.'
  },
  {
    id: 15,
    name: 'Pork chops, potatoes, vegetable',
    category: 'frequent',
    protein: 'pork',
    hasLeftovers: true,
    ingredients: [
      { item: 'Pork chops, bone-in', qty: '6 chops', category: 'protein' },
      { item: 'Russet potatoes', qty: '3 lbs', category: 'produce' },
      { item: 'Vegetable (asparagus/green beans)', qty: '1.5 lbs', category: 'produce' },
    ],
    pantryStaples: ['Olive oil', 'Butter', 'Garlic', 'Salt', 'Pepper', 'Rosemary'],
    notes: 'Pan-sear chops 4 min per side. Roast potatoes at 425°F.'
  },
  {
    id: 16,
    name: 'Pork tenderloin, rice, vegetables',
    category: 'frequent',
    protein: 'pork',
    hasLeftovers: true,
    ingredients: [
      { item: 'Pork tenderloin', qty: '2 lbs', category: 'protein' },
      { item: 'White rice', qty: '2 cups dry', category: 'pantry' },
      { item: 'Vegetable medley', qty: '2 lbs', category: 'produce' },
      { item: 'Dijon mustard', qty: '3 tbsp', category: 'pantry', pantry: true },
    ],
    pantryStaples: ['Olive oil', 'Garlic', 'Soy sauce', 'Honey', 'Salt', 'Pepper'],
    notes: 'Sear tenderloin, finish in oven at 400°F for 15 min.'
  },
  {
    id: 17,
    name: 'Meat stir fry with noodles',
    category: 'frequent',
    protein: 'varies',
    hasLeftovers: true,
    ingredients: [
      { item: 'Protein (beef/chicken/pork)', qty: '2 lbs', category: 'protein' },
      { item: 'Stir fry vegetables (frozen)', qty: '2 bags', category: 'produce' },
      { item: 'Rice noodles or lo mein', qty: '1 lb', category: 'pantry' },
      { item: 'Green onions', qty: '1 bunch', category: 'produce' },
      { item: 'Ginger', qty: '2 tbsp', category: 'produce' },
      { item: 'Garlic', qty: '4 cloves', category: 'produce' },
    ],
    pantryStaples: ['Soy sauce', 'Sesame oil', 'Oyster sauce', 'Cornstarch'],
    notes: 'High heat, quick cook. Toss with sauce at end.'
  },
  {
    id: 18,
    name: 'Steak with carb and vegetable',
    category: 'splurge',
    protein: 'beef',
    hasLeftovers: false,
    ingredients: [
      { item: 'Steak (ribeye/strip)', qty: '2 lbs', category: 'protein', source: "Dad's Store" },
      { item: 'Potatoes or rice', qty: '2 lbs', category: 'produce/pantry' },
      { item: 'Asparagus or green beans', qty: '1.5 lbs', category: 'produce' },
      { item: 'Butter', qty: '4 tbsp', category: 'dairy', pantry: true },
    ],
    pantryStaples: ['Salt', 'Pepper', 'Garlic', 'Rosemary', 'Olive oil'],
    notes: 'Splurge meal - ask Brian before adding. Get steak from Dad\'s Store.'
  },
  {
    id: 19,
    name: 'Lamb chops',
    category: 'splurge',
    protein: 'lamb',
    hasLeftovers: false,
    ingredients: [
      { item: 'Lamb chops', qty: '8 chops', category: 'protein', source: "Dad's Store" },
      { item: 'Potatoes', qty: '2 lbs', category: 'produce' },
      { item: 'Green beans', qty: '1 lb', category: 'produce' },
      { item: 'Mint', qty: '1 bunch', category: 'produce' },
    ],
    pantryStaples: ['Salt', 'Pepper', 'Garlic', 'Olive oil', 'Red wine vinegar'],
    notes: 'Splurge meal - ask Brian before adding. Get lamb from Dad\'s Store.'
  },
  {
    id: 20,
    name: 'Honey garlic pork tenderloin, rice, snap peas',
    category: 'frequent',
    protein: 'pork',
    hasLeftovers: true,
    ingredients: [
      { item: 'Pork tenderloin', qty: '2 lbs', category: 'protein' },
      { item: 'White rice', qty: '2 cups dry', category: 'pantry' },
      { item: 'Snap peas', qty: '1.5 lbs', category: 'produce' },
      { item: 'Honey', qty: '1/4 cup', category: 'pantry', pantry: true },
      { item: 'Garlic', qty: '6 cloves', category: 'produce' },
      { item: 'Soy sauce', qty: '3 tbsp', category: 'pantry', pantry: true },
    ],
    pantryStaples: ['Olive oil', 'Rice vinegar', 'Cornstarch', 'Salt', 'Pepper'],
    notes: 'NEW RECIPE - Sear tenderloin, glaze with honey garlic sauce, finish in oven.'
  },
];

const STAPLES = [
  { item: 'Bananas', qty: '1 bunch', category: 'produce' },
  { item: 'Hummus (garlic/pine nut/caramelized onion/balsamic)', qty: '1 container', category: 'dairy' },
  { item: 'Lactaid 2% milk', qty: '1 gallon', category: 'dairy' },
  { item: 'Fage lactose-free yogurt', qty: '4-6 cups', category: 'dairy' },
  { item: 'Fage 2% yogurt', qty: '4-6 cups', category: 'dairy' },
  { item: 'Stok bold iced coffee', qty: '2 bottles', category: 'beverages' },
  { item: 'Water (gallon jugs)', qty: '3', category: 'beverages' },
  { item: 'Water (2.5 gal fridge dispensers)', qty: '2', category: 'beverages' },
];

export default function Cookbook() {
  const [meals, setMeals] = useState([]);
  const [viewingMeal, setViewingMeal] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('cookbook-v2');
    if (saved) {
      setMeals(JSON.parse(saved));
    } else {
      // First load - save the default recipes
      setMeals(RECIPES);
      localStorage.setItem('cookbook-v2', JSON.stringify(RECIPES));
    }
  }, []);

  const categoryLabels = {
    frequent: '⭐ Frequent',
    moderate: '🔸 Moderate',
    rare: '🔹 Rare',
    splurge: '💎 Splurge'
  };

  const categoryColors = {
    frequent: '#e8f5e9',
    moderate: '#fff3e0',
    rare: '#f5f5f5',
    splurge: '#ffebee'
  };

  if (viewingMeal) {
    const meal = meals.find(m => m.id === viewingMeal);
    if (!meal) return null;

    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
          <button onClick={() => setViewingMeal(null)} style={{
            padding: '8px 16px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}>
            ← Back to Cookbook
          </button>
          <h1>{meal.name}</h1>
          <p style={{ color: '#666' }}>{categoryLabels[meal.category]} • {meal.protein} • {meal.hasLeftovers ? '🍱 Leftovers' : 'No leftovers'}</p>
        </header>

        <Nav />

        <section style={{ marginBottom: '30px' }}>
          <h2>📝 Ingredients</h2>
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
            {meal.ingredients.map((ing, i) => (
              <div key={i} style={{ 
                padding: '10px', 
                borderBottom: i < meal.ingredients.length - 1 ? '1px solid #ddd' : 'none',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{ing.item}</span>
                <span style={{ color: '#666' }}>{ing.qty}</span>
                {ing.source && <span style={{ color: '#2196f3', fontSize: '12px' }}>({ing.source})</span>}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '30px', background: '#fff3e0', padding: '20px', borderRadius: '8px' }}>
          <h2>🫙 Pantry Check</h2>
          <p style={{ marginBottom: '10px' }}>Do you have these staples?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {meal.pantryStaples.map((staple, i) => (
              <span key={i} style={{
                background: 'white',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                {staple}
              </span>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2>👨‍🍳 Instructions</h2>
          <p style={{ lineHeight: '1.6', background: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
            {meal.notes}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>📖 Cookbook</h1>
        <p style={{ color: '#666' }}>Click any meal to see full recipe details</p>
      </header>

      <Nav />

      <div style={{ display: 'grid', gap: '15px' }}>
        {meals.map(meal => (
          <div 
            key={meal.id} 
            onClick={() => setViewingMeal(meal.id)}
            style={{
              background: categoryColors[meal.category] || '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: `4px solid ${meal.category === 'frequent' ? '#4caf50' : meal.category === 'moderate' ? '#ff9800' : meal.category === 'splurge' ? '#f44336' : '#9e9e9e'}`,
              cursor: 'pointer',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{meal.name}</h3>
            <div style={{ fontSize: '14px', color: '#666', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <span>{categoryLabels[meal.category]}</span>
              <span>🥩 {meal.protein}</span>
              <span>{meal.ingredients.length} ingredients</span>
              {meal.hasLeftovers && <span style={{ color: '#4caf50' }}>🍱 Leftovers</span>}
              {meal.source && <span style={{ color: '#2196f3' }}>🏪 {meal.source}</span>}
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ccc', color: '#666', fontSize: '14px' }}>
        <p>Total recipes: {meals.length}</p>
        <p>🚀 Meal planning via text with Roci every Saturday</p>
      </footer>
    </div>
  );
}

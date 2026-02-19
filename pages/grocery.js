import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

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

const HOUSEHOLD = [
  { item: 'Paper towels', needed: true },
  { item: 'Toilet paper', needed: false },
  { item: 'Toothpaste', needed: false },
  { item: 'Contact solution', needed: false },
  { item: 'Laundry detergent', needed: false },
  { item: 'Trash bags', needed: false },
  { item: 'Dish soap', needed: false },
  { item: 'Dishwasher tabs', needed: false },
];

const DADS_STORE = [
  { item: 'Salmon fillet', qty: '~1.5 lbs' },
  { item: 'Apples', qty: '6-8' },
];

export default function Grocery() {
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [cookbook, setCookbook] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const savedPlan = localStorage.getItem('weeklyPlan');
    const savedCookbook = localStorage.getItem('cookbook');
    const savedChecked = localStorage.getItem('groceryChecked');
    const savedCustom = localStorage.getItem('groceryCustom');
    
    if (savedPlan) setWeeklyPlan(JSON.parse(savedPlan));
    if (savedCookbook) setCookbook(JSON.parse(savedCookbook));
    if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
    if (savedCustom) setCustomItems(JSON.parse(savedCustom));
  }, []);

  const toggleChecked = (id) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem('groceryChecked', JSON.stringify(updated));
  };

  const addCustomItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      const updated = [...customItems, { id: Date.now(), name: newItem.trim() }];
      setCustomItems(updated);
      localStorage.setItem('groceryCustom', JSON.stringify(updated));
      setNewItem('');
    }
  };

  const removeCustomItem = (id) => {
    const updated = customItems.filter(item => item.id !== id);
    setCustomItems(updated);
    localStorage.setItem('groceryCustom', JSON.stringify(updated));
  };

  const generateGroceryList = () => {
    const proteins = [];
    const produce = ['Mini potatoes', 'Green beans', 'Broccoli', 'Broccoli slaw', 'Snap peas', 'Kale', 'Yellow onions', 'Garlic', 'Fresh ginger'];
    const pantry = ['Far East cous cous (garlic/pine nut/chicken flavored)', 'White rice', 'Wonton salad toppers'];
    
    weeklyPlan.forEach(day => {
      if (day.meal) {
        const name = day.meal.name.toLowerCase();
        if (name.includes('chicken')) proteins.push({ name: 'Chicken', meal: day.meal.name, qty: day.meal.hasLeftovers ? '3-4 lbs (extra for leftovers)' : '2-3 lbs' });
        else if (name.includes('pork')) proteins.push({ name: 'Pork', meal: day.meal.name, qty: day.meal.hasLeftovers ? '2.5-3 lbs (extra for leftovers)' : '2 lbs' });
        else if (name.includes('beef')) proteins.push({ name: 'Beef', meal: day.meal.name, qty: '2 lbs' });
        else if (name.includes('salmon')) proteins.push({ name: 'Salmon', meal: day.meal.name, qty: '1.5 lbs (from Dad\'s Store)' });
        else if (name.includes('turkey')) proteins.push({ name: 'Turkey', meal: day.meal.name, qty: '2 lbs' });
        else if (name.includes('shrimp')) proteins.push({ name: 'Shrimp', meal: day.meal.name, qty: '1.5 lbs' });
        else if (name.includes('meatloaf')) proteins.push({ name: 'Ground beef', meal: day.meal.name, qty: '2 lbs' });
      }
    });
    
    // Remove duplicates and consolidate
    const uniqueProteins = [];
    proteins.forEach(p => {
      const existing = uniqueProteins.find(up => up.name === p.name);
      if (!existing) {
        uniqueProteins.push(p);
      }
    });
    
    return { proteins: uniqueProteins, produce, pantry };
  };

  const grocery = generateGroceryList();
  const estimatedCost = grocery.proteins.length * 15 + 40; // Rough estimate

  const checkboxStyle = (checked) => ({
    textDecoration: checked ? 'line-through' : 'none',
    color: checked ? '#999' : 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    background: checked ? '#f5f5f5' : 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>🛒 Grocery List</h1>
        <p style={{ color: '#666' }}>Week of {new Date().toLocaleDateString()} • Based on your meal plan</p>
      </header>

      <Nav />

      <div style={{ 
        background: '#e8f5e9', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>💰 Estimated Total: ${estimatedCost}-${estimatedCost + 30}</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            {grocery.proteins.length} proteins • {STAPLES.length} staples • Cross off items as you shop
          </p>
        </div>
        <button 
          onClick={() => {
            setCheckedItems({});
            localStorage.setItem('groceryChecked', JSON.stringify({}));
          }}
          style={{
            padding: '8px 16px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Reset All
        </button>
      </div>

      <section style={{ marginBottom: '30px' }}>
        <h2>🥩 Proteins (Organic when available)</h2>
        <div style={{ display: 'grid', gap: '5px' }}>
          {grocery.proteins.map((p, i) => (
            <label key={i} style={checkboxStyle(checkedItems[`protein-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`protein-${i}`] || false}
                onChange={() => toggleChecked(`protein-${i}`)}
              />
              <span>
                <strong>{p.name}</strong> — {p.qty}
                <span style={{ color: '#666', fontSize: '12px', marginLeft: '10px' }}>(for {p.meal})</span>
              </span>
            </label>
          ))}
          {grocery.proteins.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No proteins needed this week</p>}
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>🥬 Produce</h2>
        <div style={{ display: 'grid', gap: '5px' }}>
          {grocery.produce.map((p, i) => (
            <label key={i} style={checkboxStyle(checkedItems[`produce-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`produce-${i}`] || false}
                onChange={() => toggleChecked(`produce-${i}`)}
              />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>🥫 Pantry</h2>
        <div style={{ display: 'grid', gap: '5px' }}>
          {grocery.pantry.map((p, i) => (
            <label key={i} style={checkboxStyle(checkedItems[`pantry-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`pantry-${i}`] || false}
                onChange={() => toggleChecked(`pantry-${i}`)}
              />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px', background: '#fff3e0', padding: '20px', borderRadius: '8px' }}>
        <h2>📦 Weekly Staples</h2>
        <div style={{ display: 'grid', gap: '5px' }}>
          {STAPLES.map((s, i) => (
            <label key={i} style={checkboxStyle(checkedItems[`staple-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`staple-${i}`] || false}
                onChange={() => toggleChecked(`staple-${i}`)}
              />
              <span><strong>{s.item}</strong> — {s.qty}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px', background: '#ffebee', padding: '20px', borderRadius: '8px' }}>
        <h2>🏠 Household</h2>
        <div style={{ display: 'grid', gap: '5px' }}>
          {HOUSEHOLD.map((h, i) => (
            <label key={i} style={checkboxStyle(checkedItems[`household-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`household-${i}`] || false}
                onChange={() => toggleChecked(`household-${i}`)}
              />
              <span>
                {h.item}
                {h.needed && <strong style={{ color: '#d32f2f', marginLeft: '10px' }}>— NEEDED</strong>}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px', background: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
        <h2>🏪 Dad's Store (Market of Lafayette Hill)</h2>
        <div style={{ display: 'grid', gap: '5px' }}>
          {DADS_STORE.map((d, i) => (
            <label key={i} style={checkboxStyle(checkedItems[`dads-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`dads-${i}`] || false}
                onChange={() => toggleChecked(`dads-${i}`)}
              />
              <span><strong>{d.item}</strong> — {d.qty}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px', background: '#f3e5f5', padding: '20px', borderRadius: '8px' }}>
        <h2>➕ Custom Items</h2>
        <form onSubmit={addCustomItem} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add something else..."
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{
            padding: '10px 20px',
            background: '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Add
          </button>
        </form>
        <div style={{ display: 'grid', gap: '5px' }}>
          {customItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'white', borderRadius: '4px' }}>
              <label style={checkboxStyle(checkedItems[`custom-${item.id}`])}>
                <input 
                  type="checkbox" 
                  checked={checkedItems[`custom-${item.id}`] || false}
                  onChange={() => toggleChecked(`custom-${item.id}`)}
                />
                <span>{item.name}</span>
              </label>
              <button 
                onClick={() => removeCustomItem(item.id)}
                style={{
                  padding: '4px 8px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {customItems.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No custom items yet</p>}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', color: '#666', fontSize: '14px' }}>
        <p>Check off items as you shop. Progress saves automatically.</p>
        <p>🚀 Generated by Roci • Updated based on your meal plan</p>
      </footer>
    </div>
  );
}

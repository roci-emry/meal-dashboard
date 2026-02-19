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

const DADS_STORE = [
  { item: 'Salmon fillet', qty: '~1.5 lbs' },
  { item: 'Apples', qty: '6-8' },
];

const HOUSEHOLD_OPTIONS = [
  'Paper towels',
  'Toilet paper', 
  'Toothpaste',
  'Contact solution',
  'Laundry detergent',
  'Trash bags',
  'Dish soap',
  'Dishwasher tabs',
  'Hand soap',
  'Batteries',
];

export default function Grocery() {
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [cookbook, setCookbook] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [addedPantry, setAddedPantry] = useState([]);
  const [addedHousehold, setAddedHousehold] = useState([]);

  useEffect(() => {
    const savedPlan = localStorage.getItem('weeklyPlan');
    const savedCookbook = localStorage.getItem('cookbook-v2');
    const savedChecked = localStorage.getItem('groceryChecked');
    const savedCustom = localStorage.getItem('groceryCustom');
    const savedPantry = localStorage.getItem('addedPantry');
    const savedHousehold = localStorage.getItem('addedHousehold');
    
    if (savedPlan) setWeeklyPlan(JSON.parse(savedPlan));
    if (savedCookbook) setCookbook(JSON.parse(savedCookbook));
    if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
    if (savedCustom) setCustomItems(JSON.parse(savedCustom));
    if (savedPantry) setAddedPantry(JSON.parse(savedPantry));
    if (savedHousehold) setAddedHousehold(JSON.parse(savedHousehold));
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

  const addPantryItem = (item) => {
    if (!addedPantry.includes(item)) {
      const updated = [...addedPantry, item];
      setAddedPantry(updated);
      localStorage.setItem('addedPantry', JSON.stringify(updated));
    }
  };

  const removePantryItem = (item) => {
    const updated = addedPantry.filter(i => i !== item);
    setAddedPantry(updated);
    localStorage.setItem('addedPantry', JSON.stringify(updated));
  };

  const addHouseholdItem = (item) => {
    if (!addedHousehold.includes(item)) {
      const updated = [...addedHousehold, item];
      setAddedHousehold(updated);
      localStorage.setItem('addedHousehold', JSON.stringify(updated));
    }
  };

  const removeHouseholdItem = (item) => {
    const updated = addedHousehold.filter(i => i !== item);
    setAddedHousehold(updated);
    localStorage.setItem('addedHousehold', JSON.stringify(updated));
  };

  const clearAllAdded = () => {
    setAddedPantry([]);
    setAddedHousehold([]);
    localStorage.setItem('addedPantry', JSON.stringify([]));
    localStorage.setItem('addedHousehold', JSON.stringify([]));
  };

  // Aggregate ingredients from weekly plan recipes
  const generateGroceryList = () => {
    const ingredients = [];
    const pantryStaples = new Set();
    
    weeklyPlan.forEach(day => {
      if (day.meal) {
        const recipe = cookbook.find(r => r.id === day.meal.id);
        if (recipe) {
          recipe.ingredients.forEach(ing => {
            if (!ing.pantry) {
              ingredients.push({
                ...ing,
                meal: recipe.name
              });
            }
          });
          
          recipe.pantryStaples.forEach(staple => pantryStaples.add(staple));
        }
      }
    });
    
    const grouped = {
      protein: ingredients.filter(i => i.category === 'protein'),
      produce: ingredients.filter(i => i.category === 'produce'),
      dairy: ingredients.filter(i => i.category === 'dairy'),
      pantry: ingredients.filter(i => i.category === 'pantry' && !i.pantry),
      bakery: ingredients.filter(i => i.category === 'bakery'),
    };
    
    return { grouped, pantryStaples: Array.from(pantryStaples) };
  };

  const { grouped, pantryStaples } = generateGroceryList();
  
  const mainItemCount = Object.values(grouped).flat().length + STAPLES.length + DADS_STORE.length;
  const addedItemCount = addedPantry.length + addedHousehold.length + customItems.length;
  const totalItems = mainItemCount + addedItemCount;

  const checkboxStyle = (checked) => ({
    textDecoration: checked ? 'line-through' : 'none',
    color: checked ? '#999' : 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    background: checked ? '#f5f5f5' : 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
  });

  const sectionStyle = {
    marginBottom: '30px',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const renderIngredientGroup = (title, items, color) => {
    if (items.length === 0) return null;
    return (
      <section style={{ ...sectionStyle, borderLeft: `4px solid ${color}` }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <div>
          {items.map((item, i) => (
            <label key={`${title}-${i}`} style={checkboxStyle(checkedItems[`${title}-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`${title}-${i}`] || false}
                onChange={() => toggleChecked(`${title}-${i}`)}
              />
              <span style={{ flex: 1 }}>
                <strong>{item.item}</strong>
                {item.source && <span style={{ color: '#2196f3', fontSize: '12px', marginLeft: '8px' }}>({item.source})</span>}
              </span>
              <span style={{ color: '#666', fontSize: '14px' }}>{item.qty}</span>
            </label>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>🛒 Grocery List</h1>
        <p style={{ color: '#666' }}>Based on your meal plan • Cross off as you shop</p>
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
          <strong>{totalItems} items total</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            {mainItemCount} from meal plan • {addedItemCount} added extras
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
          Reset Checks
        </button>
      </div>

      {weeklyPlan.length === 0 ? (
        <div style={{ 
          background: '#fff3e0', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <p>No meal plan yet! Grocery list will populate after Saturday planning.</p>
        </div>
      ) : (
        <>
          {renderIngredientGroup('🥩 Proteins', grouped.protein, '#f44336')}
          {renderIngredientGroup('🥬 Produce', grouped.produce, '#4caf50')}
          {renderIngredientGroup('🥛 Dairy', grouped.dairy, '#2196f3')}
          {renderIngredientGroup('🥫 Pantry', grouped.pantry, '#ff9800')}
          {renderIngredientGroup('🍞 Bakery', grouped.bakery, '#795548')}
        </>
      )}

      <section style={{ ...sectionStyle, borderLeft: '4px solid #9c27b0' }}>
        <h2 style={{ marginTop: 0 }}>📦 Weekly Staples</h2>
        <div>
          {STAPLES.map((s, i) => (
            <label key={`staple-${i}`} style={checkboxStyle(checkedItems[`staple-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`staple-${i}`] || false}
                onChange={() => toggleChecked(`staple-${i}`)}
              />
              <span style={{ flex: 1 }}><strong>{s.item}</strong></span>
              <span style={{ color: '#666', fontSize: '14px' }}>{s.qty}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ ...sectionStyle, borderLeft: '4px solid #00bcd4' }}>
        <h2 style={{ marginTop: 0 }}>🏪 Dad's Store (Market of Lafayette Hill)</h2>
        <div>
          {DADS_STORE.map((d, i) => (
            <label key={`dads-${i}`} style={checkboxStyle(checkedItems[`dads-${i}`])}>
              <input 
                type="checkbox" 
                checked={checkedItems[`dads-${i}`] || false}
                onChange={() => toggleChecked(`dads-${i}`)}
              />
              <span style={{ flex: 1 }}><strong>{d.item}</strong></span>
              <span style={{ color: '#666', fontSize: '14px' }}>{d.qty}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Added Pantry Items */}
      {addedPantry.length > 0 && (
        <section style={{ ...sectionStyle, borderLeft: '4px solid #607d8b' }}>
          <h2 style={{ marginTop: 0 }}>🫙 Added Pantry Items</h2>
          <p style={{ marginTop: 0, color: '#666', fontSize: '14px' }}>
            Clicked from "Pantry Staples Check" section below
          </p>
          <div>
            {addedPantry.map((item, i) => (
              <div key={`added-pantry-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                <label style={{ ...checkboxStyle(checkedItems[`added-pantry-${i}`]), flex: 1, borderBottom: 'none' }}>
                  <input 
                    type="checkbox" 
                    checked={checkedItems[`added-pantry-${i}`] || false}
                    onChange={() => toggleChecked(`added-pantry-${i}`)}
                  />
                  <span>{item}</span>
                </label>
                <button 
                  onClick={() => removePantryItem(item)}
                  style={{
                    padding: '4px 10px',
                    background: '#999',
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
          </div>
        </section>
      )}

      {/* Added Household Items */}
      {addedHousehold.length > 0 && (
        <section style={{ ...sectionStyle, borderLeft: '4px solid #ff5722', background: '#fff3e0' }}>
          <h2 style={{ marginTop: 0 }}>🏠 Added Household Items</h2>
          <p style={{ marginTop: 0, color: '#666', fontSize: '14px' }}>
            Clicked from "Household Items" section below
          </p>
          <div>
            {addedHousehold.map((item, i) => (
              <div key={`added-house-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                <label style={{ ...checkboxStyle(checkedItems[`added-house-${i}`]), flex: 1, borderBottom: 'none' }}>
                  <input 
                    type="checkbox" 
                    checked={checkedItems[`added-house-${i}`] || false}
                    onChange={() => toggleChecked(`added-house-${i}`)}
                  />
                  <span><strong>{item}</strong></span>
                </label>
                <button 
                  onClick={() => removeHouseholdItem(item)}
                  style={{
                    padding: '4px 10px',
                    background: '#999',
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
          </div>
        </section>
      )}

      {/* Pantry Staples Check - Clickable */}
      {pantryStaples.length > 0 && (
        <section style={{ ...sectionStyle, borderLeft: '4px solid #795548', background: '#fafafa' }}>
          <h2 style={{ marginTop: 0 }}>🫙 Pantry Staples Check</h2>
          <p style={{ marginTop: 0, color: '#666', fontSize: '14px' }}>
            Need any of these? Click to add to your list:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {pantryStaples.map((staple, i) => (
              <button
                key={i}
                onClick={() => addPantryItem(staple)}
                disabled={addedPantry.includes(staple)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  border: '2px solid #795548',
                  background: addedPantry.includes(staple) ? '#795548' : 'white',
                  color: addedPantry.includes(staple) ? 'white' : '#795548',
                  cursor: addedPantry.includes(staple) ? 'default' : 'pointer',
                  opacity: addedPantry.includes(staple) ? 0.6 : 1,
                }}
              >
                {addedPantry.includes(staple) ? '✓ ' : '+ '}{staple}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Household Items - Clickable */}
      <section style={{ ...sectionStyle, borderLeft: '4px solid #ff5722', background: '#fafafa' }}>
        <h2 style={{ marginTop: 0 }}>🏠 Household Items</h2>
        <p style={{ marginTop: 0, color: '#666', fontSize: '14px' }}>
          Need any of these? Click to add to your list:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {HOUSEHOLD_OPTIONS.map((item, i) => (
            <button
              key={i}
              onClick={() => addHouseholdItem(item)}
              disabled={addedHousehold.includes(item)}
              style={{
                padding: '10px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                border: '2px solid #ff5722',
                background: addedHousehold.includes(item) ? '#ff5722' : 'white',
                color: addedHousehold.includes(item) ? 'white' : '#ff5722',
                cursor: addedHousehold.includes(item) ? 'default' : 'pointer',
                opacity: addedHousehold.includes(item) ? 0.6 : 1,
              }}
            >
              {addedHousehold.includes(item) ? '✓ ' : '+ '}{item}
            </button>
          ))}
        </div>
      </section>

      {/* Custom Items */}
      <section style={{ ...sectionStyle, borderLeft: '4px solid #8bc34a' }}>
        <h2 style={{ marginTop: 0 }}>➕ Custom Items</h2>
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
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Add
          </button>
        </form>
        <div>
          {customItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'white', borderRadius: '4px', marginBottom: '5px' }}>
              <label style={{ ...checkboxStyle(checkedItems[`custom-${item.id}`]), flex: 1, borderBottom: 'none' }}>
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
                  padding: '4px 10px',
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

      {/* Clear All Added */}
      {(addedPantry.length > 0 || addedHousehold.length > 0) && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            onClick={clearAllAdded}
            style={{
              padding: '10px 20px',
              background: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All Added Items
          </button>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', color: '#666', fontSize: '14px' }}>
        <p>Check off items as you shop. Progress saves automatically.</p>
        <p>🚀 Generated by Roci • Based on your weekly meal plan</p>
      </footer>
    </div>
  );
}

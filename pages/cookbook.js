import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

const defaultMeals = [
  { id: 1, name: 'Chicken thighs, smashed potatoes, vegetable', category: 'frequent', protein: 'chicken', hasLeftovers: true, notes: 'Cook extra thighs for leftovers' },
  { id: 2, name: 'Salmon, cous cous, vegetable', category: 'moderate', protein: 'fish', hasLeftovers: false, notes: 'Get salmon from Dad\'s store' },
  { id: 3, name: 'Turkey patty melts and red pepper tomato soup', category: 'moderate', protein: 'turkey', hasLeftovers: false, notes: 'No leftovers' },
  { id: 4, name: 'Garlic chili shrimp and cous cous salad', category: 'moderate', protein: 'shrimp', hasLeftovers: false, notes: '' },
  { id: 5, name: 'Pork egg roll bowls', category: 'frequent', protein: 'pork', hasLeftovers: true, notes: 'Use broccoli slaw, not wrappers' },
  { id: 6, name: 'Meatloaf', category: 'moderate', protein: 'beef', hasLeftovers: true, notes: '' },
  { id: 7, name: 'Thai fish curry', category: 'moderate', protein: 'fish', hasLeftovers: true, notes: '' },
  { id: 8, name: 'Hamburger salad', category: 'rare', protein: 'beef', hasLeftovers: false, notes: '' },
  { id: 9, name: 'Sausage and kale', category: 'frequent', protein: 'pork', hasLeftovers: false, notes: '' },
  { id: 10, name: 'Lavash bread pizzas', category: 'rare', protein: 'varies', hasLeftovers: false, notes: 'Deprioritized' },
  { id: 11, name: 'Cottage cheese arrabiata with protein pasta, turkey meatballs, zucchini noodles', category: 'moderate', protein: 'turkey', hasLeftovers: true, notes: '' },
  { id: 12, name: 'Lemon garlic chicken and green beans', category: 'frequent', protein: 'chicken', hasLeftovers: true, notes: '' },
  { id: 13, name: 'Slow cooker pork with carb and vegetable', category: 'frequent', protein: 'pork', hasLeftovers: true, notes: '' },
  { id: 14, name: 'Chicken tortilla soup and bagged salad', category: 'moderate', protein: 'chicken', hasLeftovers: true, notes: '' },
  { id: 15, name: 'Pork chops, potatoes, vegetable', category: 'frequent', protein: 'pork', hasLeftovers: true, notes: '' },
  { id: 16, name: 'Pork tenderloin, rice, vegetables', category: 'frequent', protein: 'pork', hasLeftovers: true, notes: '' },
  { id: 17, name: 'Meat stir fry with noodles', category: 'frequent', protein: 'varies', hasLeftovers: true, notes: '' },
  { id: 18, name: 'Steak with carb and vegetable', category: 'splurge', protein: 'beef', hasLeftovers: false, notes: 'Ask before adding' },
  { id: 19, name: 'Lamb chops', category: 'splurge', protein: 'lamb', hasLeftovers: false, notes: 'Ask before adding' },
];

export default function Cookbook() {
  const [meals, setMeals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'frequent',
    protein: 'chicken',
    hasLeftovers: false,
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('cookbook');
    if (saved) {
      setMeals(JSON.parse(saved));
    } else {
      setMeals(defaultMeals);
      localStorage.setItem('cookbook', JSON.stringify(defaultMeals));
    }
  }, []);

  const saveMeals = (newMeals) => {
    setMeals(newMeals);
    localStorage.setItem('cookbook', JSON.stringify(newMeals));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      const updated = meals.map(m => m.id === editing ? { ...formData, id: editing } : m);
      saveMeals(updated);
      setEditing(null);
    } else {
      const newMeal = { ...formData, id: Date.now() };
      saveMeals([...meals, newMeal]);
    }
    setFormData({ name: '', category: 'frequent', protein: 'chicken', hasLeftovers: false, notes: '' });
    setShowForm(false);
  };

  const handleEdit = (meal) => {
    setFormData(meal);
    setEditing(meal.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this meal?')) {
      saveMeals(meals.filter(m => m.id !== id));
    }
  };

  const filteredMeals = filter === 'all' ? meals : meals.filter(m => m.category === filter);

  const categoryColors = {
    frequent: '#e8f5e9',
    moderate: '#fff3e0',
    rare: '#f5f5f5',
    splurge: '#ffebee'
  };

  const categoryLabels = {
    frequent: '⭐ Frequent',
    moderate: '🔸 Moderate',
    rare: '🔹 Rare',
    splurge: '💎 Splurge'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>📖 Cookbook</h1>
        <p style={{ color: '#666' }}>Manage your meal rotation</p>
      </header>

      <Nav />

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px',
          background: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          {showForm ? 'Cancel' : '+ Add New Meal'}
        </button>

        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}>
          <option value="all">All Meals</option>
          <option value="frequent">Frequent</option>
          <option value="moderate">Moderate</option>
          <option value="rare">Rare</option>
          <option value="splurge">Splurge</option>
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>{editing ? 'Edit Meal' : 'Add New Meal'}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Meal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="e.g., Lemon garlic chicken and green beans"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="frequent">Frequent (weekly)</option>
              <option value="moderate">Moderate (bi-weekly)</option>
              <option value="rare">Rare (monthly)</option>
              <option value="splurge">Splurge (ask first)</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Protein</label>
            <select
              value={formData.protein}
              onChange={(e) => setFormData({...formData, protein: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="chicken">Chicken</option>
              <option value="pork">Pork</option>
              <option value="beef">Beef</option>
              <option value="fish">Fish</option>
              <option value="turkey">Turkey</option>
              <option value="shrimp">Shrimp</option>
              <option value="varies">Varies</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.hasLeftovers}
                onChange={(e) => setFormData({...formData, hasLeftovers: e.target.checked})}
              />
              <span>Good for leftovers</span>
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="e.g., Get salmon from Dad's store, cook extra portions"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{
              padding: '10px 20px',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              {editing ? 'Update Meal' : 'Add Meal'}
            </button>
            {editing && (
              <button type="button" onClick={() => {
                setEditing(null);
                setShowForm(false);
                setFormData({ name: '', category: 'frequent', protein: 'chicken', hasLeftovers: false, notes: '' });
              }} style={{
                padding: '10px 20px',
                background: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredMeals.map(meal => (
          <div key={meal.id} style={{
            background: categoryColors[meal.category] || '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            borderLeft: `4px solid ${meal.category === 'frequent' ? '#4caf50' : meal.category === 'moderate' ? '#ff9800' : meal.category === 'splurge' ? '#f44336' : '#9e9e9e'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{meal.name}</h3>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  <span style={{ marginRight: '15px' }}>{categoryLabels[meal.category]}</span>
                  <span style={{ marginRight: '15px' }}>🥩 {meal.protein}</span>
                  {meal.hasLeftovers && <span>🍱 Leftovers</span>}
                </div>
                {meal.notes && <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#555' }}>{meal.notes}</p>}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => handleEdit(meal)} style={{
                  padding: '5px 10px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(meal.id)} style={{
                  padding: '5px 10px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ccc', color: '#666', fontSize: '14px' }}>
        <p>Total meals: {meals.length} • {meals.filter(m => m.category === 'frequent').length} frequent • {meals.filter(m => m.hasLeftovers).length} with leftovers</p>
        <p>🚀 Generated by Roci</p>
      </footer>
    </div>
  );
}

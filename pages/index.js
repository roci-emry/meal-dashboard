import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [showPlanBuilder, setShowPlanBuilder] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookbook');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMeals(parsed);
      
      // Generate default weekly plan from frequent meals
      const frequent = parsed.filter(m => m.category === 'frequent');
      const moderate = parsed.filter(m => m.category === 'moderate');
      
      const defaultPlan = [
        { day: 'Sunday', meal: frequent[0] || moderate[0], custom: false },
        { day: 'Monday', meal: moderate[0] || frequent[1], custom: false },
        { day: 'Tuesday', meal: frequent[1] || moderate[1], custom: false },
        { day: 'Wednesday', meal: frequent[2] || moderate[2], custom: false },
        { day: 'Thursday', meal: frequent[3] || moderate[3], custom: false },
        { day: 'Friday', meal: frequent[4] || moderate[4], custom: false },
      ];
      setWeeklyPlan(defaultPlan);
    }
  }, []);

  const regeneratePlan = () => {
    const frequent = meals.filter(m => m.category === 'frequent');
    const moderate = meals.filter(m => m.category === 'moderate');
    
    // Shuffle and pick
    const shuffled = [...frequent].sort(() => 0.5 - Math.random());
    const newPlan = [
      { day: 'Sunday', meal: shuffled[0] || moderate[0], custom: false },
      { day: 'Monday', meal: moderate[0] || shuffled[1], custom: false },
      { day: 'Tuesday', meal: shuffled[1] || moderate[1], custom: false },
      { day: 'Wednesday', meal: shuffled[2] || moderate[2], custom: false },
      { day: 'Thursday', meal: shuffled[3] || moderate[3], custom: false },
      { day: 'Friday', meal: shuffled[4] || moderate[4], custom: false },
    ];
    setWeeklyPlan(newPlan);
  };

  const updateDay = (index, mealId) => {
    const meal = meals.find(m => m.id === parseInt(mealId));
    const updated = [...weeklyPlan];
    updated[index].meal = meal;
    updated[index].custom = true;
    setWeeklyPlan(updated);
  };

  const getGroceryList = () => {
    const proteins = [];
    const produce = ['Mini potatoes', 'Green beans', 'Broccoli', 'Broccoli slaw', 'Snap peas', 'Kale', 'Onions', 'Garlic', 'Ginger'];
    const pantry = ['Far East cous cous', 'White rice', 'Wonton toppers'];
    
    weeklyPlan.forEach(day => {
      if (day.meal) {
        // Estimate protein needs based on meal name
        if (day.meal.name.includes('chicken')) proteins.push('Chicken');
        else if (day.meal.name.includes('pork')) proteins.push('Pork');
        else if (day.meal.name.includes('beef')) proteins.push('Beef');
        else if (day.meal.name.includes('salmon')) proteins.push('Salmon');
        else if (day.meal.name.includes('turkey')) proteins.push('Turkey');
        else if (day.meal.name.includes('shrimp')) proteins.push('Shrimp');
      }
    });
    
    return { proteins: [...new Set(proteins)], produce, pantry };
  };

  const grocery = getGroceryList();
  const leftoversCount = weeklyPlan.filter(d => d.meal?.hasLeftovers).length;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>🍽️ Weekly Meal Plan</h1>
        <p style={{ color: '#666' }}>Week of {new Date().toLocaleDateString()} • Brian & Gianna</p>
      </header>

      <Nav />

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={regeneratePlan} style={{
          padding: '10px 20px',
          background: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          🎲 Generate New Plan
        </button>
        <button onClick={() => setShowPlanBuilder(!showPlanBuilder)} style={{
          padding: '10px 20px',
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          {showPlanBuilder ? 'Done Editing' : '✏️ Edit Plan'}
        </button>
      </div>

      <section style={{ marginBottom: '30px' }}>
        <div style={{ 
          background: '#e3f2fd', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>📊 Plan Summary</strong>
            <p style={{ margin: '5px 0 0 0' }}>
              {leftoversCount} meals with leftovers • {grocery.proteins.length} proteins needed
            </p>
          </div>
          <div style={{ fontSize: '24px' }}>
            {leftoversCount >= 4 ? '✅' : '⚠️'}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {weeklyPlan.map((day, i) => (
            <div key={day.day} style={{ 
              padding: '15px', 
              background: day.meal?.hasLeftovers ? '#e8f5e9' : '#f5f5f5',
              borderRadius: '8px',
              borderLeft: day.meal?.hasLeftovers ? '4px solid #4caf50' : '4px solid #ccc'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{day.day}</strong>
                {day.custom && <span style={{ fontSize: '12px', color: '#2196f3' }}>custom</span>}
              </div>
              
              {showPlanBuilder ? (
                <select 
                  value={day.meal?.id || ''} 
                  onChange={(e) => updateDay(i, e.target.value)}
                  style={{ width: '100%', marginTop: '10px', padding: '8px' }}
                >
                  <option value="">Select a meal...</option>
                  <optgroup label="Frequent">
                    {meals.filter(m => m.category === 'frequent').map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Moderate">
                    {meals.filter(m => m.category === 'moderate').map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Rare/Splurge">
                    {meals.filter(m => m.category === 'rare' || m.category === 'splurge').map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </optgroup>
                </select>
              ) : (
                <>
                  <p style={{ margin: '5px 0' }}>{day.meal?.name || 'No meal selected'}</p>
                  {day.meal?.hasLeftovers && (
                    <span style={{ fontSize: '12px', color: '#4caf50' }}>🍱 Leftovers for lunch</span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>🛒 Grocery Preview</h2>
        
        <h3>Proteins Needed</h3>
        <ul>
          {grocery.proteins.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        <h3>Standard Produce</h3>
        <ul>
          {grocery.produce.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </section>

      <section style={{ marginBottom: '30px', background: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
        <h2>📦 Weekly Staples</h2>
        <ul>
          <li>Bananas — 1 bunch</li>
          <li>Hummus (garlic/pine nut) — 1 container</li>
          <li>Lactaid 2% milk — 1 gallon</li>
          <li>Fage yogurt — 8 cups</li>
          <li>Stok bold iced coffee — 2 bottles</li>
          <li>Water (gallon jugs) — 3</li>
          <li>Water (2.5gal fridge) — 2</li>
          <li><strong>Paper towels — NEEDED</strong></li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px', background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h2>🏪 Dad's Store (Market of Lafayette Hill)</h2>
        <ul>
          <li>Salmon fillet — ~1.5 lbs</li>
          <li>Apples — 6-8</li>
        </ul>
      </section>

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', color: '#666', fontSize: '14px' }}>
        <p>💰 Estimated: ~$85-95 (Giant) + ~$25-35 (Dad's)</p>
        <p>🚀 Generated by Roci • Saturday 8:30 AM</p>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [showPlanBuilder, setShowPlanBuilder] = useState(false);

  useEffect(() => {
    const savedCookbook = localStorage.getItem('cookbook');
    const savedPlan = localStorage.getItem('weeklyPlan');
    
    if (savedCookbook) {
      const parsed = JSON.parse(savedCookbook);
      setMeals(parsed);
      
      // Check for existing plan first
      if (savedPlan) {
        setWeeklyPlan(JSON.parse(savedPlan));
      } else {
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
        localStorage.setItem('weeklyPlan', JSON.stringify(defaultPlan));
      }
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
    localStorage.setItem('weeklyPlan', JSON.stringify(newPlan));
  };

  const updateDay = (index, mealId) => {
    const meal = meals.find(m => m.id === parseInt(mealId));
    const updated = [...weeklyPlan];
    updated[index].meal = meal;
    updated[index].custom = true;
    setWeeklyPlan(updated);
    localStorage.setItem('weeklyPlan', JSON.stringify(updated));
  };

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
              {leftoversCount} meals with leftovers
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

      <div style={{ 
        background: '#e8f5e9', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
          🛒 Ready to shop? View your full grocery list:
        </p>
        <a 
          href="/grocery" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#4caf50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Open Grocery List →
        </a>
      </div>

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '30px', color: '#666', fontSize: '14px' }}>
        <p>🚀 Generated by Roci • Updates saved automatically</p>
      </footer>
    </div>
  );
}

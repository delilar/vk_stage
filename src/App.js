import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [catFact, setCatFact] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [fetchController, setFetchController] = useState(null);

  useEffect(() => {
    return () => {
      if (fetchController) {
        fetchController.abort();
      }
    };
  }, [fetchController]);

  const getCatFact = async () => {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data = await response.json();
      setCatFact(data.fact);
    } catch (error) {
      console.error('Ошибка при подключении фактов:', error);
    }
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    if (/^[a-zA-Z]*$/.test(value) || value === '') {
      setName(value);
      setTimeout(() => {
        handleSubmit(event);
      }, 3000);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name.trim() === '') {
      return;
    }

    if (fetchController) {
      fetchController.abort();
    }

    const newController = new AbortController();
    setFetchController(newController);

    try {
      const response = await fetch(`https://api.agify.io/?name=${name}`, {
        signal: newController.signal,
      });
      const data = await response.json();
      setAge(data.age);
    } catch (error) {
      console.error('Ошибка при подключении возраста:', error);
    }
  };

  return (
    <div className="App">
      <div>
        <textarea
          type="text"
          value={catFact}
          readOnly
          placeholder="Факты о котах"
          onClick={getCatFact}
        />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Введите своё имя (латиница)"
          />
          <button type="submit">Submit</button>
        </form>
        <div>{`Возраст для ${name}: ${age}`}</div>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';

function Checklist() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1', checked: false },
    { id: 2, text: 'Item 2', checked: false },
    { id: 3, text: 'Item 3', checked: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (itemId) => {
    // Map over the items and toggle the checked status for the matching item.
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    setItems(updatedItems);
    setSelectAll(updatedItems.every((item) => item.checked));
  };

  const handleSelectAll = () => {
    const toggleAll = !selectAll;
    const updatedItems = items.map((item) => ({ ...item, checked: toggleAll }));
    setItems(updatedItems);
    setSelectAll(toggleAll);
  };

  return (
    <div>
      <h2>Checklist</h2>
      <button onClick={handleSelectAll}>
        {selectAll ? 'Uncheck All' : 'Check All'}
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckboxChange(item.id)}
              />
              {item.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Checklist;
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './item.css';
import myImage2 from './images/monkey.jpeg';
import DeleteIconSVG from './DeleteIcon'
import PosterEditor from './PosterEditor'; // Import the PosterEditor component
import TshirtEditor from './TshirtEditor'; // Import the TshirtEditor component

function ItemPicker() {
  const navigate = useNavigate();
  const [items, setItems] = useState([{
      selectedProduct: '',
      selectedColour: '',
      selectedSize: '',
      quantity: '1' // Set initial quantity to an empty string
    }]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  
  // Define the options for dropdowns
  const products = ['T-shirt', 'Poster'];
  const colours = ['Black', 'White'];
  const sizes = {
    'T-shirt': ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    'Poster': ['A4 (297 x 210 mm)', 'A3 (297 x 420 mm)', 'A2 (420 x 594 mm)', 'B2 (500 x 707 mm)', 'A1 (594 x 841 mm)', 'B1 (707 x 1000 mm)', 'A0 (841 x 1189 mm)']
  };
    

// Function to get the overlay style based on the product
const overlayStyle = (product) => {
  if (product === 'T-shirt') {
    // Fixed size overlay for T-shirts
    return {
      backgroundImage: `url(${myImage2})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'absolute',
      top: '45%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '35%', // Fixed width
      height: '35%', // Fixed height
      zIndex: '2',
    };
  } else if (product === 'Poster') {
    // Dynamic size overlay for Posters
    return {
      backgroundImage: `url(${myImage2})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '2',
    };
  }
  return {};
};
    
  // Function to render option boxes
  const renderOptionBoxes = (options, selectedValue, updateFunction) => {
    return options.map(option => (
      <div
        key={option}
        className={`option-box ${selectedValue === option ? 'selected' : ''}`}
        onClick={() => updateFunction(option)}
      >
        {option}
      </div>
    ));
  };
  
  const handleQuantityChange = (index, value) => {
    const newItems = [...items];
    if (value === '' || parseInt(value, 10) > 0) {
      newItems[index].quantity = value;
      setItems(newItems);
    }
  };
  
  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const isProductAndColorSelected = (item) => {
    return (item.selectedProduct === 'T-shirt' && item.selectedColour ||
            item.selectedProduct === 'Poster');
  };

  const isSizeSelected = (item) => {
    return isProductAndColorSelected(item) && item.selectedSize;
  };

  const isItemComplete = (item) => {
    const productAndColorSelected = item.selectedProduct === 'T-shirt' && item.selectedColour ||
      item.selectedProduct === 'Poster';
    const sizeSelected = productAndColorSelected && item.selectedSize;
    return sizeSelected && item.quantity; // Check if quantity is also filled in
  };

  const areAllItemsComplete = () => {
    return items.every(isItemComplete) && items.every(item => item.quantity && parseInt(item.quantity, 10) > 0);
  };

  // Function to navigate to the next page
  const goToNextPage = () => {
    if (items.every(isItemComplete)) {
      localStorage.setItem('selectedItems', JSON.stringify(items));
      console.log(items)
      navigate('/checkout');
    }
  };

  const goToPreviousPage = (pagePath) => {
    navigate('/app');
  };

  
  const addItem = () => {
    setItems([...items, {
      selectedProduct: '',
      selectedColour: '',
      selectedSize: '',
      quantity: '1' // Set initial quantity to an empty string
    }]);

    // Scroll to the bottom of the page after state update
    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 0);
  };

  // Function to handle deleting an item
  const deleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
      
  if ((selectedProduct === 'T-shirt' && selectedColour) || (selectedProduct === 'Poster')) {
    overlayStyle = {
      ...overlayStyle,
      backgroundImage: `url(${myImage2})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'transparent',
    };
  }

  return (
    <div className="App">
      <h1>Create your item</h1>

      {items.map((item, index) => (
        <div key={index} className="item-selection">
          <div className="options-and-buttons">
            <div className="options-section">
              <h2>Product</h2>
              <div className="options-container">
                {renderOptionBoxes(products, item.selectedProduct, (value) => updateItem(index, 'selectedProduct', value))}
              </div>

              {item.selectedProduct === 'T-shirt' && (
                <>
                  <h2>Colour</h2>
                  <div className="options-container">
                    {renderOptionBoxes(colours, item.selectedColour, (value) => updateItem(index, 'selectedColour', value))}
                  </div>
                </>
              )}

              {item.selectedProduct === 'T-shirt' && item.selectedColour && (
                <>
                  <h2>Size</h2>
                  <div className="options-container">
                    {renderOptionBoxes(sizes[item.selectedProduct], item.selectedSize, (value) => updateItem(index, 'selectedSize', value))}
                  </div>
                </>
              )}

              {item.selectedProduct === 'Poster' && (
                <>
                  <h2>Size</h2>
                  <div className="options-container">
                    {renderOptionBoxes(sizes[item.selectedProduct], item.selectedSize, (value) => updateItem(index, 'selectedSize', value))}
                  </div>
                </>
              )}

            </div>

            
            {isSizeSelected(item) && (
              <div className="selection-section">
                <h2>Quantity</h2>
                <div>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    min="1"
                    className="quantity-input"
                    placeholder="Enter quantity"
                  />
                  {item.quantity === '' && <div className="error-message">Please enter a quantity</div>}
                </div>
              </div>
            )}

            {items.length > 1 && (
              <div className="tooltip">
                <button onClick={() => deleteItem(index)} className="svg-button">
                  <DeleteIconSVG />
                </button>
                <span className="tooltiptext">Remove this item</span>
              </div>
            )}

            {index === items.length - 1 && (
              <div className="buttons-container">
                <button
                  className="button" // Same style as the "Add another item" button
                  onClick={goToPreviousPage}
                >
                  Previous page
                </button>

                <button
                  className={`button ${isItemComplete(item) ? 'enabled' : 'disabled'}`}
                  onClick={addItem}
                  disabled={!isItemComplete(item)}
                >
                  Add another item
                </button>

                <button
                  className={`button ${areAllItemsComplete() ? 'enabled' : 'disabled'}`}
                  onClick={goToNextPage}
                  disabled={!areAllItemsComplete()}
                >
                  Next page
                </button>
              </div>
            )}
          </div>

          <div className="image-preview">
          {item.selectedProduct === 'Poster' && item.selectedSize &&(
            <div className="image-preview">
                {/* Pass the selected size to the PosterEditor */}
                <PosterEditor selectedSize={item} />
            </div>
            )}
          {item.selectedProduct === 'T-shirt' && item.selectedColour && (
            <div className="image-preview">
              {/* Pass the selected colour to the TshirtEditor */}
              <TshirtEditor selectedColour={item.selectedColour} />
            </div>
          )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemPicker;
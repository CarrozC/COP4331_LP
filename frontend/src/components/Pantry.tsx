import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import './Pantry.css';
import RecipePopup from './RecipePopup';

const Pantry: React.FC = () => {
  const { user, setUser } = useUser();
  const [pantry, setPantry] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]); // Store searched recipes
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null); 



  useEffect(() => {
    if (user?.pantry) {
      setPantry(user.pantry);
    }
  }, [user]);

  // Update Pantry in DB
  const updatePantryInDB = async (updatedPantry: string[]) => {

    


    try {
        const response = await fetch('/api/updatePantry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Login: user?.username,
                Pantry: updatedPantry,
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to update pantry in the database.');
        }
    } catch (err) {
        console.error(err);
        setError('Failed to sync pantry with the database.');
    }
};


const handleAddItem = async () => {
  if (!newItem.trim()) {
      setError('Please enter a valid item.');
      return;
  }

  try {
      setIsAdding(true);
      const updatedPantry = [...pantry, newItem];
      setPantry(updatedPantry);
      setNewItem('');
      setSuccess('Item added successfully!');
      await updatePantryInDB(updatedPantry);
  } catch (err) {
      console.error(err);
      setError('Failed to add item. Please try again.');
  } finally {
      setIsAdding(false);
  }
};

const handleRemoveItem = async (item: string) => {
  try {
      setIsRemoving(true);
      const updatedPantry = pantry.filter((i) => i !== item);
      setPantry(updatedPantry);
      setSuccess('Item removed successfully!');
      await updatePantryInDB(updatedPantry);
  } catch (err) {
      console.error(err);
      setError('Failed to remove item. Please try again.');
  } finally {
      setIsRemoving(false);
  }
};

const addFavorite = async (newFavorite: number) => {
  console.log('Adding favorite'); 
  try {
    const response = await fetch('http://group30.xyz/api/addfavorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Login: user?.username, // Assuming username is the unique identifier
        RecipeID: newFavorite,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add Favorite.');
    }

    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      // Ensure the returned object matches the User interface
      return {
        ...prevUser,
        favorites: [...prevUser.favorites, newFavorite],
      };
    });

  }
  catch(err)
  {
    console.error(err);
    return; 
  }

}; 

const deleteFavorite = async (favorite: number) => {
  console.log("Deleting Favorite"); 
  try {
    const response = await fetch('http://group30.xyz/api/removefavorite', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Login: user?.username, // Assuming username is the unique identifier
        RecipeID: favorite,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add Favorite.');
    }

    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      // Ensure the returned object matches the User interface
      return {
        ...prevUser,
        favorites: prevUser.favorites.filter((id) => id !== favorite),
      };
    });

  }
  catch(err)
  {
    console.error(err);
    return; 
  }
}; 


  const handleSearchRecipes = async () => {
    if (pantry.length === 0) {
      setError('Your pantry is empty. Add items to search for recipes.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/searchPantry?ingredients=${pantry.join(',')}&allergens=${user?.allergens.join(',') || ''}`
      );

      if (!response.ok) {
        throw new Error('Failed to search recipes.');
      }

      const data = await response.json();
      setRecipes(data);
      setSuccess('Recipes found successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pantry">
      <div className="pantry-container">
        <h2>Your Pantry</h2>
        <ul className="pantry-list">
          {pantry.map((item, index) => (
            <li key={index}>
              {item}
              <button onClick={() => handleRemoveItem(item)}>Remove</button>
            </li>
          ))}
        </ul>
        <div className="pantry-controls">
        <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add item"
        disabled={isAdding || isSearching} // Disable only during adding or searching
        />
        <button onClick={handleAddItem} disabled={isAdding || isRemoving || isSearching}>
          {isAdding ? 'Adding...' : 'Add Item'}
        </button>
        <button onClick={handleSearchRecipes} disabled={isSearching || isAdding || isRemoving}>
          {isSearching ? 'Searching...' : 'Find Recipes'}
        </button>

        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="recipes-section">
          <h3>Recipes</h3>
          <ul className="recipes-list">
            {recipes.map((recipe, index) => (
              <li key={index}>
                 <button
                  className={`star-button ${user?.favorites.indexOf(recipe.id) !== -1 ? 'favorited' : ''}`}
                  onClick={() => user?.favorites.indexOf(recipe.id) !== -1 ? deleteFavorite(recipe.id) : addFavorite(recipe.id)}
                  aria-label="Toggle Favorite"
                >
                  ★
                </button>
                <h4>{recipe.title}</h4>
                {recipe.image && <img src={recipe.image} alt={recipe.title} />}
                <button 
                    className="view-recipe-button"
                    onClick={() => setSelectedRecipeId(recipe.id)}
                  >
                  View Recipe
                  </button>
              </li>
            ))}
          </ul>
          {selectedRecipeId && (
            <RecipePopup
              recipeId = {selectedRecipeId}
              onClose={() => setSelectedRecipeId(null)}
            />
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Pantry;

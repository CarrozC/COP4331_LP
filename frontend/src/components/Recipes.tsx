import React, { useState } from 'react';
import { useUser} from "../contexts/UserContext"; 
import './Recipes.css';
import RecipePopup from './RecipePopup';

const Recipes: React.FC = () => {
  const { user, setUser } = useUser();  
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null); 

  const resultsPerPage = 10;

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      // Include the user's allergens in the request
      const userAllergens = user?.allergens.join(',') || ''; // Convert allergens array to a comma-separated string

      const response = await fetch(
        `/api/searchRecipe?q=${encodeURIComponent(query)}&allergens=${encodeURIComponent(userAllergens)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch recipes.');

      const data = await response.json();
      setRecipes(data.results || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError('Error fetching recipes.');
    } finally {
      setLoading(false);
    }
  };

  const paginatedRecipes = recipes.slice(0, currentPage * resultsPerPage);

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="recipes">
      <div className="recipes-container">
        <form onSubmit={handleSearch}>
          <h2>Search for any recipe!</h2>
          <input
            type="text"
            placeholder="Search for recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="recipe-results">
          {paginatedRecipes.length > 0 ? (
            paginatedRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <button
                  className={`star-button ${user?.favorites.indexOf(recipe.id) !== -1 ? 'favorited' : ''}`}
                  onClick={() => user?.favorites.indexOf(recipe.id) !== -1 ? deleteFavorite(recipe.id) : addFavorite(recipe.id)}
                  aria-label="Toggle Favorite"
                >
                  ★
                </button>
                <h3>{recipe.title}</h3>
                {recipe.image && <img src={recipe.image} alt={recipe.title} />}
                <button 
                  className="view-recipe-button"
                  onClick={() => setSelectedRecipeId(recipe.id)}
                >
                View Recipe
                </button>
              </div>
            ))
          ) : (
            !loading && <p>No recipes found. Try another search!</p>
          )}
        </div>
        {selectedRecipeId && (
          <RecipePopup
            recipeId = {selectedRecipeId}
            onClose={() => setSelectedRecipeId(null)}
          />
        )}

        {recipes.length > paginatedRecipes.length && !loading && (
          <button className="load-more" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Recipes;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import {useUser} from '../contexts/UserContext'; 
import RecipePopup from './RecipePopup';

const Allergen: React.FC<{
  allergens: string[];  
  handleDeleteAllergen: (allergen: string) => void; 
  newAllergen: string; 
  setNewAllergen: (value: string) => void; 
  handleAddAllergen: () => void; 
  isLoading: boolean; 
  error: string; 
  success: string; 
}> = ({
  allergens, 
  handleDeleteAllergen, 
  newAllergen, 
  setNewAllergen, 
  handleAddAllergen, 
  isLoading, 
  error, 
  success
}) => (
  <div className="allergens-tab">
    <h3>Your Allergens</h3> 
    <ul className="allergen-list">
      {allergens.map((allergen) => (
        <li key={allergen}>
          {allergen} 
          <button 
            className="delete-button"
            onClick={() => handleDeleteAllergen(allergen)}>
              X
            </button>
        </li>
      ))}
    </ul>
    <div className="add-allergen">
      <input 
        type="text" 
        value={newAllergen} 
        onChange={(e) => setNewAllergen(e.target.value)} 
        placeholder="Enter allergen in all lowercase (e.g., peanuts)" 
        disabled={isLoading} 
      />
      <button onClick={handleAddAllergen} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add'} 
      </button> 
    </div>
    {error && <p className="error">{error}</p>}
    {success && <p className="success">{success}</p>} 
  </div>
); 



const Favorites: React.FC<{setSelectedRecipeId: (id: number | null) => void; }> = ({setSelectedRecipeId}) => {
  const { user, setUser } = useUser(); 
  const [favorites, setFavorites] = useState<any[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const resultsPerPage = 10;

  const deleteFavorite = async (favorite: number) => {
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
      await handleFavorites(); 

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
    finally 
    {
      // edit the user array 
      if(user?.favorites)
      {
        const index = user?.favorites.indexOf(favorite);
        if (index !== -1) {
          user?.favorites.splice(index, 1); // Remove 1 element at the found index
        }
      }
    }
  }; 
  const handleFavorites = useCallback(async () => {
    console.log("Finding Favorites"); 
    console.log("For user: " + user?.username)
      try {
        const response = await fetch('http://group30.xyz/api/fetchFavorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Login: user?.username, // Assuming username is the unique identifier
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to find Favorites');
        }

        const data = await response.json();
        console.log("Data results: " + data.favoriteRecipes); 
        setFavorites(data.favoriteRecipes || []); 
        console.log(favorites); 
        setCurrentPage(1);
  
      }
      catch(err)
      {
        console.error(err);
        return; 
      }
      finally
      {
        setLoading(false); 
      }
     
  }, [user]); 
  const paginatedRecipes = favorites.slice(0, currentPage * resultsPerPage); 


  useEffect(() => {
    handleFavorites(); 
  },[handleFavorites]);
  return(
    <div className="favorites-tab">
      <h3>Favorites</h3> 
      <div className="recipe-results">
      {paginatedRecipes.length > 0 ? (
        paginatedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <button
              className={`star-button ${user?.favorites.indexOf(recipe.id) !== -1 ? 'favorited' : ''}`}
              onClick={() => deleteFavorite(recipe.id)}
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
        !loading && <p>No recipes found. Find some favorites!</p>
      )}
    </div>
    </div>
  )
}; 




const Profile: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [newAllergen, setNewAllergen] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'allergens' | 'favorites'>('allergens'); 
  const [emailVerified, setEmailVerified] = useState(false); //track email verification status
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null); 


  const navigate = useNavigate();

  useEffect(() => {
    try { 
      if (!user) {
        navigate('/login');
        return;
      }

      const {firstName, lastName, username, allergens} = user; 
      console.log(`${firstName}`); 
      console.log(`${lastName}`); 
      setUserName(`${firstName} ${lastName}`);
      setAllergens(allergens || []);
      setEmailVerified((prev) => prev || user.emailVerified);
      console.log("User in Profile Component:", user);
      console.log("Email Verified State:", user?.emailVerified);
    } catch (error) {
      console.error('Error parsing user_data:', error);
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSendVerification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/requestEmailVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user?.username }), // Send username instead of email
      });
  
      if (!response.ok) {
        throw new Error('Failed to send verification email.');
      }
  
      setSuccess('Verification email sent! Please check your inbox.');
      setTimeout(() => navigate('/verify-email'), 2000); // Redirect after a brief delay
    } catch (err) {
      console.error(err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleAddAllergen = async () => {
    if (!newAllergen.trim()) {
      setError('Please enter a valid allergen.');
      return;
    }
    if (allergens.includes(newAllergen)) {
      setError('This allergen is already in your list.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('http://group30.xyz/api/addAllergen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Login: user?.username, // Assuming username is the unique identifier
          Allergen: newAllergen.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add allergen.');
      }

      // Update local allergens state on success
      setAllergens((prev) => [...prev, newAllergen.trim()]);
      setNewAllergen('');
      setSuccess('Allergen added successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to add allergen. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllergen = async (allergen: string) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      setAllergens((prev) => prev.filter((item) => item !== allergen));

      const response = await fetch('http://group30.xyz/api/removeAllergen', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Login: user?.username, // Assuming username is the unique identifier
          Allergen: allergen,
        }),
      });
      console.log(JSON.stringify({ Login: user?.username, Allergen: allergen }));
      if (!response.ok) {
        throw new Error('Failed to remove allergen.');
      }

      // Update local allergens state on success
      setSuccess('Allergen deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to remove allergen. Please try again.');
      setAllergens((prev) => [...prev, allergen]);
    } finally {
      setIsLoading(false);
    }
    
  }; 


  return (
    <div className="profile">
      <div className="profile-container">
        {/* Email Verification Banner */}
        {!user?.emailVerified && (
          <div className="email-verification-banner">
            <p>
              Your email is not verified.{' '}
              <button onClick={handleSendVerification} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Verify Now'}
              </button>
            </p>
          </div>
        )}
  
        <h2>Welcome, {userName}</h2>
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'allergens' ? 'active' : ''}`}
            onClick={() => setActiveTab('allergens')}
          >
            Allergens
          </button>
          <button
            className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>
        <div className="profile-section">
          {activeTab === 'allergens' && (
            <Allergen
              allergens={allergens}
              handleDeleteAllergen={handleDeleteAllergen}
              newAllergen={newAllergen}
              setNewAllergen={setNewAllergen}
              handleAddAllergen={handleAddAllergen}
              isLoading={isLoading}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'favorites' && <Favorites setSelectedRecipeId={setSelectedRecipeId} />}
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
}

export default Profile;

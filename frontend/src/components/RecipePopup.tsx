import React, {useState, useEffect} from "react"; 
import "./RecipePopup.css"; 
import ReactDOM from 'react-dom'; 
interface RecipePopupProps {
    recipeId: number; 
    onClose: () => void; 
}

const RecipePopup: React.FC<RecipePopupProps> = ({recipeId, onClose}) => {
    const [recipeDetails, setRecipeDetails] = useState<null | {
        id: number; 
        title: string;
        image: string; // url to image 
        servings: number; 
        readyInMinutes: number; 
        ingredients: {name: string; amount: number; unit: string}[]; 
        sourceUrl: string; 
    }>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      // Fetch recipe details when the popup opens
      const fetchRecipeDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/getRecipeInfo?RecipeID=${recipeId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch recipe details.");
          }
          const data = await response.json();
          setRecipeDetails(data);
        } catch (err) {
          console.error(err);
          setError('Unable to load recipe details.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchRecipeDetails();
    }, [recipeId]);
  
    if (loading) {
      return ReactDOM.createPortal(
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={onClose}>
              ✖
            </button>
            <p>Loading...</p>
          </div>
        </div>, 
        document.body
      );
    }
  
    if (error) {
      return ReactDOM.createPortal(
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={onClose}>
              ✖
            </button>
            <p>{error}</p>
          </div>
        </div>, document.body
      );
    }
  
    return ReactDOM.createPortal(
      <div className="popup-overlay">
        <div className="popup-content">
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
          <h2>{recipeDetails?.title}</h2>
          {recipeDetails?.image && <img src={recipeDetails?.image} alt={recipeDetails?.title} />}
          <p>Servings: {recipeDetails?.servings}</p>
          <p>Ready in: {recipeDetails?.readyInMinutes} minutes</p>
          <h3>Ingredients:</h3>
          <ul>
            {recipeDetails?.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
          <a href={recipeDetails?.sourceUrl} target="_blank" rel="noopener noreferrer">
            View Full Recipe
          </a>
        </div>
      </div>, document.body
    );
  };
  
  export default RecipePopup;
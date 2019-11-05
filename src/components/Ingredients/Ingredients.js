import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

// can use state or oldState instead of currentIngredient for reducers
const ingredientReducer = (currentIngredient, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredient, action.ingredient];
        case 'DELETE':
            return currentIngredient.filter(ing => ing.id !== action.id);
        default:
            throw new Error('Should not get to this scenario');
    }
};


function Ingredients() {
    const [ initialIngredients, dispatch ] = useReducer(ingredientReducer, []);
    const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp();
    // created custom hook for httpstate
    // const [ httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null});

    // const [ initialIngredients, setIngredients ] = useState([]);
    // const [ isLoading, setIsLoading ] = useState(false);
    // const [ error, setError ] = useState();

    useEffect(() => {
        if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
            dispatch({type: 'DELETE', id: reqExtra})
        } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
            dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}})
        }
    }, [data, reqExtra, reqIdentifier, isLoading, error]);

    useEffect(() => {
        fetch('https://ingredients-list-app.firebaseio.com/ingredients.json')
            .then(response => response.json())
            .then(resData => {
                const loadedIngredients = [];
                for (const key in resData) {
                    loadedIngredients.push({
                        id: key,
                        title: resData[key].title,
                        amount: resData[key].amount
                    });
                }
                // setIngredients(loadedIngredients);
                dispatch({type: 'SET', ingredients: loadedIngredients});
            });
    }, []);

    const addIngredientHandler = useCallback(ingredient => {
        sendRequest(
            'https://ingredients-list-app.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT'
        );

        // code below is without custom useHttp hook
        // setIsLoading(true);
        // dispatchHttp({type: 'SEND'});
        // fetch('https://ingredients-list-app.firebaseio.com/ingredients.json', {
        //     method: 'POST',
        //     body: JSON.stringify(ingredient),
        //     headers: { 'Content-Type': 'application/json' }
        // })
        //     .then(response => {
        //         // setIsLoading(false);
        //         dispatchHttp({type: 'RESPONSE'});
        //         return response.json();
        //     })
        //     .then(resData => {
        //     // setIngredients(prevIngredients => [
        //     //     ...prevIngredients,
        //     //     { id: resData.name, ...ingredient } // firebase name property is unique id for each element
        //     // ]);
        //         dispatch({type: 'ADD', ingredient: { id: resData.name, ...ingredient }});
        // });

    }, [sendRequest]);

    const removeIngredientHandler = useCallback(selectedIngredientId => {
        sendRequest(
            `https://ingredients-list-app.firebaseio.com/ingredients/${selectedIngredientId}.json`,
            'DELETE',
            null,
            selectedIngredientId,
            'REMOVE_INGREDIENT'
        );

        // remove ingredient without our custom hook
        // setIsLoading(true);
        // dispatchHttp({type: 'SEND'});
        // fetch(`https://ingredients-list-app.firebaseio.com/ingredients/${selectedIngredientId}.json`, {
        //     method: 'DELETE'
        // }).then(res => {
        //     // setIsLoading(false);
        //     dispatchHttp({type: 'RESPONSE'});
        //     // setIngredients(prevIngredients =>
        //     //     prevIngredients.filter(eachIngredient => eachIngredient.id !== selectedIngredientId)
        //     // );
        //     dispatch({type: 'DELETE', id: selectedIngredientId});
        // })
        //     .catch(error => {
        //         // setError(error.message);
        //         // setIsLoading(false);
        //         dispatchHttp({type: 'ERROR', errorData: error.message})
        //     });

    }, [sendRequest]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        // setIngredients(filteredIngredients);
        dispatch({type: 'SET', ingredients: filteredIngredients});
    }, []);

    // our custom hook creates a clear function
    // const clearError = useCallback(() => {
    //     // setError(null);
    //     // dispatchHttp({type: 'CLEAR'});
    // }, []);

  return (
    <div className="App">
        {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={initialIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;

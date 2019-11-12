import React, {useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const { onLoadIngredients } = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    // will rerender useEffect every time enteredFilter is changed
    useEffect(() => {
        const timer = setTimeout(() => {
            if (enteredFilter === inputRef.current.value) {
                const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
                fetch('https://ingredients-list-app.firebaseio.com/ingredients.json' + query)
                    .then(response => response.json())
                    .then(resData => {
                        const loadedIngredients = [];
                        for (const key in resData) {
                            loadedIngredients.push({
                                id: key,
                                title: resData[key].ingredient.title,
                                amount: resData[key].ingredient.amount,
                                userId: resData[key].userId
                            });
                        }
                        let updatedLoadedIngredients = [];
                        loadedIngredients.map(ing => {
                            if (ing.userId === props.currentUser) {
                                updatedLoadedIngredients.push(ing);
                            }
                            return updatedLoadedIngredients;
                        });
                        onLoadIngredients(updatedLoadedIngredients);
                    });
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        }
    }, [enteredFilter, onLoadIngredients, inputRef, props.currentUser]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={enteredFilter}
                        onChange={event => setEnteredFilter(event.target.value)}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;

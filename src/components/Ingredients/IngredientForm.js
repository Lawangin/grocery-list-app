import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo(props => {
    const [initialTitle, setTitle] = useState('');
    const [initialAmount, setAmount] = useState('');

    const submitHandler = event => {
        event.preventDefault();
        props.onAddIngredient({title: initialTitle, amount: initialAmount})
    };

    return (
        <section className="ingredient-form">
            <Card>
                <form onSubmit={submitHandler}>
                    <div className="form-control">
                        <label htmlFor="title">Name</label>
                        <input
                            type="text"
                            id="title"
                            value={initialTitle}
                            onChange={event => {
                                setTitle(event.target.value);
                            }
                            }/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={initialAmount}
                            onChange={event => {
                                setAmount(event.target.value);
                            }
                            }
                        />
                    </div>
                    <div className="ingredient-form__actions">
                        <button type="submit">Add Ingredient</button>
                        {props.loading && <LoadingIndicator/>}
                    </div>
                </form>
            </Card>
        </section>
    );
});

export default IngredientForm;

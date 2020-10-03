import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListAction from "./shopping-list.actions"

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
};

export function ShoppingListReducer(state = initialState, action: ShoppingListAction.ShoppingListAction) {
    switch (action.type) {
        case ShoppingListAction.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListAction.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients:[...state.ingredients, ...action.payload]
            }
        case ShoppingListAction.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[action.payload.index]
            const upgradedIngredient = {
                ...ingredient,
                ...action.payload.ingredient
            }
            const updatedIngredients = [ ...state.ingredients ];
            updatedIngredients[action.payload.index] = { 
                ...upgradedIngredient
            }
            return {
                ...state,
                ingredients: updatedIngredients
            };
        case ShoppingListAction.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter( (ig, igIndex) => {
                    return igIndex != action.payload
                })
            };
        default:
            return state
    }
}
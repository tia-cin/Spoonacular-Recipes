import {
  GET_RECIPES,
  GET_TYPES_OF_DIETS,
  GET_RECIPE_DETAIL,
  CREATE_RECIPE,
  FILTER_BY_NAME,
  FILTER_BY_DIET,
  ORDER_RECIPES,
  ActionTypes,
  RecipeType,
  DietType,
} from "../types";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";
import axios from "axios";

// unir ruta /recipes
export function getRecipes(): ThunkAction<void, RootState, null, ActionTypes> {
  return async (dispatch) => {
    try {
      let recipes = await axios.get("http://localhost:3001/recipes");
      let res = await recipes.data;
      console.log(res);
      // return dispatch({
      //   type: GET_RECIPES,
      //   payload: recipes.data,
      // });
    } catch (error) {
      console.log(error);
    }
  };
}

// unir ruta /types
export function getDiets(): ThunkAction<void, RootState, null, ActionTypes> {
  return async (dispatch) => {
    try {
      let diets = await axios.get("http://localhost:3001/types");
      return dispatch({
        type: GET_TYPES_OF_DIETS,
        payload: diets.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

// unir ruta /recipes/:idRecipes
export function getRecipeDetail(
  id: number
): ThunkAction<void, RootState, null, ActionTypes> {
  console.log(id);
  return async (dispatch) => {
    try {
      let recipeDetail = await axios(`http://localhost:3001/recipes/${id}`);
      return dispatch({
        type: GET_RECIPE_DETAIL,
        payload: recipeDetail.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

// unir ruta /recipe
export function createRecipe(
  payload: RecipeType
): ThunkAction<void, RootState, null, ActionTypes> {
  return async (dispatch) => {
    try {
      let newRecipe = await axios.post("http://localhost:3001/recipe", payload);
      return dispatch({
        type: CREATE_RECIPE,
        payload: newRecipe.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

// unir ruta /recipes?name=...
export function filterByName(
  payload: string
): ThunkAction<void, RootState, null, ActionTypes> {
  return async (dispatch) => {
    try {
      let recipe = await axios(`http://localhost:3001/recipes?name=${payload}`);
      return dispatch({
        type: FILTER_BY_NAME,
        payload: recipe.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

// crear action para filtrar por diets
export function filterByDiets(payload: DietType): ActionTypes {
  return {
    type: FILTER_BY_DIET,
    payload: payload,
  };
}

// crear action para ordenar recipes
export function orderRecipes(payload: RecipeType[] | string): ActionTypes {
  return {
    type: ORDER_RECIPES,
    payload: payload,
  };
}

// ** Redux Imports
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

// ** Axios Imports
import Api from "../../../../sevices/Api";

export const getAllIngredients = createAsyncThunk(
  "ingredients/getAllIngredients",
  async (id) => {
    const response = await Api.get(`/recipes/ingredient/${id}`);
    return response.data.data;
  }
);

// export const getIngredientbyRecipe = createAsyncThunk(
//   "ingredients/getIngredientbyRecipe",
//   async (params) => {
//     const response = await Api.get(
//       `/recipes/${params.recipe_id}/ingredient/index-by-recipe`
//     );

//     const ingredient = response.data.data;
//     let Arr = [];
//     ingredient.forEach((item, index) => {
//       let data = {
//         id: item.id,
//         ingredient_id: item.ingredient_id,
//         recipe_id: item.recipe_id,
//         conversion_factor: item.conversion_factor,
//         conversion_unit: item.conversion_unit,
//         ingredient_title: item.RiIngredient.ingredient_display_name,
//         ingredient_image: item.RiIngredient.ingredient_image.url,
//         item_name: "",
//         quantity: null,
//         cost: null,
//         ingredient_cogs: null,
//       };

//       Arr.push(data);
//     });

//     return Arr;
//   }
// );

export const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    data: [],
    selectedData: {},
    calculate: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    // builder
    //   .addCase(getAllIngredients.fulfilled, (state, action) => {
    //     state.data = action.payload;
    //   })
    //   .addCase(getIngredientbyRecipe.fulfilled, (state, action) => {
    //     state.calculate = action.payload;
    //   });
  },
});

export default coursesSlice.reducer;

//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useTypeAccommodation from "../hooks/useTypeAccommodation";
//Interface
import { ITypeAccommodationResponse, ITypeAccommodation } from "../interfaces/TypeAccommodation";
import { IAuth } from "../interfaces/Authentication";

interface IState {
    typeAccommodation: ITypeAccommodation[] | []
};

const initialState: IState = {
    typeAccommodation: []
};

export const list = createAsyncThunk(
    'tipo_acomodacao/list',
    async (_, { getState, rejectWithValue }) => {
        const userAuth: IAuth = (getState() as any).auth.userAuth;
        const response:ITypeAccommodationResponse = await useTypeAccommodation().list({token: userAuth.access})
        
        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }

    }
);

export const typeAccommodationSlice = createSlice({
    name: 'tipo_acomodacao',
    initialState,
    reducers: {
        reset: (state: IState) => {
            state.typeAccommodation = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(list.fulfilled, (state: IState, action: PayloadAction<ITypeAccommodationResponse>)=>{
                state.typeAccommodation = action.payload.data as ITypeAccommodation[];
            })
    }
});

export const { reset } = typeAccommodationSlice.actions;
export default typeAccommodationSlice.reducer;
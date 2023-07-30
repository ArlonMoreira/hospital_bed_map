//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useBed from "../hooks/useBed";
import { IBed, IBedParams, IBedResponse } from "../interfaces/Bed";
import { IAuth } from "../interfaces/Authentication";

interface IState {
    registerSuccess: boolean,
    mensagemRegisterSuccess: string | null,
    registerError: boolean,
    mensagemRegisterError: string | null,
    beds: IBed[]
}

const initialState = {
    registerSuccess: false,
    mensagemRegisterSuccess: null,
    registerError: false,
    mensagemRegisterError: null,
    beds: []
};

export const register = createAsyncThunk(
    'bed/register',
    async(data:IBedParams, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().register({params: { token: userAuth.access, data }});

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
);

export const bedSlice = createSlice({
    name: 'bed',
    initialState,
    reducers: {
        reset: (state: IState) => {
            state.mensagemRegisterSuccess = null;
        },
        resetAlertBed: (state: IState) => {
            state.registerSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state: IState, action: PayloadAction<IBedResponse>) => {
                const response = (action.payload as IBedResponse);
                //Success
                state.registerSuccess = true;
                state.mensagemRegisterSuccess = response.message;
                //Beds
                if(response.data && Array.isArray(response.data)){
                    const bed= response.data as IBed[];
                    state.beds.push(bed[0]);
                }
            });
    }
});

export const { resetAlertBed } = bedSlice.actions;
export default bedSlice.reducer;
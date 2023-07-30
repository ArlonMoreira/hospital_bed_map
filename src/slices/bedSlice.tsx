//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useBed from "../hooks/useBed";
import { IBed, IBedParams, IBedResponse, IBedErrors } from "../interfaces/Bed";
import { IAuth } from "../interfaces/Authentication";

interface IState {
    registerSuccess: boolean,
    mensagemRegisterSuccess: string | null,
    registerError: boolean,
    mensagemRegisterError: string | null,
    loadingRegister: boolean,
    errorsRegisterBed: IBedErrors,
    beds: IBed[]
}

const initialState = {
    registerSuccess: false,
    mensagemRegisterSuccess: null,
    registerError: false,
    mensagemRegisterError: null,
    loadingRegister: false,
    errorsRegisterBed: {},
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
            state.loadingRegister = false;
            state.errorsRegisterBed = {};
            state.beds = [];
        },
        resetAlertBed: (state: IState) => {
            state.registerSuccess = false;
            state.registerError = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state: IState, action: PayloadAction<IBedResponse>) => {
                const response = (action.payload as IBedResponse);
                //Loading
                state.loadingRegister = false;
                //Success
                state.registerSuccess = true;
                state.mensagemRegisterSuccess = response.message;
                //Beds
                if(response.data && Array.isArray(response.data)){
                    const bed= response.data as IBed[];
                    state.beds.push(bed[0]);
                }
            })
            .addCase(register.pending, (state: IState) => {
                state.loadingRegister = true;
            })
            .addCase(register.rejected, (state: IState, action: PayloadAction<IBedResponse | unknown>) => {
                const response = (action.payload as IBedResponse);
                //Loading
                state.loadingRegister = false;
                //Error
                if(Object.keys(response).indexOf('detail') === -1){
                    state.mensagemRegisterError = response.message;
                } else {
                    state.mensagemRegisterError = 'Erro interno no sistema. Contate o administrador.'
                }
                //Errors
                if(response.data){
                    state.errorsRegisterBed = response.data as IBedErrors;
                } else {
                    state.errorsRegisterBed = {};
                }

                state.registerError = true;
            })
    }
});

export const { reset, resetAlertBed } = bedSlice.actions;
export default bedSlice.reducer;
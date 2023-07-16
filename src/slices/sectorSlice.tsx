//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useSectors from "../hooks/useSectors";
//Interfaces
import { ISector, ISectorParams, ISectorResponse, ISectorErrors } from "../interfaces/Sector";
import { IAuth } from "../interfaces/Authentication";

interface IState {
    successRegister: boolean | null,
    successRegisterMessage: string | null,
    successUpdate: boolean,
    successUpdateMessage: string | null,   
    loading: boolean,
    errorsRegister: ISectorErrors | null,
    errorRegisterMessage: string | null,
    errorsUpdate: ISectorErrors | null,
    errorUpdateMessage: string | null,
    errorUpdate: boolean,
    sectors: ISector[]
};

const initialState: IState = {
    successRegister: null,
    successRegisterMessage: null,
    successUpdate: false,
    successUpdateMessage: null, 
    loading: false,
    errorsRegister: null,
    errorRegisterMessage: null,
    errorsUpdate: null,
    errorUpdateMessage: null,
    errorUpdate: false,
    sectors: []
};

export const register = createAsyncThunk(
    'sector/register',
    async ({hospital, data}: {hospital:string, data: ISectorParams}, { getState, rejectWithValue }) => {
        const useAuth:IAuth = await (getState() as any).auth.userAuth;
        const response:ISectorResponse = await useSectors().register({id: hospital, token: useAuth.access, data});

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }

    }
);

export const list = createAsyncThunk(
    'sector/list',
    async(hospital:string, { getState, rejectWithValue }) => {
        const useAuth:IAuth = await (getState() as any).auth.userAuth;
        const response:ISectorResponse = await useSectors().list({id: hospital, token: useAuth.access});

        if(response.success) {
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
);

export const update = createAsyncThunk(
    'sector/update',
    async (data:ISector, { getState, rejectWithValue })=>{
        const useAuth:IAuth = await (getState() as any).auth.userAuth;

        const response:ISectorResponse = await useSectors().update({
            id: data.id,
            token: useAuth.access,
            data
        })

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
        
    }
)

export const sectorSlice = createSlice({
    name: 'sector',
    initialState,
    reducers: {
        clearSectors: (state: IState) => {
            state.sectors = [];
        },
        reset: (state: IState) => {
            state.successRegister = null;
            state.successRegisterMessage = null;
            state.loading = false;
            state.errorsRegister = null;
            state.errorRegisterMessage = null;
            state.successUpdate = false;
            state.successUpdateMessage = null;
            state.errorsUpdate = null;
            state.errorUpdateMessage = null;
            state.errorUpdate = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state: IState, action: PayloadAction<ISectorResponse>) => {
                const response = (action.payload.data as ISector[]);
                //Success
                state.successRegister = true;
                state.successRegisterMessage = action.payload.message;
                //loading
                state.loading = false;
                //Error
                state.errorsRegister = null;
                state.errorRegisterMessage = null;
                //Sector
                state.sectors.push(response[0]);
            })
            .addCase(register.pending, (state: IState) => {
                state.loading = true;
            })
            .addCase(register.rejected, (state: IState, action: PayloadAction<ISectorResponse | unknown>) => {
                const response = (action.payload as ISectorResponse);
                //Success
                state.successRegister = false;
                state.successRegisterMessage = null;
                //loading
                state.loading = false;
                //Error
                if(Object.keys(response).indexOf('message') !== -1){
                    state.errorRegisterMessage = response.message;
                } else {
                    state.errorRegisterMessage = 'Erro interno no sistema. Contate o administrador.'
                };
                
                if(response.data){
                    state.errorsRegister = response.data as ISectorErrors;
                } else {
                    state.errorsRegister = null;
                }
            })
            .addCase(list.fulfilled, (state: IState, action: PayloadAction<ISectorResponse>) => {
                //Sectors
                state.sectors = action.payload.data as ISector[];
            })
            .addCase(update.fulfilled, (state: IState, action: PayloadAction<ISectorResponse>) => {
                const response = (action.payload as ISectorResponse);
                //Success
                state.successUpdate = true;
                state.successUpdateMessage = response.message;
                //loading
                state.loading = false;
                //Sectors
                //Tenho que falar que response.data é um array
                if(response && Array.isArray(response.data)){
                    const data = (response.data[0] as ISector);
                    //Retorna o índice em que desejo alterar
                    const indexUpdate = state.sectors.findIndex((sector) => sector.id === data.id);
                    state.sectors[indexUpdate] = data;
                }
                //Errors
                state.errorsUpdate = null;
                state.errorUpdateMessage = null;
            })
            .addCase(update.pending, (start: IState) => {
                //Loading
                start.loading = true;
            })
            .addCase(update.rejected, (state:IState, action: PayloadAction<ISectorResponse | unknown>)=>{
                const response = action.payload as ISectorResponse;
                //Loading
                state.loading = false;
                //
                state.errorUpdate = true;
                state.errorsUpdate = response.data as ISectorErrors;
                //Error message
                if(Object.keys(response).indexOf('message') !== -1){
                    state.errorUpdateMessage = response.message;
                } else {
                    state.errorUpdateMessage = 'Erro interno no sistema. Contate o administrador.';
                }
                
            })

    }
});

export const { reset, clearSectors } = sectorSlice.actions;
export default sectorSlice.reducer;
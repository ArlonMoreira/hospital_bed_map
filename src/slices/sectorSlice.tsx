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
    loading: boolean,
    errorsRegister: ISectorErrors | null,
    errorRegisterMessage: string | null,
    sector: ISector | null,
    sectors: ISector[]
};

const initialState: IState = {
    successRegister: null,
    successRegisterMessage: null,
    loading: false,
    errorsRegister: null,
    errorRegisterMessage: null,
    sector: null,
    sectors: []
};

export const register = createAsyncThunk(
    'sector/register',
    async ({id, data}: {id:number, data: ISectorParams}, { getState, rejectWithValue }) => {
        const useAuth:IAuth = await (getState() as any).auth.userAuth;
        const response:ISectorResponse = await useSectors().register({id, token: useAuth.access, data});

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }

    }
);

export const list = createAsyncThunk(
    'sector/list',
    async(_, { getState, rejectWithValue }) => {
        const useAuth:IAuth = await (getState() as any).auth.userAuth;
        const response:ISectorResponse = await useSectors().list({token: useAuth.access});

        if(response.success) {
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
        reset: (state: IState) => {
            state.successRegister = null;
            state.successRegisterMessage = null;
            state.loading = false;
            state.errorsRegister = null;
            state.errorRegisterMessage = null;
            state.sector = null;
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
                state.sector = response[0];
                state.sectors.push(state.sector);
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
                state.errorRegisterMessage = response.message;
                if(response.data){
                    state.errorsRegister = response.data as ISectorErrors;
                } else {
                    state.errorsRegister = null;
                }
                //Sector
                state.sector = null;
            })
            .addCase(list.fulfilled, (state: IState, action: PayloadAction<ISectorResponse>) => {
                //Sectors
                state.sectors = action.payload.data as ISector[];
            })
    }
});

export const { reset } = sectorSlice.actions;
export default sectorSlice.reducer;
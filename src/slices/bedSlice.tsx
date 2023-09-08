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
    beds: IBed[],
    removeError: boolean,
    mensagemRemoverError: string | null
}

const initialState = {
    registerSuccess: false,
    mensagemRegisterSuccess: null,
    registerError: false,
    mensagemRegisterError: null,
    loadingRegister: false,
    errorsRegisterBed: {},
    beds: [],
    removeError: false,
    mensagemRemoverError: null
};

export const list = createAsyncThunk(
    'bed/list',
    async({sector}:{sector:string}, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().list({
            params: {token: userAuth.access},
            sector
        });

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
)

export const register = createAsyncThunk(
    'bed/register',
    async(data:IBedParams, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().register({
            params: { token: userAuth.access, data }
        });

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
);

export const occupation = createAsyncThunk(
    'bed/occupation',
    async({bed, data}:{bed:string, data:IBedParams}, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().occupation({
            params: {token:userAuth.access, data},
            bed
        });

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
);

export const active = createAsyncThunk(
    'bed/active',
    async({bed, data}:{bed:string, data:IBedParams}, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().active({
            params: {token:userAuth.access, data},
            bed
        });

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
)

export const remove = createAsyncThunk(
    'bed/remove',
    async(bed:string, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().remove({
            params: {token:userAuth.access},
            bed
        });

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
)

export const bedSlice = createSlice({
    name: 'bed',
    initialState,
    reducers: {
        reset: (state: IState) => {
            state.loadingRegister = false;
            state.errorsRegisterBed = {};
            state.mensagemRemoverError = null;
        },
        resetAlertBed: (state: IState) => {
            state.registerSuccess = false;
            state.registerError = false;
            state.removeError = false;
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
            .addCase(list.fulfilled, (state: IState, action: PayloadAction<IBedResponse>)=>{
                const response = (action.payload.data as IBed[]);
                //beds
                state.beds = response;
            })
            .addCase(occupation.fulfilled, (state: IState, action: PayloadAction<IBedResponse>)=>{
                const response = (action.payload.data as IBed[])[0];
                //beds
                const index = state.beds.findIndex((bed) => bed.id === response.id);
                state.beds[index].type_occupation_id = response.type_occupation_id;
                state.beds[index].type_occupation_status = response.type_occupation_status;
                state.beds[index].type_occupation_description = response.type_occupation_description;
            })
            .addCase(active.fulfilled, (state: IState, action: PayloadAction<IBedResponse>)=>{
                const response = (action.payload.data as IBed[])[0];
                //beds
                const index = state.beds.findIndex((bed) => bed.id === response.id);
                state.beds[index].is_active = response.is_active;
            })
            .addCase(remove.fulfilled, (state: IState, action: PayloadAction<IBedResponse>)=>{
                const response = action.payload as IBedResponse;
                const data = (response.data as IBed[])[0];
                //bed
                const index = state.beds.findIndex((bed)=> bed.id == data.id);
                state.beds.splice(index, 1);
            })
            .addCase(remove.rejected, (state: IState, action: PayloadAction<IBedResponse | unknown>) => {
                const response = (action.payload as IBedResponse);
                //Error
                state.removeError = true;

                if(Object.keys(response).indexOf('detail') === -1){
                    state.mensagemRemoverError = response.message;
                } else {
                    state.mensagemRemoverError = 'Erro interno no sistema. Contate o administrador.'
                }
            })
    }
});

export const { reset, resetAlertBed } = bedSlice.actions;
export default bedSlice.reducer;
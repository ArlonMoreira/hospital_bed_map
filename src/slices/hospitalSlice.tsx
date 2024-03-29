//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useHospital from "../hooks/useHospital";
//Interfaces
import { IHospitalErrors, IHospital, IHospitalParams, IHospitalResponse } from "../interfaces/Hospital";
import { IAuth } from "../interfaces/Authentication";


interface IState {
    successRegister: boolean | null,
    successRegisterMessage: string | null,
    successUpdate: boolean | null,
    successUpdateMessage: string | null,
    loading: boolean,
    errorRegisterMessage: string | null,
    errorsRegister: IHospitalErrors | null,
    errorRegister: boolean | null,
    errorUpdateMessage: string | null,
    errorsUpdate: IHospitalErrors | null,
    errorUpdate: boolean | null,
    hospitals: IHospital[],
    hospital: IHospital | null,
    loadingHospitals: boolean
};

const initialState: IState = {
    successRegister: null,
    successRegisterMessage: null,
    successUpdate: null,
    successUpdateMessage: null,
    loading: false,
    errorRegisterMessage: null,
    errorsRegister: null,
    errorRegister: false,
    errorUpdateMessage: null,
    errorsUpdate: null,
    errorUpdate: false,
    hospitals: [],
    hospital: null,
    loadingHospitals: false
    
};

export const register = createAsyncThunk(
    'hospital/register',
    async (data: IHospitalParams, { getState, rejectWithValue }) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IHospitalResponse = await useHospital().register({token: userAuth.access, data});

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
);

export const list = createAsyncThunk(
    'hospital/list',
    async (_, { getState, rejectWithValue }) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IHospitalResponse = await useHospital().hospitals({token: userAuth.access});

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }

    }
);

export const getHospitals = createAsyncThunk(
    'hospital/getHospitals',
    async(_, { rejectWithValue }) => {
        const response:IHospitalResponse = await useHospital().hospitals();
        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
)

export const hospital = createAsyncThunk(
    'hospital/hospital',
    async(hospital: string, { getState, rejectWithValue }) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IHospitalResponse = await useHospital().hospital({
            params: {
                token: userAuth.access
            },
            hospital
        });
        
        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }

    }
);

export const update = createAsyncThunk(
    'hospital/update',
    async({data, hospital}:{data: IHospitalParams, hospital: string}, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IHospitalResponse = await useHospital().update({
            params: {
                token: userAuth.access,
                data
            },
            hospital
        });
        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
);

export const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {
        reset: (state: IState) => {
            state.successRegisterMessage = null;
            state.successUpdateMessage = null;
            state.loading = false;
            state.errorRegisterMessage = null;
            state.errorsRegister = null;
            state.errorUpdateMessage = null;
            state.errorsUpdate = null;
            state.hospital = null;
        },
        hideAlerts: (state: IState) => {
            state.successRegister = false;
            state.successUpdate = false;
            state.errorRegister = false;
            state.errorUpdate = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHospitals.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                const response = (action.payload as IHospitalResponse);
                //Hospitails
                state.hospitals = response.data as IHospital[];
                //Encerrar carregamento
                state.loadingHospitals = false;
            })
            .addCase(getHospitals.pending, (state: IState) => {
                //Iiniciou carregamento
                state.loadingHospitals = true;
            })
            .addCase(register.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                const response = (action.payload as IHospitalResponse);
                //Success
                state.successRegister = true;
                state.successRegisterMessage = response.message!;
                //Loading
                state.loading = false;
                //Hospitals
                if(response.data && Array.isArray(response.data)){
                    const hospitals:IHospital[] = response.data;
                    state.hospitals.unshift(hospitals[0]);
                }

            })
            .addCase(register.pending, (state: IState)=>{
                state.loading = true;
            })
            .addCase(register.rejected, (state: IState, action: PayloadAction<IHospitalResponse | unknown>)=>{
                const response = (action.payload as IHospitalResponse);
                //Loading
                state.loading = false;
                //Error
                if (Object.keys(response).indexOf('message') !== -1) {
                    state.errorRegisterMessage = response.message;
                } else {
                    state.errorUpdateMessage = 'Erro interno no sistema. Contate o administrador.'
                };

                if(response.data){
                    state.errorsRegister = response.data as IHospitalErrors;
                } else {
                    state.errorsRegister = null;
                }
                
                state.errorRegister = true;
                
            })
            .addCase(list.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                const response = (action.payload as IHospitalResponse);
                //Loading
                state.loading = false;
                //Hospitals
                state.hospitals = response.data as IHospital[];
            })
            .addCase(hospital.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                //Loading
                state.loading = false;
                //Hospital
                if(action.payload.data && Array.isArray(action.payload.data)){
                    state.hospital = (action.payload.data[0] as IHospital);
                }
            })
            .addCase(hospital.pending, (state: IState)=>{
                state.loading = true;
            })
            .addCase(update.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                //Success
                state.successUpdate = true;
                state.successUpdateMessage = action.payload.message!;
                //Loading
                state.loading = false;
                //Hospital
                if(action.payload.data && Array.isArray(action.payload.data)){
                    state.hospital = (action.payload.data[0] as IHospital);

                    const indexUpdate = state.hospitals.findIndex((hospital) => hospital.id === state.hospital?.id);
                    state.hospitals[indexUpdate] = state.hospital; //Replace old hospital data for new data of hospital

                }
            })
            .addCase(update.pending, (state: IState)=>{
                state.loading = true;
            })
            .addCase(update.rejected, (state: IState, action: PayloadAction<IHospitalResponse | unknown>)=>{
                const response = (action.payload as IHospitalResponse);
                //loading
                state.loading = false;
                //Error
                if(Object.keys(response).indexOf('message') !== -1) {
                    state.errorUpdateMessage = response.message;
                } else {
                    state.errorUpdateMessage = 'Erro interno no sistema. Contate o administrador.'
                }

                if(response.data){
                    state.errorsUpdate = response.data as IHospitalErrors;
                } else {
                    state.errorsUpdate = null;
                }

                state.errorUpdate = true;

            })
    }
});

export const { reset, hideAlerts } = hospitalSlice.actions;
export default hospitalSlice.reducer;
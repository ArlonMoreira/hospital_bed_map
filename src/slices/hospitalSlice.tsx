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
    hospitals: IHospital[],
    hospital: IHospital | null
};

const initialState: IState = {
    successRegister: null,
    successRegisterMessage: null,
    successUpdate: null,
    successUpdateMessage: null,
    loading: false,
    errorRegisterMessage: null,
    errorsRegister: null,
    hospitals: [],
    hospital: null
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

export const hospital = createAsyncThunk(
    'hospital/hospital',
    async(id: string, { getState, rejectWithValue }) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IHospitalResponse = await useHospital().hospital({
            params: {
                token: userAuth.access
            },
            id
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
    async({data, id}:{data: IHospitalParams, id: string}, {getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IHospitalResponse = await useHospital().update({
            params: {
                token: userAuth.access,
                data
            },
            id
        });

        if(response.success){
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
)

export const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {
        reset: (state: IState) => {
            state.successRegister = null;
            state.successRegisterMessage = null;
            state.successUpdate = null;
            state.successUpdateMessage = null;
            state.loading = false;
            state.errorRegisterMessage = null;
            state.errorsRegister = null;
            state.hospital = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                const response = (action.payload as IHospitalResponse);
                //Success
                state.successRegister = true;
                state.successRegisterMessage = response.message;
                //Loading
                state.loading = false;
                //Error
                state.errorRegisterMessage = null;
                state.errorsRegister = null;
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
                //Success
                state.successRegister = false;
                state.successRegisterMessage = null;
                //Loading
                state.loading = false;
                //Error
                state.errorRegisterMessage = response.message;
                if(response.data){
                    state.errorsRegister = response.data as IHospitalErrors;
                } else {
                    state.errorsRegister = null;
                }
                
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
                state.successUpdateMessage = action.payload.message;
                //Loading
                state.loading = false;
                //Hospital
                if(action.payload.data && Array.isArray(action.payload.data)){
                    state.hospital = (action.payload.data[0] as IHospital);
                }
            })
            .addCase(update.pending, (state: IState)=>{
                state.loading = true;
            })
            .addCase(update.rejected, (state: IState, action: PayloadAction<IHospitalResponse | unknown>)=>{

            })
    }
});

export const { reset } = hospitalSlice.actions;
export default hospitalSlice.reducer;
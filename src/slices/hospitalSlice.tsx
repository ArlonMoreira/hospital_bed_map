//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useHospital from "../hooks/useHospital";
//Interfaces
import { IHospitalErrors, IHospital, IHospitalParams, IHospitalResponse } from "../interfaces/Hospital";
import { IAuth } from "../interfaces/Authentication";


interface IState {
    success: boolean | null,
    successMessage: string | null,
    loading: boolean,
    errorMessage: string | null,
    errors: IHospitalErrors | null,
    hospitals: IHospital[]
};

const initialState: IState = {
    success: null,
    successMessage: null,
    loading: false,
    errorMessage: null,
    errors: null,
    hospitals: []
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
)

export const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                const response = (action.payload as IHospitalResponse);
                state.success = true;
                state.successMessage = response.message;
                state.loading = false;
                state.errorMessage = null;
                state.errors = null;
                
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
                state.success = true;
                state.successMessage = null;
                state.loading = false;
                state.errorMessage = response.message;
                
                if(response.data){
                    state.errors = response.data as IHospitalErrors;
                }
                
            })
            .addCase(list.fulfilled, (state: IState, action: PayloadAction<IHospitalResponse>)=>{
                const response = (action.payload as IHospitalResponse);
                state.success = true;
                state.successMessage = response.message;
                state.loading = false;
                state.errorMessage = null;
                state.errors = null;
                state.hospitals = response.data as IHospital[];
            })
    }
});

export default hospitalSlice.reducer;
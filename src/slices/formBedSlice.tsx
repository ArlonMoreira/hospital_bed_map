//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useBed from "../hooks/useBed";
//Interface
import { IStatus, IBedResponse, IType } from "../interfaces/Bed";
import { IAuth } from "../interfaces/Authentication";

interface IState {
    typeData: IType[] | null,
    errorType: boolean,
    statusData: IStatus[] | null,
    errorStatus: boolean
}

const initialState: IState = {
    typeData: null,
    errorType: false,
    statusData: null,
    errorStatus: false
};

export const status = createAsyncThunk(
    'bedstatus/status',
    async(_,{getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().status({ params: { token: userAuth.access } })
        
        if(response.success) {
            return response;
        } else {
            return rejectWithValue(response);
        }
    
    }
)

export const type = createAsyncThunk(
    'bedstatus/type',
    async(_,{getState, rejectWithValue}) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IBedResponse = await useBed().type({params: { token: userAuth.access }})

        if(response.success) {
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
)

export const formBedSlice = createSlice({
    name: 'bedstatus',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(status.fulfilled, (state:IState, action: PayloadAction<IBedResponse>)=>{
                const response = (action.payload as IBedResponse);
                //status
                state.statusData = (response.data as IStatus[]);
            })
            .addCase(type.fulfilled, (state:IState, action: PayloadAction<IBedResponse>) => {
                const response = (action.payload as IBedResponse);
                //status
                state.typeData = (response.data as IType[]);
            })
    }
});

export default formBedSlice.reducer;
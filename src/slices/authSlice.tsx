//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useAuthentication from "../hooks/useAuthentication";
//Interfaces
import { ILogin, IAuthentication, IAuth } from "../interfaces/Authentication";

//Caso não tiver autenticado, a variável userAuth receberá valor null
const storedUserAuth:IAuth|null = localStorage.getItem('userAuth') ? JSON.parse(localStorage.getItem('userAuth')!) : null;

interface IState {
    userAuth: IAuth | null,
    success: boolean | null,
    successLogout: boolean,
    error: IAuthentication | null,
    loading: boolean
}

const initialState: IState = {
    userAuth: storedUserAuth,
    success: null,
    successLogout: false,
    error: null,
    loading: false
};

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const newUserAuth = await useAuthentication().refreshToken(userAuth);
        
        if(newUserAuth.success){
            return (newUserAuth.data as IAuth);
        } else {
            return rejectWithValue(newUserAuth);
        }
   
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async(data: ILogin, { rejectWithValue }) => {

        const response:IAuthentication = await useAuthentication().login(data);
        
        if(response.success){ //Irá retornar no formato IAuth, que é o formato recebido pelo state userAuth
            return (response.data as IAuth);
        } else {
            return rejectWithValue(response); //Irá retonar IAuthentication porém com o tipo IAuthError
        }

    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async() => {
        return true;
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state: IState, action: PayloadAction<IAuth>) => {
                state.userAuth = action.payload;
                state.success = true;
                state.successLogout = false;
                state.loading = false;
                state.error = null;
                localStorage.setItem('userAuth', JSON.stringify(state.userAuth));
            })
            .addCase(login.pending, (state: IState) => {
                state.loading = true;
            })
            .addCase(login.rejected, (state: IState, action: PayloadAction<IAuthentication | unknown>) => {
                state.userAuth = null;
                state.success = false;
                state.successLogout = false;
                state.loading = false;
                state.error = (action.payload as IAuthentication);
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
            .addCase(logout.fulfilled, (state: IState, action: PayloadAction<boolean>) => {
                state.userAuth = null;
                state.success = false;
                state.successLogout = true;
                state.loading = false;
                state.error = null;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
            .addCase(refreshToken.fulfilled, (state: IState, action: PayloadAction<IAuth>) => {
                state.userAuth = action.payload;
                state.success = true;
                state.successLogout = false;
                state.loading = false;
                state.error = null;
                localStorage.setItem('userAuth', JSON.stringify(state.userAuth));
            })
            .addCase(refreshToken.rejected, (state: IState, action: PayloadAction<any>) => {
                state.userAuth = null;
                state.success = false;
                state.successLogout = false;
                state.loading = false;
                state.error = action.payload;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
    }    
});

// Exportar o reducer gerado automaticamente
export default authSlice.reducer;
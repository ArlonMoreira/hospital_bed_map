//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useAuthentication from "../hooks/useAuthentication";
//Interfaces
import { ILogin, IAuthentication, IAuth } from "../interfaces/Authentication";

//Caso não tiver autenticado, a variável userAuth receberá valor null
const storedUserAuth:IAuth|null = localStorage.getItem('userAuth') ? JSON.parse(localStorage.getItem('userAuth')!) : null;

interface IAuthSlice {
    userAuth: IAuth | null,
    success: boolean | null,
    error: IAuthentication | null,
    loading: boolean
}

const initialState: IAuthSlice = {
    userAuth: storedUserAuth,
    success: null,
    error: null,
    loading: false
};

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const newUserAuth:IAuthentication = await useAuthentication().refreshToken(userAuth);
        
        if(newUserAuth.success){
            if('access' in newUserAuth.data) return (newUserAuth.data as IAuth);
            return userAuth;
        } else {
            return rejectWithValue(newUserAuth);
        }
   
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async(data: ILogin, { rejectWithValue }) => {

        const response = await useAuthentication().login(data);

        if(response.success){
            return (response.data as IAuth); //Não sabe que data tem o formato de IAuth
        } else {
            return rejectWithValue(response);
        }

    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async() => {
        await useAuthentication().logout();
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state: IAuthSlice, action: PayloadAction<IAuth>) => {
                state.error = null;
                state.success = true;
                state.loading = false;
                state.userAuth = action.payload;
                localStorage.setItem('userAuth', JSON.stringify(state.userAuth));
            })
            .addCase(login.pending, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.loading = true;
            })
            .addCase(login.rejected, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.success = false;
                state.userAuth = null;
                state.loading = false;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
            .addCase(logout.fulfilled, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.error = null;
                state.success = true;
                state.userAuth = null;
                state.loading = false;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
            .addCase(refreshToken.fulfilled, (state: IAuthSlice, action: PayloadAction<IAuth>) => {
                state.success = true;
                state.error = null;
                state.loading = false;
                state.userAuth = action.payload;
                localStorage.setItem('userAuth', JSON.stringify(state.userAuth));
            })
            .addCase(refreshToken.rejected, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.success = false;
                state.error = action.payload;
                state.loading = false;
                state.userAuth = null;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
    }    
});

// Exportar o reducer gerado automaticamente
export default authSlice.reducer;
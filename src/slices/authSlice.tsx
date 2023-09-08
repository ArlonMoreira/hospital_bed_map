//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useAuthentication from "../hooks/useAuthentication";
//Interfaces
import { ILogin, IAuthentication, IAuth, IAuthError, IRefreshError } from "../interfaces/Authentication";

//Caso não tiver autenticado, a variável userAuth receberá valor null
const storedUserAuth:IAuth|null = localStorage.getItem('userAuth') ? JSON.parse(localStorage.getItem('userAuth')!) : null;

interface IState {
    userAuth: IAuth | null,
    successLogin: boolean,
    successLogout: boolean,
    errorMessage: string | null,
    errors: IRefreshError | IAuthError | null,
    errorLogin: boolean,
    loading: boolean
}

const initialState: IState = {
    userAuth: storedUserAuth,
    successLogin: false,
    successLogout: false,
    errorMessage: null,
    errors: null,
    errorLogin: false,
    loading: false
};

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        const userAuth: IAuth = (getState() as any).auth.userAuth;
        const newUserAuth: IAuthentication = await useAuthentication().refreshToken(userAuth);
        
        if(newUserAuth.success){
            return newUserAuth;
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
            return response;
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
    reducers: {
        hideAlert: (state: IState) => {
            state.successLogin = false;
            state.errorLogin = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state: IState, action: PayloadAction<IAuthentication>) => {
                //Success
                state.successLogin = true;
                state.successLogout = false;
                //Loading
                state.loading = false;
                //Errors
                state.errorMessage = null;
                state.errors = null;
                //userAuth
                state.userAuth = (action.payload.data as IAuth);
                localStorage.setItem('userAuth', JSON.stringify(state.userAuth));
            })
            .addCase(login.pending, (state: IState) => {
                state.loading = true;
                state.errorMessage = null;
                state.errors = null;
            })
            .addCase(login.rejected, (state: IState, action: PayloadAction<IAuthentication | unknown>) => {
                const response = (action.payload as IAuthentication);
                //Loading
                state.loading = false;
                //Errors
                state.errorMessage = response.message;
                state.errors = (response.data as IAuthError);
                state.errorLogin = true;
                //userAuth
                state.userAuth = null;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
            .addCase(logout.fulfilled, (state: IState, action: PayloadAction<boolean>) => {
                //Success
                state.successLogout = true;
                //Loading
                state.loading = false;
                //Errors
                state.errorMessage = null;
                state.errors = null;
                //userAuth
                state.userAuth = null;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
            .addCase(refreshToken.fulfilled, (state: IState, action: PayloadAction<IAuthentication>) => {
                //Success
                state.successLogout = false;
                //Loading
                state.loading = false;
                //Errors
                state.errorMessage = null;
                state.errors = null;
                //userAuth
                state.userAuth = (action.payload.data as IAuth);
                localStorage.setItem('userAuth', JSON.stringify(state.userAuth));
            })
            .addCase(refreshToken.rejected, (state: IState, action: PayloadAction<IAuthentication | unknown>) => {
                const response = (action.payload as IAuthentication);
                //Success
                state.successLogout = false;
                //Loading
                state.loading = false;
                //Errors
                if(response) {
                    state.errorMessage = response.message;
                    state.errors = (response.data as IRefreshError);
                }
                //userAuth
                state.userAuth = null;
                localStorage.removeItem('userAuth'); //Remover o token do localStore
            })
    }    
});

// Exportar o reducer gerado automaticamente
export const { hideAlert } = authSlice.actions;
export default authSlice.reducer;
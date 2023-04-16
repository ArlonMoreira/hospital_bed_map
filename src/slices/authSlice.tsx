//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useAuthentication from "../hooks/useAuthentication";
//Interfaces
import { ILogin, IAuthentication } from "../interfaces/Authentication";
import { IErrors } from "../interfaces/Errors";

const user = localStorage.getItem('user');

interface IAuthSlice {
    user: string | null,
    success: boolean | null,
    error: IErrors | null,
    loading: boolean
}

const initialState: IAuthSlice = {
    user: user ? user: null,
    success: null,
    error: null,
    loading: false
};

export const login = createAsyncThunk(
    'auth/login',
    async(data: ILogin, { rejectWithValue }) => {
        const auth = useAuthentication();

        const response = await auth.login(data);
        
        if(response?.success){
            localStorage.setItem('user', JSON.stringify(response.data)); //Incluir o token no localStorage
            return response;

        } else {
            localStorage.removeItem('user'); //Remover o token do localStore

            const error:IErrors = {
                error_message: response!.message, //! serve pra informar que sempre retornará a mensagem
                errors: {}
            };
            
            return rejectWithValue(error);
        }

    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async() => {
        const auth = useAuthentication();

        await auth.logout();
        
        localStorage.removeItem('user');
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state: IAuthSlice, action: PayloadAction<IAuthentication | undefined>) => {
                state.error = null;
                state.success = true;
                state.loading = false;
                state.user = JSON.stringify(action.payload?.data);
            })
            .addCase(login.pending, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.loading = true;
            })
            .addCase(login.rejected, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.success = false;
                state.user = null;
                state.loading = false;
            })
            .addCase(logout.fulfilled, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.error = null;
                state.success = true;
                state.user = null;
                state.loading = false;
            });
    }    
});

// Exportar o reducer gerado automaticamente
export default authSlice.reducer;
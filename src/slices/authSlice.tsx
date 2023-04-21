//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useAuthentication from "../hooks/useAuthentication";
//Interfaces
import { ILogin, IAuthentication } from "../interfaces/Authentication";

const user = JSON.parse(localStorage.getItem('user')!);

interface IAuthSlice {
    user: {
        access: string,
        refresh: string
    } | null,
    success: boolean | null,
    error: IAuthentication | null,
    loading: boolean
}

const initialState: IAuthSlice = {
    user: user ? {
        access: user.access,
        refresh: user.refresh
    }: null,
    success: null,
    error: null,
    loading: false
};

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (data: any, { getState }) => {
        const auth = useAuthentication();
        const user: IAuthentication = await auth.refreshToken((getState() as any).auth.user);
        
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async(data: ILogin, { rejectWithValue }) => {
        
        const auth = useAuthentication();

        const response = await auth.login(data);
        
        if(response?.success){
            return response;

        } else {
            return rejectWithValue(response);
        }

    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async() => {
        const auth = useAuthentication();

        await auth.logout();
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        refreshToken: () => {

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state: IAuthSlice, action: PayloadAction<IAuthentication | undefined>) => {
                state.error = null;
                state.success = true;
                state.loading = false;
                const user = action.payload?.data; // O tipo foi definido em interfaces/Authentication.ts IAuthentication
                localStorage.setItem('user', JSON.stringify(user)); //Incluir o token no localStorage
                /**
                 * Caso for sucesso IAuthentication será um objeto caso contrário será um array, porém o compilador não 
                 * pode garantir que user seja um objeto, caso não tiver essa condição !Array.isArray(user) retornará o erro:
                 * "Property 'access' does not exist on type"
                 */
                if(!Array.isArray(user)){
                    state.user = {
                        access: user!.access, //Acredita que o user pode ser undefined, então uso ! para afirmar que user jamais será undefiend
                        refresh: user!.refresh
                    }
                }
            })
            .addCase(login.pending, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.loading = true;
            })
            .addCase(login.rejected, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.success = false;
                state.user = null;
                state.loading = false;
                localStorage.removeItem('user'); //Remover o token do localStore
            })
            .addCase(logout.fulfilled, (state: IAuthSlice, action: PayloadAction<any>) => {
                state.error = null;
                state.success = true;
                state.user = null;
                state.loading = false;
                localStorage.removeItem('user'); //Remover o token do localStore
            });
    }    
});

// Exportar o reducer gerado automaticamente
export default authSlice.reducer;
//Redux
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect, useState } from 'react';
//interfcae
import { AuthHookResult } from '../interfaces/Authentication';

export const useAuth = ():AuthHookResult => {

    const [auth, setAuth] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(()=>{
        if(user){
            setAuth(true);
        } else {
            setAuth(false);
        }
    }, [user]);

    return {
        auth
    };

};
//Redux
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect, useState } from 'react';
//Interface
import { AuthHookResult } from '../interfaces/Authentication';

export const useAuth = ():AuthHookResult => {

    const [auth, setAuth] = useState<boolean>(true);
    const { userAuth } = useSelector((state: RootState) => state.auth);

    useEffect(()=>{
        if(userAuth){
            setAuth(true);
        } else {
            setAuth(false);
        }
    }, [userAuth]);

    return {
        auth
    };

};
import { createContext, useContext, useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_KEY
);

const authContext = createContext()

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState("Normal")

    useEffect(() => {

        supabase.auth.getSession().then(({ data: { session } }) => {

            const currUser = session?.user.identities[0].identity_data.full_name

            console.log(session)


            if (currUser === "ibrahim mansoor") {
                setRole("Cheif P & D")
            } else if (currUser === "Smart") {
                setRole("Executive dept official")
            }
            else if (currUser === "Hamna Arif") {
                setRole("Research Officer")
            }

            setSession(session);
            setLoading(false);
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const currUser = session?.user.identities[0].identity_data.full_name

            console.log(currUser)

            if (currUser === "ibrahim mansoor") {
                setRole("Cheif P & D")
            } else if (currUser === "Smart") {
                setRole("Executive dept official")
            }
            else if (currUser === "Hamna Arif") {
                setRole("Research Officer")
            }

            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();

    }, [])

    return (
        <authContext.Provider value={{ session, supabase, loading, role }} >
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(authContext)
}
import AuthComponent from "@/components/auth";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";

export default function Auth({ user, data }) {
    const [userData, setUserData] = React.useState(data[0] || {
        id: user.id,
        username: '',
    });
    const supabase = useSupabaseClient();
    if (user) {
        const updateData = async () => {
            setUserData({ ...userData, edited: true, updated_at: new Date().toUTCString() });
            const { error } = await supabase.from('accounts').update(userData).eq('id', user.id);
            if (error) {
                toast.error(error.message);
            }
            toast.success('Updated to ' + userData.username);
        }
        return <div className="p-5 m-6">
            <h1 className="text-2xl">Logged in as {(data.username) ? data.username : user.email}</h1>
            <div
                className="bg-gray-50 border-radius-4 border-2 border-black p-2 my-2"
            >
                <p className="text-lg">Update username</p>
                <input
                    className="border-2 border-black p-2 m-2"
                    type="text" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                <p></p>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={updateData}>Update</button>
            </div>
        </div>
    }
    return <AuthComponent />;
}

export const getServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient(context);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        const { data } = await supabase.from('accounts').select('*').eq('id', session.user.id);
        return {
            // redirect: {
            //     destination: "/",
            //     permanent: false,
            // },
            props: {
                intialSession: session,
                user: session.user,
                data: data,
            },
        };
    }
}
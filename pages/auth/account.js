import AuthComponent from "@/components/auth";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Auth({ user, data, pastes }) {
    const supabase = useSupabaseClient();
    const [userData, setUserData] = React.useState(data[0] || {
        id: user.id,
        username: '',
    });
    const updateData = async () => {
        setUserData({ ...userData, edited: true, updated_at: new Date() });
        const { error } = await supabase.from('accounts').update(userData).eq('id', user.id);
        if (error) {
            toast.error(error.message);
        }
        toast.success('Updated to ' + userData.username);
    }
    if (user) {
        data = data[0] || {};
        return <div className="p-5 m-6">
            <h1 className="text-2xl">Logged in as {(data.username) ? data.username : user.email}</h1>
            <div
                className="border-radius-4 border-2 border-black p-5 my-2"
            >
                <h1 className="text-2xl">
                    Welcome <span className="text-blue-800 font-bold underline decoration-red-300">{data.full_name}</span>!
                </h1>
                <p className="py-2">
                    It{`'`}s not been the same without you.
                </p>
                {
                    (data.username) ? (
                        <p className="py-2">
                            Your username is <span className="text-blue-800 font-bold underline decoration-red-300">{data.username}</span>.
                        </p>
                    ) : (
                            <div>
                                <p className="py-2">
                                    You don{`'`}t have a username yet.
                                    Wanna set one up?
                                </p>
                                <input
                                    className="border-2 border-black p-2 m-2"
                                    type="text" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                                <button className="bg-red-400 border-black border-2 p-2" onClick={updateData}>Update</button>
                            </div>
                    )
                }
                <button className="bg-red-400 border-black border-2 p-2" onClick={() => {
                    supabase.auth.signOut()
                }}>
                    <Link href="">
                        Sign Out
                    </Link>
                </button>
            </div>
            <div>
                <h1 className="text-2xl">
                    Your Pastes
                </h1>
                <div className="border-radius-4 border-2 border-black p-5 my-2">
                    {
                        (pastes.length > 0) ? (
                            pastes.map((paste) => {
                                return <div
                                    key={paste.id}
                                    className="border-radius-4 border-2 border-black p-5 my-2">
                                    <h1 className="text-2xl">
                                        {paste.title}
                                    </h1>
                                    <p className="py-2">
                                        {paste.content}
                                    </p>
                                    <p className="py-2">
                                        {paste.lang}
                                    </p>
                                    <p className="py-2">
                                        {paste.created_at}
                                    </p>
                                    <p className="py-2">
                                        {paste.author}
                                    </p>
                                </div>
                            })
                        ) : (
                            <p className="py-2">
                                You don{`'`}t have any pastes yet.
                            </p>
                        )
                    }
                </div>
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
        const pastes = await supabase.from('paste').select('*').eq('author', data[0].username);
        console.log(pastes);
        console.log(data[0].username)
        return {
            props: {
                intialSession: session,
                user: session.user,
                data: data,
                pastes: pastes.data,
            },
        };
    }
    return {
        redirect: {
            destination: "login",
            permanent: false,
        },
    };
}
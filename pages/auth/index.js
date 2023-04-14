import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Auth() {
    return <>
        <p>
            Loading Your Account...
        </p>
    </>
}

export const getServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient(context);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        return {
            redirect: {
                destination: "auth/account",
                permanent: false,
            },
        };
    }
    return {
        redirect: {
            destination: "auth/login",
            permanent: false,
        },
    };
}
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Router from 'next/router'
import Head from 'next/head'
import React from 'react'

const AuthComponent = () => {
    const session = useSession()
    const supabase = useSupabaseClient()

    React.useEffect(() => {
        if (session) {
            Router.push('/auth/account')
        }
    }, [session])

    return (
        <div className="p-10 m-5">
            <Head>
                <title>Login to See this page</title>
            </Head>
            {!session ? (
                <Auth supabaseClient={supabase} appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: 'green',
                                brandAccent: 'darkgreen',
                            },
                        },
                    },
                }}
                    theme="auto"
                    providers={['phone', 'github']}
                    socialLayout="vertical"
                    socialButtonSize="xlarge"
                    redirectTo='auth'
                />
            ) : (
                    <>
                        <h1 className="text-2xl">Logged in as {session.user.email}</h1>
                        <button className="bg-red-400 border-black border-2 p-2" onClick={() => {
                            supabase.auth.signOut()
                        }}>
                            Sign Out
                        </button>
                </>
            )}
        </div>
    )
}

export default AuthComponent
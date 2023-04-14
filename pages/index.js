import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { supabase } from '@/utils/db'
import React from 'react';
import { toast } from 'react-toastify';

export default function Index({ user, account }) {
    const [data, setData] = React.useState({
        title: 'Untitled',
        author: (account)?(account[0].username):'',
        content: '',
        lang: '',
        private: false,
    });
    const handleSubmit = async () => {
        const { sup_data, error } = await supabase
            .from('paste')
            .insert([
                {
                    title: data.title,
                    author: data.author,
                    content: data.content,
                    lang: data.lang,
                    private: data.private,
                },
            ])
            .single();
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Paste Created');
            setData({
                title: 'Untitled',
                author: (account) ? (account[0].username) : '',
                content: '',
                lang: '',
                private: false,
            });
        }
    };
    return (
        <div>
            <h1 className="text-center">
                NoobPaste
            </h1>
            <div className='mx-10'>
                <h2 className="text-center">
                    Paste Content
                </h2>
                <textarea
                    style={{
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                    }}
                    className='
                    border-2 border-black rounded-md
                    p-1
                    my-3
                    w-full
                    h-96
                    '
                    name="content"
                    value={data.content}
                    onChange={(e) =>
                        setData({ ...data, content: e.target.value })
                    }
                />
            </div>
            <div
                style={{
                    backgroundColor: 'var(--theme-color)',
                }}
                className='
                m-10 p-5 
                flex flex-col justify-center items-centers
                border-2 border-black rounded-md
                '
            >
                <h2
                className='text-center py-2'
                >
                    Paste Meta Data
                </h2>
                <p className=''>
                    Title
                </p>
                <input
                    className='
                    border-2 border-black rounded-md
                    p-1
                    my-3
                    '
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={(e) =>
                        setData({ ...data, title: e.target.value })
                    }
                />
                <p>
                    Author
                </p>
                <input
                    className='
                    border-2 border-black rounded-md
                    p-1
                    my-3
                    '
                    type="text"
                    name="author"
                    value={data.author}
                    onChange={(e) =>
                        setData({ ...data, author: e.target.value })
                    }
                />
                <p>
                    Language
                </p>
                <select value={data.lang}
                    className='
                    border-2 border-black rounded-md
                    p-1
                    my-3
                    '
                    onChange={(e) => {
                    setData({ ...data, lang: e.target.value });
                    }}>
                    <option defaultChecked value="text">Text</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                </select>
                <p>
                    Private
                </p>
                <select value={data.private}
                    className='
                    border-2 border-black rounded-md
                    p-1
                    my-3
                    '
                    onChange={(e) => {
                        setData({ ...data, private: e.target.value });
                    }}>
                    <option value="true">True</option>
                    <option defaultChecked value="false">False</option>
                </select>
                <div className='text-center'>
                    <p>
                        By clicking submit you agree to our terms and conditions
                    </p>
                    <button
                        className='
                    bg-red-600
                    text-white
                    border-2 border-black rounded-md
                    p-3
                    my-3
                    w-1/2
                    '
                    onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {

    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session)
        return {
            props: {
                initialSession: null,
                user: null,
            }
        }
    const { data } = await supabase.from('accounts').select('*').eq('id', session.user.id);
    return {
        props: {
            initialSession: session,
            user: session.user,
            account: data,
        },
    }
}
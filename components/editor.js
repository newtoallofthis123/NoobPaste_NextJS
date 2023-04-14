import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";

const Highlight = ({ children, language }) => {
    const codeRef = useRef(null);
    useEffect(() => {
        hljs.highlightBlock(codeRef.current);
    }, [language]);

    return (
        <pre
            className={`hljs ${language}`}
        >
            <code ref={codeRef} className={`language-${language}`}>
                {children}
            </code>
        </pre>
    );
};

export default Highlight;

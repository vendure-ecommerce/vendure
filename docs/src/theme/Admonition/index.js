import React from 'react';
import Admonition from '@theme-original/Admonition';
import Link from '@docusaurus/Link';

export default function AdmonitionWrapper(props) {
    if (props.type !== 'cli') {
        return <Admonition {...props} />;
    }
    return (
        <Admonition
            icon={<CliIcon />}
            title={'Vendure CLI'}
            {...props}
            children={
                <>
                    {props.children}
                    <div style={{ fontSize: '12px' }}>
                        Learn more about the <Link href={'/guides/developer-guide/cli/'}>Vendure CLI</Link>
                    </div>
                </>
            }
        />
    );
}

function CliIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            style={{ fill: 'rgb(8 32 41)', stroke: '#fff' }}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
            />
        </svg>
    );
}

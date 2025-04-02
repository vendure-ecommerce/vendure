import Link from '@docusaurus/Link';
import AdmonitionLayout from '@theme-original/Admonition/Layout';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import React from 'react';

function CliAdmonition(props) {
    return (
        <AdmonitionLayout {...props} className="alert alert--info">
            {props.children}
            <div style={{ fontSize: '12px' }}>
                Learn more about the <Link href={'/guides/developer-guide/cli/'}>Vendure CLI</Link>
            </div>
        </AdmonitionLayout>
    );
}

const AdmonitionTypes = {
    ...DefaultAdmonitionTypes,

    // Add all your custom admonition types here...
    // You can also override the default ones if you want
    cli: CliAdmonition,
};

export default AdmonitionTypes;

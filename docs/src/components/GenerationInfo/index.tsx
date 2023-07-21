import React from 'react';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NpmLogo = require('@site/static/img/npm-logo.svg').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GitHubLogo = require('@site/static/img/github-icon.svg').default;

export default function MemberInfo(props: {
    packageName: string;
    sourceFile: string;
    sourceLine: number;
    since?: string;
    experimental?: boolean;
}) {
    return (
        <div className={styles.wrapper}>
            <a
                href={`https://www.npmjs.com/package/${props.packageName}`}
                target="_blank"
                className={styles.label}
            >
                <NpmLogo style={{ width: '24px', height: '12px' }} />
                <span>{props.packageName}</span>
            </a>
            <a
                href={`https://github.com/vendure-ecommerce/vendure/blob/master/${props.sourceFile}#L${props.sourceLine}`}
                target="_blank"
                className={styles.label}
            >
                <GitHubLogo style={{ width: '12px', height: '12px' }} />
                <span>{props.sourceFile.split('/').pop()}</span>
            </a>
            {props.since && (
                <div className="badge badge--warning" title={`This API was added in v${props.since}`}>
                    <div className="">v{props.since}</div>
                </div>
            )}
            {props.experimental && (
                <div
                    className="badge badge--info"
                    title="This API is experimental and may change in a future release"
                >
                    <div className="">experimental</div>
                </div>
            )}
        </div>
    );
}

import React from 'react';

export default function MemberInfo(props: {
    packageName: string;
    sourceFile: string;
    sourceLine: number;
    since?: string;
    experimental?: boolean;
}) {
    return (
        <div className="generation-info flex flex-wrap">
            <span className="label">Package:</span>{' '}
            <a href={`https://www.npmjs.com/package/${props.packageName}`}>{props.packageName}</a>
            <span className="label file">File:</span>
            <a
                href={`https://github.com/vendure-ecommerce/vendure/blob/master/${props.sourceFile}#L${props.sourceLine}`}
            >
                {props.sourceFile.split('/').pop()}
            </a>
            {props.since && (
                <div
                    className="flex ml-2 bg-yellow-100 px-1 rounded-sm"
                    title={`This API was added in v${props.since}`}
                >
                    <div className="text-yellow-700">v{props.since}</div>
                </div>
            )}
            {props.experimental && (
                <div
                    className="since ml-2 bg-yellow-100 px-2 rounded-sm"
                    title="This API is experimental and may change in a future release"
                >
                    <div className="text-yellow-700">experimental</div>
                </div>
            )}
        </div>
    );
}

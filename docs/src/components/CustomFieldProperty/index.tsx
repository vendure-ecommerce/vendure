import React from 'react';

import styles from './styles.module.css';

export default function CustomFieldProperty(props: { required: boolean; type: string; typeLink?: string }) {
    return (
        <div className={styles.wrapper}>
            <div>
                {props.required ? (
                    <span className="badge badge--primary">Required</span>
                ) : (
                    <span className="badge badge--secondary">Optional</span>
                )}
            </div>
            <div>
                {props.typeLink ? (
                    <a href={props.typeLink}>
                        <code>{props.type}</code>
                    </a>
                ) : (
                    <code>{props.type}</code>
                )}
            </div>
        </div>
    );
}

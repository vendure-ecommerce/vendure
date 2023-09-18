import React from 'react';
import Link from '@theme-original/DocSidebarItem/Link';
import styles from './styles.module.css';

export default function LinkWrapper(props) {
    const icon = props.item.customProps?.icon;
    const isTopLevel = props.level === 1;
    return (
        <div className={styles.linkWrapper} style={{ marginBottom: isTopLevel ? '8px' : 0 }}>
            {icon ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={props.item.customProps?.viewBox ?? '0 0 20 20'}
                    fill="currentColor"
                    className={styles.linkIcon}
                    dangerouslySetInnerHTML={{ __html: icon }}
                ></svg>
            ) : null}
            <div style={{ flex: 1 }}>
                <Link {...props} />
            </div>
        </div>
    );
}

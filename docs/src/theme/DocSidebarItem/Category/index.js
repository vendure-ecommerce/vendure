import React from 'react';
import Category from '@theme-original/DocSidebarItem/Category';
import styles from './styles.module.css';

export default function CategoryWrapper(props) {
    const icon = props.item.customProps?.icon;
    const isTopLevel = props.level === 1;
    return (
        <div className={styles.categoryWrapper} style={{ marginBottom: isTopLevel ? '8px' : 0 }}>
            {icon ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={props.item.customProps?.viewBox ?? '0 0 20 20'}
                    fill="currentColor"
                    className={styles.categoryIcon}
                    dangerouslySetInnerHTML={{ __html: icon }}
                ></svg>
            ) : null}
            <div className={styles.categoryName}>
                <Category {...props} />
            </div>
        </div>
    );
}

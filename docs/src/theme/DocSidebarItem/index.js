import React from 'react';
import DocSidebarItem from '@theme-original/DocSidebarItem';
import styles from './styles.module.css';

export default function DocSidebarItemWrapper(props) {
    return (
        <div>
            <DocSidebarItem {...props} />
        </div>
    );
}

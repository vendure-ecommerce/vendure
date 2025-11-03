import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import CopyMarkdownButton from '@site/src/components/CopyMarkdownButton';
import styles from './styles.module.css';

export default function DocBreadcrumbsWrapper(props) {
  return (
    <div className={styles.breadcrumbsContainer}>
      <DocBreadcrumbs {...props} />
      <CopyMarkdownButton />
    </div>
  );
}

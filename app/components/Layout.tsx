import Head from 'next/head';
import React from 'react';
import styles from './Layout.module.scss';

export const Layout: React.FC = ({
  children,
  home
}: {
  children: React.ReactNode,
  home?: boolean
}) => {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="UTF-8" />
        <title>Ruby on Rails tutorial</title>
      </Head>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

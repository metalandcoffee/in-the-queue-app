import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import clientPromise from '../lib/mongodb';

export default function Home({albums}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>In The Queue</title>
        <meta name="description" content="Track your music listening!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>In The Queue</h1>
      </header>
      <main className={styles.main}>
      <div>
        {albums.map((user, index) => {
          return (
            <div className="card" key={index}>
              <h2>{user.name}</h2>
              <p>{user.album}</p>
              <p>{user.status}</p>
            </div>
          );
        })}
      </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {
  const client = await clientPromise;

  const db = client.db('metal-albums');

  let albums = await db.collection('albums').find({}).toArray();
  albums = JSON.parse(JSON.stringify(albums));

  return {
    props: { albums },
  };
}
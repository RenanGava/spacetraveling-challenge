/* eslint-disable prettier/prettier */
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { GetStaticProps } from 'next';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';


import styles from './home.module.scss';
// eslint-disable-next-line import/order
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(
  { postsPagination: { next_page, results }, }: HomeProps): JSX.Element {


  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  async function handleGetMorePosts(): Promise<void>{
    const response = await (await fetch(nextPage)).json()
    setPosts([...posts, ...response.results])
    setNextPage(response.next_page)
  }


  return (
    <div className={styles.container}>
      {posts.map(post => {
        return (
          <div>
            <Link href={`/post/${post.uid}`}>
              <a>
                <div>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <time>
                    <FiCalendar /> {format(
                      parseISO(post.first_publication_date),
                        'dd MMM yyyy',
                        {
                          locale: ptBR
                        }
                    )}
                  </time>
                  <span>
                    <FiUser /> {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        );
      })}

      {nextPage && (
        <button
        onClick={handleGetMorePosts}
        type='button'
        className={styles.morePosts}>
            <a>carregar mais Posts</a>
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  console.log(postsResponse);


  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};

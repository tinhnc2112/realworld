import style from './FeedContent.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { apiGeneral, token, articles } from '~/components/common/common.js';
import { Link } from 'react-router-dom';

const cl = classNames.bind(style);

function FeedContent() {
   const [article, setArticle] = useState({});
   const [favorite, setFavorite] = useState();
   useEffect(() => {
      async function getData() {
         if (token) {
            const res = await axios.get(`${articles}?limit=20&offset=0`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            setArticle(res.data.articles);
         } else {
            const res = await axios.get(`${articles}?limit=20&offset=0`);
            setArticle(res.data.articles);
         }
      }
      getData();
   }, [favorite]);

   async function handleFavorite(slug, favorited) {
      if (favorited === false) {
         const res = await fetch(`${apiGeneral}/articles/${slug}/favorite`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         });
         setFavorite(res);
      } else {
         const res = await fetch(`${apiGeneral}/articles/${slug}/favorite`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'text/plain',
               Authorization: `Bearer ${token}`,
            },
         });
         setFavorite(res);
      }
   }

   return (
      article &&
      article.length > 0 &&
      article.map((data, index) => (
         <div key={index} className={cl('content')}>
            <div className={cl('head')}>
               <div className={cl('head_1', 'flex')}>
                  <img className={cl('avatar')} src={data.author.image} alt="avatar" />
                  <div className={cl('info')}>
                     <Link
                        className={cl('name')}
                        to={{
                           pathname: `profile`,
                           search: `?id=${data.author.username}`,
                        }}
                     >
                        {data.author.username}
                     </Link>
                     <span className={cl('create-time')}>{data.createdAt}</span>
                  </div>
               </div>
               {data.favorited === false ? (
                  <div className={cl('favorites')}>
                     <button onClick={() => handleFavorite(data.slug, data.favorited)}>
                        <FontAwesomeIcon className={cl('icon')} icon={faHeart} />
                        {data.favoritesCount}
                     </button>
                  </div>
               ) : (
                  <div className={cl('favorites_active')}>
                     <button onClick={() => handleFavorite(data.slug, data.favorited)}>
                        <FontAwesomeIcon className={cl('icon')} icon={faHeart} />
                        {data.favoritesCount}
                     </button>
                  </div>
               )}
            </div>
            <div className={cl('body')}>
               <Link
                  to={{
                     pathname: `/article`,
                     search: `?id=${data.slug}`,
                  }}
               >
                  <h2 className={cl('body_title')}>{data.title}</h2>
               </Link>
               <p className={cl('body_desc')}>{data.description}</p>
            </div>
            <div className={cl('footer', 'flex')}>
               <span>Read more...</span>
               <ul className={cl('tag_list')}>
                  {data.tagList.map((tag, index) => (
                     <li key={index} className={cl('tag_default')}>
                        {tag}
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      ))
   );
}

export default FeedContent;

import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './RowContent.module.scss';
import 'antd/dist/antd.min.css';
import { Col, Row } from 'antd';
import FeedContent from '~/components/Layout/components/FeedContent';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiGeneral, articles, token } from '~/components/common/common';
import YourFeed from '~/components/Layout/components/YourFeed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const cl = classNames.bind(style);

function RowContent() {
   const [article, setArticle] = useState({});
   const [favorite, setFavorite] = useState();
   const [tags, setTags] = useState({});
   const [state, setState] = useState();
   const [tag, setTag] = useState();
   const [navLink, setNavLink] = useState([
      { id: 1, text: 'Your feed' },
      { id: 2, text: 'Global feed' },
   ]);
   const [activeId, setActiveId] = useState(2);

   useEffect(() => {
      async function getData() {
         const fetch = await axios.get(`${apiGeneral}/tags`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setTags(fetch.data.tags);
      }
      getData();
   }, [state]);

   async function handleTag(tag) {
      setNavLink([
         { id: 1, text: 'Your feed' },
         { id: 2, text: 'Global feed' },
         { id: 3, text: `#${tag}` },
      ]);
      setActiveId(3);
      setTag(tag);
      setState(fetch);
   }

   useEffect(() => {
      async function getData() {
         if (token) {
            const res = await axios.get(`${articles}?tag=${tag}&limit=20&offset=0?limit=20&offset=0`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            setArticle(res.data.articles);
         } else {
            const res = await axios.get(`${articles}?tag=${tag}&limit=20&offset=0?limit=20&offset=0`);
            setArticle(res.data.articles);
         }
         console.log('tag');
      }
      getData();
   }, [favorite, tag]);

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
      <Row className={cl('row')}>
         <Col span={3}></Col>
         <Col className={cl('container')} span={14}>
            <div>
               <ul className={cl('feed_toggle')}>
                  {navLink.map((value, i) => (
                     <li
                        key={i}
                        className={cl(activeId === value.id ? 'active' : '')}
                        onClick={() => setActiveId(value.id)}
                     >
                        <Link to={'/'}>{value.text}</Link>
                     </li>
                  ))}
               </ul>
            </div>
            {activeId === 1 && <YourFeed></YourFeed>}
            {activeId === 2 && <FeedContent></FeedContent>}
            {activeId === 3 &&
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
                              <li key={index} className={cl('tag_item')}>
                                 {tag}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               ))}
         </Col>
         <Col span={4}>
            <div className={cl('tag')}>
               <p className={cl('head')}>Popular tags</p>
               <div className={cl('tag_popular')}>
                  {tags &&
                     tags.length > 0 &&
                     tags.map((tag, index) => (
                        <p className={cl('tag_default')} key={index} onClick={() => handleTag(tag)}>
                           {tag}
                        </p>
                     ))}
               </div>
            </div>
         </Col>
         <Col span={3}></Col>
      </Row>
   );
}

export default RowContent;

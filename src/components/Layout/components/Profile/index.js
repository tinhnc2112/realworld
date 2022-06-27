import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Profile.module.scss';
import 'antd/dist/antd.min.css';
import { Col, Row } from 'antd';
import { useEffect, useState, createContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import { token, account, apiGeneral, articles } from '~/components/common/common';

const cl = classNames.bind(style);
export const SlugContext = createContext();

function Profile() {
   const [searchParams] = useSearchParams();
   const username = searchParams.get('id');
   const [article, setArticle] = useState({});
   const [user, setUser] = useState({});
   const [favoriteUser, setFavoriteUser] = useState();
   const [favorite, setFavorite] = useState();

   const values = [
      { id: 1, text: 'My post' },
      { id: 2, text: 'Favorited post' },
   ];
   const [activeId, setActiveId] = useState(1);

   useEffect(() => {
      async function getData() {
         const fetch = await axios.get(`${articles}?author=${username}&limit=20&offset=0`, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         });
         setArticle(fetch.data.articles);
      }
      getData();
   }, [favorite]);

   useEffect(() => {
      async function getData() {
         const fetch = await axios.get(`${apiGeneral}/profiles/${username}`, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         });
         setUser(fetch.data.profile);
      }
      getData();
   }, []);

   useEffect(() => {
      async function getFavoritedByUser() {
         const fetch = await axios.get(`${articles}?favorited=${username}`, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         });
         setFavoriteUser(fetch.data.articles);
      }
      getFavoritedByUser();
   }, []);

   async function handleFavorite(slug) {
      const favoriteData = await axios.get(`${articles}/${slug}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      if (favoriteData.data.article.favorited === false) {
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

   async function handleFollow(user, following) {
      if (following === false) {
         const res = await fetch(`${apiGeneral}/profiles/${user}/follow`, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         return res.json();
      } else {
         await axios.delete(`${apiGeneral}/profiles/${user}/follow`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
      }
   }

   return (
      <div>
         {user && (
            <div>
               <div className={cl('user_info')}>
                  <div className={cl('content')}>
                     <div>
                        <img className={cl('avatar')} src={user.image} alt="avatar" />
                        <h4 className={cl('username')}>{user.username}</h4>
                        <span>{user.bio}</span>
                     </div>
                     <div className={cl('edit-btn', 'flex')}>
                        {user.username === account ? (
                           <button>
                              <Link to={'/setting'}>
                                 <FontAwesomeIcon icon={faGear} className={cl('mr-3')} />
                                 Edit Profile Setting
                              </Link>
                           </button>
                        ) : (
                           <>
                              {user.following === false ? (
                                 <div className={cl('follow_btn')}>
                                    <button onClick={(e) => handleFollow(user.username, user.following)}>
                                       <FontAwesomeIcon className={cl('icon')} icon={faPlus}></FontAwesomeIcon>
                                       follow {user.username}
                                    </button>
                                 </div>
                              ) : (
                                 <div className={cl('unfollow_btn')}>
                                    <button onClick={(e) => handleFollow(user.username, user.following)}>
                                       <FontAwesomeIcon className={cl('icon')} icon={faPlus}></FontAwesomeIcon>
                                       unfollow {user.username}
                                    </button>
                                 </div>
                              )}
                           </>
                        )}
                     </div>
                  </div>
               </div>

               <Row className={cl('row')}>
                  <Col span={3}></Col>
                  <Col className={cl('container')} span={16}>
                     <div>
                        <ul className={cl('feed_toggle')}>
                           {values.map((value, i) => (
                              <li
                                 key={i}
                                 className={cl(activeId === value.id ? 'active' : '')}
                                 onClick={() => setActiveId(value.id)}
                              >
                                 <Link
                                    to={{
                                       pathname: `/profile`,
                                       search: `?id=${user.username}`,
                                    }}
                                 >
                                    {value.text}
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className={cl('content')}>
                        {activeId === 1 && (
                           <div>
                              {article &&
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
                                                      pathname: `/profile`,
                                                      search: `?id=${user.username}`,
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
                                             <li className={cl('tag_default')}>implementations</li>
                                          </ul>
                                       </div>
                                    </div>
                                 ))}
                           </div>
                        )}
                        {activeId === 2 && (
                           <div>
                              {favoriteUser &&
                                 favoriteUser.length > 0 &&
                                 favoriteUser.map((data, index) => (
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
                                 ))}
                           </div>
                        )}
                     </div>
                  </Col>
                  <Col span={5}></Col>
               </Row>
            </div>
         )}
      </div>
   );
}

export default Profile;

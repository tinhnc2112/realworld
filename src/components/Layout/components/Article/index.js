import { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import classNames from 'classnames/bind';
import style from './Article.module.scss';
import axios from 'axios';
import { apiGeneral, articles } from '~/components/common/common';
import { Link, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPencil, faPlus, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { account, token } from '~/components/common/common';

const cl = classNames.bind(style);

function Article() {
   const [searchParams] = useSearchParams();
   const slug = searchParams.get('id');

   const [user, setUser] = useState();
   const [article, setArticle] = useState();
   const [comments, setComments] = useState([]);
   const [comment, setComment] = useState();

   useEffect(() => {
      async function getUser() {
         const fetch = await axios.get(`${apiGeneral}/user`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setUser(fetch.data.user);
      }
      getUser();
   }, []);

   useEffect(() => {
      async function getData() {
         const fetch = await axios.get(`${articles}/${slug}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setArticle(fetch.data.article);
      }
      getData();
   }, [slug]);

   useEffect(() => {
      async function getComment() {
         const fetch = await axios.get(`${articles}/${slug}/comments`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setComments(fetch.data.comments);
         console.log('re-render');
      }
      getComment();
   }, [comment]);

   async function handleDeleteArticle() {
      await axios.delete(`${articles}/${slug}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
   }
   async function handleFavorite(slug, favorited) {
      if (favorited === false) {
         const res = await fetch(`${apiGeneral}/articles/${slug}/favorite`, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         return res.json();
      } else {
         await axios.delete(`${apiGeneral}/articles/${slug}/favorite`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
      }
   }

   async function handleFollow(user, following) {
      if (following === false) {
         await fetch(`${apiGeneral}/profiles/${user}/follow`, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
      } else {
         await axios.delete(`${apiGeneral}/profiles/${user}/follow`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
      }
   }

   async function handlePostComment() {
      const comment = document.querySelector('.comment').value;
      const body = { body: comment };
      const fetch = await axios.post(
         `${articles}/${slug}/comments`,
         { comment: body },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         },
      );
      setComment(fetch);
      document.querySelector('.comment').value = '';
   }

   async function handleDeleteComment(id) {
      const fetch = await axios.delete(`${articles}/${slug}/comments/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      setComment(fetch);
   }

   return (
      <div>
         {article && (
            <div>
               <div className={cl('slider', 'flex')}>
                  <div className={cl('slider_container')}>
                     <div>
                        <h1>{article.title}</h1>
                        <div className={cl('head_1', 'flex')}>
                           <div className={cl('flex', 'center')}>
                              <img className={cl('avatar')} src={article.author.image} alt="avatar" />
                              <div className={cl('info')}>
                                 <Link
                                    className={cl('name')}
                                    to={{
                                       pathname: `/profile`,
                                       search: `?id=${article.author.username}`,
                                    }}
                                 >
                                    {article.author.username}
                                 </Link>
                                 <span className={cl('create_time')}>{article.createdAt}</span>
                              </div>
                           </div>
                           {account === article.author.username ? (
                              <>
                                 <Link
                                    className={cl('edit_btn')}
                                    to={{
                                       pathname: `/editor`,
                                       search: `?id=${article.slug}`,
                                    }}
                                 >
                                    <FontAwesomeIcon className={cl('icon')} icon={faPencil}></FontAwesomeIcon>
                                    Edit Article
                                 </Link>
                                 <Link
                                    className={cl('delete_btn')}
                                    to={`/profile/${account}`}
                                    onClick={handleDeleteArticle}
                                 >
                                    <FontAwesomeIcon className={cl('icon')} icon={faTrash}></FontAwesomeIcon>Delete
                                    Article
                                 </Link>
                              </>
                           ) : (
                              <>
                                 {article.author.following === false ? (
                                    <div className={cl('follow_btn')}>
                                       <button
                                          onClick={(e) =>
                                             handleFollow(article.author.username, article.author.following)
                                          }
                                       >
                                          <FontAwesomeIcon className={cl('icon')} icon={faPlus}></FontAwesomeIcon>
                                          follow {article.author.username}
                                       </button>
                                    </div>
                                 ) : (
                                    <div className={cl('unfollow_btn')}>
                                       <button
                                          onClick={(e) =>
                                             handleFollow(article.author.username, article.author.following)
                                          }
                                       >
                                          <FontAwesomeIcon className={cl('icon')} icon={faPlus}></FontAwesomeIcon>
                                          unfollow {article.author.username}
                                       </button>
                                    </div>
                                 )}

                                 {article.favorited === false ? (
                                    <div className={cl('favorites')}>
                                       <button onClick={() => handleFavorite(article.slug, article.favorited)}>
                                          <FontAwesomeIcon className={cl('icon')} icon={faHeart}></FontAwesomeIcon>
                                          Favorite Article ({article.favoritesCount})
                                       </button>
                                    </div>
                                 ) : (
                                    <div className={cl('favorites_active')}>
                                       <button onClick={() => handleFavorite(article.slug, article.favorited)}>
                                          <FontAwesomeIcon className={cl('icon')} icon={faHeart}></FontAwesomeIcon>
                                          Unfavorite Article ({article.favoritesCount})
                                       </button>
                                    </div>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
               <Row>
                  <Col span={3}></Col>
                  <Col span={18}>
                     <div className={cl('content')}>
                        <p>{article.body}</p>
                        <div className={cl('tag_popular')}>
                           {article.tagList.map((tag, index) => (
                              <span className={cl('tag_default')} key={index}>
                                 {tag}
                              </span>
                           ))}
                        </div>
                     </div>
                     <hr />
                     <div className={cl('flex', 'mt24', 'mb48')}>
                        <div className={cl('head_1', 'm_auto', 'flex')}>
                           <img className={cl('avatar')} src={article.author.image} alt="avatar" />
                           <div className={cl('info')}>
                              <Link
                                 className={cl('name', 'green')}
                                 to={{
                                    pathname: `/profile`,
                                    search: `?id=${article.author.username}`,
                                 }}
                              >
                                 {article.author.username}
                              </Link>
                              <span className={cl('create_time')}>{article.createdAt}</span>
                           </div>
                           {account === article.author.username ? (
                              <>
                                 <Link
                                    className={cl('edit_btn')}
                                    to={{
                                       pathname: `/editor`,
                                       search: `?id=${article.slug}`,
                                    }}
                                 >
                                    <FontAwesomeIcon className={cl('icon')} icon={faPencil}></FontAwesomeIcon>
                                    Edit Article
                                 </Link>
                                 <Link
                                    className={cl('delete_btn')}
                                    to={`/profile/${account}`}
                                    onClick={handleDeleteArticle}
                                 >
                                    <FontAwesomeIcon className={cl('icon')} icon={faTrash}></FontAwesomeIcon>Delete
                                    Article
                                 </Link>
                              </>
                           ) : (
                              <>
                                 {article.author.following === false ? (
                                    <div>
                                       <button
                                          className={cl('edit_btn')}
                                          onClick={(e) =>
                                             handleFollow(article.author.username, article.author.following)
                                          }
                                       >
                                          <FontAwesomeIcon className={cl('icon')} icon={faPlus}></FontAwesomeIcon>
                                          follow {article.author.username}
                                       </button>
                                    </div>
                                 ) : (
                                    <div>
                                       <button
                                          className={cl('edit_btn')}
                                          onClick={(e) =>
                                             handleFollow(article.author.username, article.author.following)
                                          }
                                       >
                                          <FontAwesomeIcon className={cl('icon')} icon={faPlus}></FontAwesomeIcon>
                                          unfollow {article.author.username}
                                       </button>
                                    </div>
                                 )}

                                 {article.favorited === false ? (
                                    <div className={cl('favorites')}>
                                       <button onClick={() => handleFavorite(article.slug, article.favorited)}>
                                          <FontAwesomeIcon className={cl('icon')} icon={faHeart}></FontAwesomeIcon>
                                          Favorite Article ({article.favoritesCount})
                                       </button>
                                    </div>
                                 ) : (
                                    <div className={cl('favorites_active')}>
                                       <button onClick={() => handleFavorite(article.slug, article.favorited)}>
                                          <FontAwesomeIcon className={cl('icon')} icon={faHeart}></FontAwesomeIcon>
                                          Unfavorite Article ({article.favoritesCount})
                                       </button>
                                    </div>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                     {/* user */}
                     <div className={cl('form_input_comment')}>
                        <textarea className={cl('comment')} placeholder="Write a comment..."></textarea>
                        {user && (
                           <div className={cl('form_footer_body')}>
                              <img className={cl('avatar')} src={user.image} alt="avatar" />
                              <button className={cl('post_btn')} onClick={() => handlePostComment()}>
                                 Post Comment
                              </button>
                           </div>
                        )}
                     </div>
                     <div>
                        {comments &&
                           comments.map((comment, i) => (
                              <div key={i} className={cl('form_comment')}>
                                 <p>{comment.body}</p>
                                 <div className={cl('form_footer')}>
                                    <div className={cl('info')}>
                                       <img className={cl('avatar_s')} src={comment.author.image} alt="avatar" />
                                       <Link
                                          className={cl('name_s', 'green')}
                                          to={{
                                             pathname: `/profile`,
                                             search: `?id=${article.author.username}`,
                                          }}
                                       >
                                          {comment.author.username}
                                       </Link>
                                       <span className={cl('create_time')}>{article.createdAt}</span>
                                    </div>
                                    {comment.author.username === user.username && (
                                       <div>
                                          <button
                                             className={cl('delete_cm_btn')}
                                             onClick={() => handleDeleteComment(comment.id)}
                                          >
                                             <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                     </div>
                  </Col>
                  <Col span={3}></Col>
               </Row>
            </div>
         )}
      </div>
   );
}

export default Article;

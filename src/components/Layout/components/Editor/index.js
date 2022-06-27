import { Col, Row } from 'antd';
import classNames from 'classnames/bind';
import style from './Editor.module.scss';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { articles, token } from '~/components/common/common';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cl = classNames.bind(style);

function Editor() {
   const [searchParams] = useSearchParams();
   const slug = searchParams.get('id');
   const [article, setArticle] = useState();
   const navigate = useNavigate();

   useEffect(() => {
      if (slug != null) {
         async function getData() {
            const fetch = await axios.get(`${articles}/${slug}`);
            setArticle(fetch.data.article);
            console.log(fetch.data.article);
         }
         getData();
      }
   }, [slug]);

   async function handleCreateArticle() {
      const article = {
         title: document.getElementById('title').value,
         description: document.getElementById('description').value,
         body: document.getElementById('body').value,
         tagList: document.getElementById('tag-list').value.split(' '),
      };

      await axios.post(
         articles,
         { article: article },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         },
      );
      navigate(`/article/${slug}`);
   }

   async function handleUpdateArticle(slug) {
      const article = {
         title: document.getElementById('title').value,
         description: document.getElementById('description').value,
         body: document.getElementById('body').value,
         tagList: document.getElementById('tag-list').value.split(),
      };
      await axios.put(
         `${articles}/${slug}`,
         { article: article },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         },
      );
   }
   function handleDeleteTag(id) {
      document.getElementById(id).remove();
   }
   return (
      <Row>
         <Col span={4}></Col>
         <Col span={16}>
            <div className={cl('form-input')}>
               {slug ? (
                  <>
                     {article && (
                        <Formik
                           initialValues={{
                              title: article.title,
                              description: article.description,
                              body: article.body,
                              tagList: article.tagList,
                           }}
                           onSubmit={async () => handleUpdateArticle(article.slug)}
                           validationSchema={Yup.object().shape({
                              title: Yup.string().required('The field is required.'),
                              description: Yup.string().required('The field is required.'),
                              body: Yup.string().required('The field is required.'),
                           })}
                        >
                           {(props) => {
                              const {
                                 values,
                                 touched,
                                 errors,
                                 isValid,
                                 dirty,
                                 handleChange,
                                 handleBlur,
                                 handleSubmit,
                              } = props;
                              return (
                                 <form className={cl('main', 'slug')} onSubmit={handleSubmit}>
                                    <div className={cl('input-tag')}>
                                       <input
                                          id="title"
                                          placeholder="Article Title"
                                          type="text"
                                          value={values.title}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          className={
                                             errors.title && touched.title
                                                ? cl('input-m', 'error-m', 'mt-32')
                                                : cl('input-m', 'mt-32')
                                          }
                                       />
                                       {errors.title && touched.title && (
                                          <div className={cl('error-field')}>{errors.title}</div>
                                       )}
                                    </div>
                                    <div className={cl('input-tag')}>
                                       <input
                                          id="description"
                                          placeholder="What's this article about"
                                          type="text"
                                          value={values.description}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          className={
                                             errors.description && touched.description
                                                ? cl('input-s', 'error-s', 'mt-32', 'font-1')
                                                : cl('input-s', 'mt-32', 'font-1')
                                          }
                                       />
                                       {errors.description && touched.description && (
                                          <div className={cl('error-field')}>{errors.description}</div>
                                       )}
                                    </div>
                                    <div className={cl('input-tag')}>
                                       <textarea
                                          id="body"
                                          value={values.body}
                                          placeholder="Write your article (in markdown)"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          className={
                                             errors.body && touched.body
                                                ? cl('input-m', 'error-m', 'font-1')
                                                : cl('input-m', 'font-1')
                                          }
                                       ></textarea>
                                       {errors.body && touched.body && (
                                          <div className={cl('error-field')}>{errors.body}</div>
                                       )}
                                    </div>
                                    <div className={cl('input-tag')}>
                                       <input
                                          id="tag-list"
                                          placeholder="Enter tags"
                                          type="text"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          className={
                                             errors.tagList && touched.tagList
                                                ? cl('input-s', 'error-m', 'font-1', 'tag-list')
                                                : cl('input-s', 'font-1', 'tag-list')
                                          }
                                       />

                                       {errors.tagList && touched.tagList && (
                                          <div className={cl('error-field')}>{errors.tagList}</div>
                                       )}
                                       <div className={cl('tag_list')}>
                                          {article.tagList.map((tag, i) => (
                                             <span id={i} key={i} className={cl('tag_default')}>
                                                <FontAwesomeIcon
                                                   icon={faXmark}
                                                   className={cl('icon')}
                                                   onClick={() => handleDeleteTag(i)}
                                                ></FontAwesomeIcon>
                                                {tag}
                                             </span>
                                          ))}
                                       </div>
                                    </div>
                                    <div className={cl('submit')}>
                                       <button className={cl('submit_btn')} type="submit">
                                          Update Article
                                       </button>
                                    </div>
                                 </form>
                              );
                           }}
                        </Formik>
                     )}
                  </>
               ) : (
                  <Formik
                     initialValues={{
                        title: '',
                        description: '',
                        body: '',
                        tagList: '',
                     }}
                     onSubmit={async (values) => handleCreateArticle()}
                     validationSchema={Yup.object().shape({
                        title: Yup.string().required('The field is required.'),
                        description: Yup.string().required('The field is required.'),
                        body: Yup.string().required('The field is required.'),
                     })}
                  >
                     {(props) => {
                        const { values, touched, errors, isValid, dirty, handleChange, handleBlur, handleSubmit } =
                           props;
                        return (
                           <form className={cl('main')} onSubmit={handleSubmit}>
                              <div className={cl('input-tag')}>
                                 <input
                                    id="title"
                                    placeholder="Article Title"
                                    type="text"
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                       errors.title && touched.title
                                          ? cl('input-m', 'error-m', 'mt-32')
                                          : cl('input-m', 'mt-32')
                                    }
                                 />
                                 {errors.title && touched.title && (
                                    <div className={cl('error-field')}>{errors.title}</div>
                                 )}
                              </div>
                              <div className={cl('input-tag')}>
                                 <input
                                    id="description"
                                    placeholder="What's this article about"
                                    type="text"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                       errors.description && touched.description
                                          ? cl('input-s', 'error-s', 'mt-32', 'font-1')
                                          : cl('input-s', 'mt-32', 'font-1')
                                    }
                                 />
                                 {errors.description && touched.description && (
                                    <div className={cl('error-field')}>{errors.description}</div>
                                 )}
                              </div>
                              <div className={cl('input-tag')}>
                                 <textarea
                                    id="body"
                                    placeholder="Write your article (in markdown)"
                                    value={values.body}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                       errors.body && touched.body
                                          ? cl('input-m', 'error-m', 'font-1')
                                          : cl('input-m', 'font-1')
                                    }
                                 ></textarea>
                                 {errors.body && touched.body && <div className={cl('error-field')}>{errors.body}</div>}
                              </div>
                              <div className={cl('input-tag')}>
                                 <input
                                    id="tag-list"
                                    placeholder="Enter tags"
                                    type="text"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                       errors.tagList && touched.tagList
                                          ? cl('input-s', 'error-m', 'font-1', 'tag-list')
                                          : cl('input-s', 'font-1', 'tag-list')
                                    }
                                 />

                                 {errors.tagList && touched.tagList && (
                                    <div className={cl('error-field')}>{errors.tagList}</div>
                                 )}
                              </div>
                              <div className={cl('submit')}>
                                 <button className={cl('submit_btn')} type="submit">
                                    Publish Article
                                 </button>
                              </div>
                           </form>
                        );
                     }}
                  </Formik>
               )}
            </div>
         </Col>
         <Col span={4}></Col>
      </Row>
   );
}

export default Editor;

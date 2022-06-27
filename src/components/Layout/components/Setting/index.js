import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'antd';
import classNames from 'classnames/bind';
import style from './Setting.module.scss';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { apiGeneral, token } from '~/components/common/common.js';
import axios from 'axios';

const cl = classNames.bind(style);

function Setting() {
   const [data, setData] = useState();
   const navigate = useNavigate();

   useEffect(() => {
      async function getData() {
         const fetch = await axios.get(`${apiGeneral}/user/`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         });
         setData(fetch.data.user);
      }
      getData();
   }, []);

   async function handleUpdateUser(values) {
      await axios.put(
         `${apiGeneral}/user`,
         { user: values },
         {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         },
      );
      await axios.get(`${apiGeneral}/profiles/${data.username}`);
      navigate(`/profile/${data.username}`);
   }
   function handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('account');
      navigate('/');
   }

   return (
      <Row>
         <Col span={4}></Col>
         {data && (
            <Col span={16}>
               <div className={cl('container')}>
                  <div className={cl('form-input')}>
                     <div className={cl('head')}>
                        <h1>Your Settings</h1>
                     </div>
                     <Formik
                        initialValues={{
                           email: data.email || '',
                           username: data.username,
                           bio: data.bio || '',
                           image: data.image || '',
                           password: '',
                        }}
                        onSubmit={async (values) => handleUpdateUser(values)}
                        validationSchema={Yup.object().shape({
                           email: Yup.string().required('The field is required.'),
                           password: Yup.string().required('The field is required.'),
                           username: Yup.string().required('The field is required.'),
                        })}
                     >
                        {(props) => {
                           const {
                              values,
                              touched,
                              errors,
                              dirty,
                              isSubmitting,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                           } = props;
                           return (
                              <form className={cl('main')} onSubmit={handleSubmit}>
                                 <div className={cl('input-tag')}>
                                    <input
                                       id="image"
                                       placeholder="URL of profile picture"
                                       type="text"
                                       value={values.image}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={
                                          errors.image && touched.image ? cl('input-s', 'error-s') : cl('input-s')
                                       }
                                    />
                                    {errors.image && touched.image && (
                                       <div className={cl('error-field')}>{errors.image}</div>
                                    )}
                                 </div>
                                 {values.image ? <img src={values.image} alt="avatar"></img> : <></>}
                                 <div className={cl('input-tag')}>
                                    <input
                                       id="username"
                                       placeholder="Username"
                                       type="text"
                                       value={values.username}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={
                                          errors.username && touched.username
                                             ? cl('input-m', 'error-m', 'mt-32')
                                             : cl('input-m', 'mt-32')
                                       }
                                    />
                                    {errors.username && touched.username && (
                                       <div className={cl('error-field')}>{errors.username}</div>
                                    )}
                                 </div>
                                 <div className={cl('input-tag')}>
                                    <textarea
                                       id="bio"
                                       placeholder="Short bio about you"
                                       type="text"
                                       value={values.bio}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={
                                          errors.bio && touched.bio
                                             ? cl('input-s', 'error-s', 'mt-32')
                                             : cl('input-s', 'mt-32')
                                       }
                                    ></textarea>
                                    {errors.bio && touched.bio && <div className={cl('error-field')}>{errors.bio}</div>}
                                 </div>
                                 <div className={cl('input-tag')}>
                                    <input
                                       id="email"
                                       placeholder="Email"
                                       value={values.email}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={
                                          errors.email && touched.email ? cl('input-m', 'error-m') : cl('input-m')
                                       }
                                    ></input>
                                    {errors.email && touched.email && (
                                       <div className={cl('error-field')}>{errors.email}</div>
                                    )}
                                 </div>
                                 <div className={cl('input-tag')}>
                                    <input
                                       id="password"
                                       placeholder="Enter your password"
                                       type="password"
                                       value={values.password}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={
                                          errors.password && touched.password ? cl('input-m', 'error-m') : cl('input-m')
                                       }
                                    />

                                    {errors.password && touched.password && (
                                       <div className={cl('error-field')}>{errors.password}</div>
                                    )}
                                 </div>
                                 <div className={cl('submit')}>
                                    <button className={cl('submit_btn')} type="submit">
                                       Update Setting
                                    </button>
                                 </div>
                                 <hr />
                                 <div className={cl('logout')}>
                                    <button className={cl('logout_btn')} onClick={() => handleLogout()}>
                                       Or click here to logout
                                    </button>
                                 </div>
                              </form>
                           );
                        }}
                     </Formik>
                  </div>
               </div>
            </Col>
         )}
      </Row>
   );
}

export default Setting;

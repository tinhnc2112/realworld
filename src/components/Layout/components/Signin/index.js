import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Signin.module.scss';
import axios from 'axios';
import { apiGeneral } from '~/components/common/common';
import Home from '~/pages/Home';

const cl = classNames.bind(style);

function Signin() {
   const [logged, setLogged] = useState(false);
   const navigate = useNavigate();

   async function handleSubmit(values) {
      const fetch = await axios.post(`${apiGeneral}/users/login`, { user: values });
      localStorage.setItem('account', fetch.data.user.username);
      localStorage.setItem('token', fetch.data.user.token);
      setLogged(true);
      navigate('/');
   }

   return (
      <>
         {logged ? (
            <div>
               <Home />
            </div>
         ) : (
            <div className={cl('container')}>
               <div className={cl('content')}>
                  <div className={cl('head')}>
                     <h1 className={cl('title')}>Sign in</h1>
                     <Link to={'/register'}>Need an account?</Link>
                  </div>
                  <div className={cl('form-input')}>
                     <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={async (values) => handleSubmit(values)}
                        validationSchema={Yup.object().shape({
                           email: Yup.string().email('Email is invalid.').required('The field is required.'),
                           password: Yup.string().required('The field is required.'),
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
                                       id="email"
                                       placeholder="Email"
                                       type="text"
                                       value={values.email}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={
                                          errors.email && touched.email
                                             ? cl('input', 'error', 'mt-32')
                                             : cl('input', 'mt-32')
                                       }
                                    />
                                    {errors.email && touched.email && (
                                       <div className={cl('error-email')}>{errors.email}</div>
                                    )}
                                 </div>

                                 <div className={cl('input-tag')}>
                                    <input
                                       id="password"
                                       placeholder="Password"
                                       type="password"
                                       value={values.password}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={
                                          errors.password && touched.password ? cl('input', 'error') : cl('input')
                                       }
                                    />

                                    {errors.password && touched.password && (
                                       <div className={cl('error-password')}>{errors.password}</div>
                                    )}
                                 </div>
                                 <div className={cl('submit')}>
                                    <button
                                       className={cl('submit_btn')}
                                       type="submit"
                                       disabled={!dirty || isSubmitting}
                                    >
                                       Sign in
                                    </button>
                                 </div>
                              </form>
                           );
                        }}
                     </Formik>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default Signin;

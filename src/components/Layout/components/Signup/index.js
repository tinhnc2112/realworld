import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Signup.module.scss';
import axios from 'axios';
import { apiGeneral } from '~/components/common/common';

const cl = classNames.bind(style);
function Signup() {
   return (
      <div className={cl('container')}>
         <div className={cl('content')}>
            <div className={cl('head')}>
               <h1 className={cl('title')}>Sign up</h1>
               <Link to={'/login'}>Have an account?</Link>
            </div>
            <div className={cl('form-input')}>
               <Formik
                  initialValues={{ username: '', email: '', password: '' }}
                  onSubmit={async (values) => {
                     await axios.post(`${apiGeneral}/users`, { user: values });
                  }}
                  validationSchema={Yup.object().shape({
                     email: Yup.string().email('Email is invalid.').required('The field is required.'),
                     password: Yup.string().required('The field is required.'),
                     username: Yup.string().required('The field is required.'),
                  })}
               >
                  {(props) => {
                     const { values, touched, errors, dirty, isSubmitting, handleChange, handleBlur, handleSubmit } =
                        props;
                     return (
                        <form className={cl('main')} onSubmit={handleSubmit}>
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
                                       ? cl('input', 'error', 'mt-32')
                                       : cl('input', 'mt-32')
                                 }
                              />
                              {errors.username && touched.username && (
                                 <div className={cl('error-msg')}>{errors.username}</div>
                              )}
                           </div>
                           <div className={cl('input-tag')}>
                              <input
                                 id="email"
                                 placeholder="Email"
                                 type="text"
                                 value={values.email}
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 className={
                                    errors.email && touched.email ? cl('input', 'error', 'mt-32') : cl('input', 'mt-32')
                                 }
                              />
                              {errors.email && touched.email && <div className={cl('error-msg')}>{errors.email}</div>}
                           </div>

                           <div className={cl('input-tag')}>
                              <input
                                 id="password"
                                 placeholder="Password"
                                 type="password"
                                 value={values.password}
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 className={errors.password && touched.password ? cl('input', 'error') : cl('input')}
                              />

                              {errors.password && touched.password && (
                                 <div className={cl('error-msg')}>{errors.password}</div>
                              )}
                           </div>

                           <div className={cl('submit')}>
                              <button className={cl('submit_btn')} type="submit" disabled={!dirty || isSubmitting}>
                                 Sign up
                              </button>
                           </div>
                        </form>
                     );
                  }}
               </Formik>
            </div>
         </div>
      </div>
   );
}

export default Signup;

import style from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { account, avatar, token, apiGeneral } from '~/components/common/common.js';
import axios from 'axios';
const cl = classNames.bind(style);

function Header() {
   const authenticate = localStorage.getItem('token');

   async function getProfile() {
      const fetch = await axios.get(`${apiGeneral}/profiles/${account}`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      localStorage.setItem('avatar', fetch.data.profile.image);
      console.log(fetch.data.profile.image);
   }

   return (
      <header className={cl('wrapper')}>
         <span className={cl('logo')}>conduit</span>
         <ul className={cl('inner')}>
            <li className={cl('home')}>
               <Link to={'/'}>Home</Link>
            </li>
            {authenticate ? (
               <div className={cl('user', 'active')}>
                  <li className={cl('sign-in')}>
                     <Link to={'/editor'}>
                        <FontAwesomeIcon className={cl('icon', 'mr-3')} icon={faPenToSquare} />
                        New Article
                     </Link>
                  </li>
                  <li className={cl('sign-up')}>
                     <Link to={'/setting'}>
                        <FontAwesomeIcon className={cl('icon', 'mr-3')} icon={faGear} />
                        Setting
                     </Link>
                  </li>
                  <li className={cl('sign-up')}>
                     <img src={avatar} alt="avatar" className={cl('small-avt', 'mr-3')} />
                     <Link
                        to={{
                           pathname: `/profile`,
                           search: `?id=${account}`,
                        }}
                        onClick={() => getProfile()}
                     >
                        {account}
                     </Link>
                  </li>
               </div>
            ) : (
               <div className={cl('user', 'active')}>
                  <li className={cl('sign-in')}>
                     <Link to={'/login'}>Sign in</Link>
                  </li>
                  <li className={cl('sign-up')}>
                     <Link to={'/register'}>Sign up</Link>
                  </li>
               </div>
            )}
         </ul>
      </header>
   );
}

export default Header;

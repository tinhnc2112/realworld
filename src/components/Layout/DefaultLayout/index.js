import Header from '~/components/Layout/components/Header'
import classNames from 'classnames/bind';
import style from './DefaultLayout.module.scss';
import Footer from '~/components/Layout/components/Footer'

const cx = classNames.bind(style);

function DefaultLayout({ children }) {
   return (
      <div className={cx('wrapper')}>
         <Header />
         <div className={cx('container')}>
            <div className={cx('content')}>{children}</div>
         </div>
         <Footer/>
      </div>
   );
}

export default DefaultLayout;
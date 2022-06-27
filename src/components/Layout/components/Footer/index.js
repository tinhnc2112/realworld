import classNames from 'classnames/bind';
import style from './Footer.module.scss'

const cl = classNames.bind(style)

function Footer() {
    return (
    <div className={cl('footer_')}>
        <div className={cl('container')}>
            <a className={cl('logo')} href="/">conduit</a>
            <span>© 2022. An interactive learning project from <a href="/">Thinkster</a>. Code licensed under MIT.</span>
        </div>
    </div>
    );
}

export default Footer;
import classNames from 'classnames/bind';
import style from './Slider.module.scss';

const cl = classNames.bind(style);

function Slider() {
    return ( 
    <div className={cl('slider')}>
        <div className={cl('slider_container')}>
            <h1>conduit</h1>
            <p>A place to share your <i>Angular</i> knowledge.</p>
        </div>
    </div> 
    );
}

export default Slider;
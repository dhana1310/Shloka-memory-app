import logo from './isklogo.webp';
import './main-page.css';

const Header = (props) => (
    <header className='row'>
        <div className='col-md-5'>
            <img src={logo} className='logo' alt='logo'/>
        </div>
        <div className='col-md-7 mt-5 subtitle'>
            {props.subtitle}
        </div>

    </header>
);

export default Header;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { logOut } from '~/redux/apiRequest';
import {useDispatch , useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutSuccess } from '~/redux/authSlice';
import {createAxios} from '~/createInstance';
import {
    faEllipsisVertical,
    faEarthAsia,
    faCircleQuestion,
    faKeyboard,
    faGear,
    faSignOut,
    faBars,
    faHome,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import { InboxIcon } from '~/components/Icons';
import Image from '~/components/Image';
import config from '~/config';
import SwitchMode from '~/components/SwitchMode';
import { StateContext } from '~/App';
const cx = classNames.bind(styles);


const handleMenuChange = (menuItem) => {
    switch (menuItem.type) {
        case 'Language':
            // console.log(menuItem.type);
            break;
        default:
    }
    switch (menuItem.title) {
        case 'Logout':
            menuItem.handleLogout();
            break;
        default:
    }
};
const MENU_ITEM = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                { type: 'Language', code: 'en', title: 'English' },
                { type: 'Language', code: 'vi', title: 'Tiếng Việt' },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Feedback and help',
        to: 'feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
];
export var barClickChecked = false;
function Header() {
    const styleState = useContext(StateContext);
    const user = useSelector((state)=> state.auth.login.currentUser);
    const accessToken = user?.accessToken;
    const id = user?._doc?._id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user,dispatch,logOutSuccess);
    const handleLogout = () =>{
        logOut(dispatch,id,navigate, accessToken,axiosJWT);
    }

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Settings',
            to: '/settings',
        },
        ...MENU_ITEM,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Logout',
            to: config.routes.home,
            separate: false,
            handleLogout,
        },  
    ];

    const handleClickBars = () => {
        styleState.setSidebarWidth(!styleState.sidebarWidth);
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('logo-link')}>
                <FontAwesomeIcon icon={user?.accessToken ? faBars : faHome} onClick={handleClickBars} />
            </div>
            <div className={cx('actions')}>
                <SwitchMode />
                {user?.accessToken ? (
                    <>
                        <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                            <button className={cx('action-btn')}>
                                <InboxIcon />
                                <span className={cx('badge')}>12</span>
                            </button>
                        </Tippy>
                    </>
                ) : (
                    <>
                        <Button to={config.routes.login} primary>
                            Log in
                        </Button>
                        <Button to={config.routes.signup} outline>
                            Sign Up
                        </Button>
                    </>
                )}
                <>
                    <Menu items={user?.accessToken ? userMenu : MENU_ITEM} onChange={handleMenuChange}>
                        {user?.accessToken ? (
                            <Image
                                src="https://64.media.tumblr.com/0720d562319a714c020710344ed67383/84bd6032ff13f728-fa/s1280x1920/085d228f71280869ce592e242cc1173c4a7c225f.jpg"
                                className={cx('user-avatar')}
                                alt="Nguyen Van A"
                                fallBack="https://scontent.fsgn2-8.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?stp=cp0_dst-png_p60x60&_nc_cat=1&ccb=1-7&_nc_sid=7206a8&_nc_ohc=E70viSc53w0AX8GYSY7&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfD2dw7Et-gbPGBMYZTT12RlM223MEMvX0QErMevYJpl6w&oe=63FE15F8"
                            />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </>
            </div>
        </header>
    );
}

export default Header;

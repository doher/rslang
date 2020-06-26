import React, { useState } from 'react';
// @ts-ignore
import { NavLink, useLocation } from 'react-router-dom';
import styles from './header.module.css';
import Logo from '../../img/HeaderLogo.svg';
import MenuLink from './menu-link';
import IMG_SETTINGS from '../../img/menuIcons/settings.svg';
import IMG_LIBRARY from '../../img/menuIcons/library.svg';
import IMG_STATISTIC from '../../img/menuIcons/statistic.svg';
import IMG_GAMES from '../../img/menuIcons/puzzle.svg';
import IMG_ABOUT_US from '../../img/menuIcons/aboutUs.svg';
import { ILink } from './interface';

const pathArray: Array<ILink> = [
  { path: 'library', name: 'Library', image: IMG_LIBRARY },
  { path: 'statistic', name: 'Statistic', image: IMG_STATISTIC },
  { path: 'mini-games', name: 'Mini Games', image: IMG_GAMES },
  { path: 'settings', name: 'Settings', image: IMG_SETTINGS },
  { path: 'about-us', name: 'About Us', image: IMG_ABOUT_US }];

const Header: React.FC = () => {
  const path = useLocation();
  const noMenu = ['/auth', '/login', '/signup'];
  const isMenuShow = !noMenu.includes(path.pathname);
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [menuButtonStyle, menuContainerStyle] = [`${styles.menuButton}
      ${isOpen && styles.active}`, `${styles.menuContainer}
      ${isOpen && styles.active}`];

  const toggleMenu = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  return (
    <>
      <div className={styles.headerContainer}>
        <NavLink to={isMenuShow ? 'main-page' : '/'}><img src={Logo} alt="Logo" /></NavLink>
        {isMenuShow
          && (
          <div className={menuButtonStyle} onClick={toggleMenu}>
            <span> </span>
            <span> </span>
            <span> </span>
          </div>
          )}
      </div>
      {isMenuShow
      && (
      <div className={`${menuContainerStyle} menu-container`}>
        <div className={styles.menuScreenBackground} onClick={toggleMenu}> </div>
        <div className={styles.menuBlock}>
          <MenuLink link={pathArray} toggleMenu={toggleMenu} />
          <div className={styles.btnLogOut}>
            Log Out
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Header;

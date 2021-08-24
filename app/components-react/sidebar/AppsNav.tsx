import ResizeObserver from 'resize-observer-polyfill';
import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { EAppPageSlot, ILoadedApp } from '../../services/platform-apps';
import styles from './AppsNav.m.less';
import { Services } from '../service-provider';
import { useVuex } from '../hooks';

/**
 * The default amount the nav bar should scroll when clicking the scroll arrow buttons.
 */
const DEFAULT_SCROLL_DELTA = 43;

export default function AppsNav() {
  const { PlatformAppsService, NavigationService } = Services;

  const { currentPage, navApps, selectedApp } = useVuex(() => ({
    currentPage: NavigationService.state.currentPage,
    navApps: PlatformAppsService.views.enabledApps.filter(app => {
      return !!app.manifest.pages.find(page => {
        return page.slot === EAppPageSlot.TopNav;
      });
    }),
    selectedApp: NavigationService.state.params.appId,
  }));

  const [upArrowVisible, setUpArrowVisible] = useState(false);
  const [downArrowVisible, setDownArrowVisible] = useState(false);

  const scroll = useRef<HTMLDivElement>(null);

  const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.target.clientHeight) {
        handleScroll();
      }
    });
  });

  useEffect(handleScroll, [navApps]);

  useEffect(() => {
    if (!scroll.current) return;
    resizeObserver.observe(scroll.current);

    return () => {
      if (!scroll.current) return;
      resizeObserver.unobserve(scroll.current);
    };
  }, [scroll.current]);

  function isSelectedApp(appId: string) {
    return currentPage === 'PlatformAppMainPage' && selectedApp === appId;
  }

  function isPopOutAllowed(app: ILoadedApp) {
    const topNavPage = app.manifest.pages.find(page => page.slot === EAppPageSlot.TopNav);
    if (!topNavPage) return false;

    // Default result is true
    return topNavPage.allowPopout == null ? true : topNavPage.allowPopout;
  }

  function popOut(app: ILoadedApp) {
    if (!isPopOutAllowed(app)) return;
    PlatformAppsService.actions.popOutAppPage(app.id, EAppPageSlot.TopNav);
  }

  function refreshApp(appId: string) {
    PlatformAppsService.actions.refreshApp(appId);
  }

  function navigateApp(appId: string) {
    NavigationService.actions.navigate('PlatformAppMainPage', { appId });
  }

  function iconSrc(appId: string, path: string) {
    return PlatformAppsService.views.getAssetUrl(appId, path) || undefined;
  }

  function scrollUp() {
    scrollNav(-DEFAULT_SCROLL_DELTA);
  }

  function scrollDown() {
    scrollNav(DEFAULT_SCROLL_DELTA);
  }

  function handleScroll() {
    const el = scroll.current;
    if (!el) return;
    if (el.scrollTop > 0) {
      setUpArrowVisible(true);
    } else {
      setUpArrowVisible(false);
    }
    if (el.scrollHeight - el.scrollTop === el.clientHeight) {
      setDownArrowVisible(false);
    } else if (el.scrollHeight > el.clientHeight) {
      setDownArrowVisible(true);
    }
  }

  function scrollNav(vertical: number) {
    scroll.current && scroll.current.scrollBy({ top: vertical, behavior: 'smooth' });
  }

  function refreshIcon(app: ILoadedApp) {
    return (
      app.unpacked && (
        <div className={styles.refreshIcon} onClick={() => refreshApp(app.id)}>
          <i className="icon-repeat" />
        </div>
      )
    );
  }

  return (
    <>
      <div className={styles.scroll} ref={scroll} onScroll={handleScroll}>
        {navApps.map(app => (
          <div style={{ position: 'relative' }} key={app.id}>
            {<div className={cx(styles.activeApp, { [styles.active]: isSelectedApp(app.id) })} />}
            <div
              title={app.manifest.name}
              onClick={() => navigateApp(app.id)}
              draggable
              onDragEnd={() => popOut(app)}
              className={styles.appTab}
            >
              {app.manifest.icon ? (
                <img src={iconSrc(app.id, app.manifest.icon)} />
              ) : (
                <i className="icon-integrations" />
              )}
            </div>
            {refreshIcon(app)}
          </div>
        ))}
      </div>
      {upArrowVisible && (
        <div className={cx(styles.arrow, styles.up)} onClick={scrollUp}>
          <i className="icon-down" />
        </div>
      )}
      {downArrowVisible && (
        <div className={cx(styles.arrow, styles.down)} onClick={scrollDown}>
          <i className="icon-down" />
        </div>
      )}
    </>
  );
}

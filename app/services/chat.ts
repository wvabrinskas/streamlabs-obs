import { Service } from 'services/core/service';
import { Inject } from 'services/core/injector';
import { UserService } from 'services/user';
import { CustomizationService, ICustomizationServiceState } from 'services/customization';
import electron, { ipcRenderer } from 'electron';
import url from 'url';
import { WindowsService } from 'services/windows';
import { $t } from 'services/i18n';
import { InitAfter } from './core';
import Utils from './utils';
import { StreamingService } from './streaming';

export function enableBTTVEmotesScript(isDarkTheme: boolean) {
  /*eslint-disable */
return `
localStorage.setItem('bttv_clickTwitchEmotes', true);
localStorage.setItem('bttv_darkenedMode', ${
  isDarkTheme ? 'true' : 'false'
});

var bttvscript = document.createElement('script');
bttvscript.setAttribute('src','https://cdn.betterttv.net/betterttv.js');
document.head.appendChild(bttvscript);

function loadLazyEmotes() {
  var els = document.getElementsByClassName('lazy-emote');

  Array.prototype.forEach.call(els, el => {
    const src = el.getAttribute('data-src');
    if (el.src !== 'https:' + src) el.src = src;
  });

  setTimeout(loadLazyEmotes, 1000);
}

loadLazyEmotes();
0;
`
  /*eslint-enable */
}

@InitAfter('StreamingService')
export class ChatService extends Service {
  @Inject() userService: UserService;
  @Inject() customizationService: CustomizationService;
  @Inject() windowsService: WindowsService;
  @Inject() streamingService: StreamingService;

  private chatView: Electron.BrowserView | null;
  private chatUrl = '';
  private electronWindowId: number | null;

  init() {
    this.chatUrl = this.streamingService.views.chatUrl;

    // listen `streamInfoChanged` to init or deinit the chat
    this.streamingService.streamInfoChanged.subscribe(streamInfo => {
      if (streamInfo.chatUrl === this.chatUrl) return; // chatUrl has not been changed

      // chat url has been changed, set the new chat url
      const oldChatUrl = this.chatUrl;
      this.chatUrl = streamInfo.chatUrl;

      // chat url has been changed to an empty string, unmount chat
      if (oldChatUrl && !this.chatUrl) {
        this.unmountChat();
        return;
      }

      // chat url changed to a new valid url, reload chat
      this.loadUrl();
    });

    this.userService.userLogout.subscribe(() => {
      this.deinitChat();
    });
  }

  refreshChat() {
    this.loadUrl();
  }

  async mountChat(electronWindowId: number) {
    if (!this.chatView) this.initChat();
    this.electronWindowId = electronWindowId;
    const win = electron.remote.BrowserWindow.fromId(electronWindowId);
    if (this.chatView && win) win.addBrowserView(this.chatView);
  }

  setChatBounds(position: IVec2, size: IVec2) {
    if (!this.chatView) return;

    this.chatView.setBounds({
      x: Math.round(position.x),
      y: Math.round(position.y),
      width: Math.round(size.x),
      height: Math.round(size.y),
    });
  }

  unmountChat() {
    if (!this.electronWindowId) return; // already unmounted
    const win = electron.remote.BrowserWindow.fromId(this.electronWindowId);
    if (this.chatView && win) win.removeBrowserView(this.chatView);
    this.electronWindowId = null;
  }

  private initChat() {
    if (this.chatView) return;
    if (!this.userService.isLoggedIn) return;

    const partition = this.userService.state.auth?.partition;

    this.chatView = new electron.remote.BrowserView({
      webPreferences: {
        partition,
        nodeIntegration: false,
      },
    });

    this.bindWindowListener();
    this.bindDomReadyListener();

    this.customizationService.settingsChanged.subscribe(changed => {
      this.handleSettingsChanged(changed);
    });

    if (this.chatUrl) this.loadUrl();
  }

  private deinitChat() {
    // @ts-ignore: typings are incorrect
    this.unmountChat();
    this.chatView = null;
  }

  private async loadUrl() {
    if (!this.chatUrl) return; // user has logged out
    if (!this.chatView) return; // chat was already deinitialized

    // try to load chat url
    await this.chatView.webContents.loadURL(this.chatUrl).catch(this.handleRedirectError);

    // sometimes it fails to load chat
    // try to load again if needed
    await Utils.sleep(1000);
    if (this.chatView.webContents.getURL() !== this.chatUrl) {
      await this.chatView.webContents.loadURL(this.chatUrl).catch(this.handleRedirectError);
    }
  }

  handleRedirectError(e: Error) {
    // This error happens when the page redirects, which is expected for chat
    if (!e.message.match(/\(\-3\) loading/)) {
      throw e;
    }
  }

  private bindWindowListener() {
    if (!this.chatView) return; // chat was already deinitialized

    electron.ipcRenderer.send('webContents-preventPopup', this.chatView.webContents.id);

    if (this.userService.platformType === 'youtube') {
      // Preventing navigation has to be done in the main process
      ipcRenderer.send('webContents-bindYTChat', this.chatView.webContents.id);

      this.chatView.webContents.on('will-navigate', (e, targetUrl) => {
        const parsed = url.parse(targetUrl);

        if (parsed.hostname === 'accounts.google.com') {
          electron.remote.dialog
            .showMessageBox(Utils.getMainWindow(), {
              title: $t('YouTube Chat'),
              message: $t(
                'This action cannot be performed inside Streamlabs OBS. To interact with chat, you can open this chat in a web browser.',
              ),
              buttons: [$t('OK'), $t('Open In Web Browser')],
            })
            .then(({ response }) => {
              if (response === 1) {
                electron.remote.shell.openExternal(this.chatUrl);
              }
            });
        }
      });
    }

    this.chatView.webContents.on('new-window', (evt, targetUrl) => {
      const parsedUrl = url.parse(targetUrl);
      const protocol = parsedUrl.protocol;

      if (protocol === 'http:' || protocol === 'https:') {
        if (
          parsedUrl.host &&
          parsedUrl.query &&
          (parsedUrl.host === 'twitch.tv' || parsedUrl.host.endsWith('.twitch.tv')) &&
          parsedUrl.query.includes('ffz-settings')
        ) {
          this.windowsService.createOneOffWindow(
            {
              componentName: 'FFZSettings',
              title: $t('FrankerFaceZ Settings'),
              queryParams: {},
              size: {
                width: 800,
                height: 800,
              },
            },
            'ffz-settings',
          );
        } else {
          electron.remote.shell.openExternal(targetUrl);
        }
      }
    });
  }

  private bindDomReadyListener() {
    if (!this.chatView) return; // chat was already deinitialized

    const settings = this.customizationService.state;

    this.chatView.webContents.on('dom-ready', () => {
      if (!this.chatView) return; // chat was already deinitialized

      this.chatView.webContents.setZoomFactor(settings.chatZoomFactor);

      if (settings.enableBTTVEmotes && this.userService.platform?.type === 'twitch') {
        this.chatView.webContents.executeJavaScript(
          enableBTTVEmotesScript(this.customizationService.isDarkTheme),
          true,
        );
      }

      if (settings.enableFFZEmotes && this.userService.platform?.type === 'twitch') {
        this.chatView.webContents.executeJavaScript(
          `
          var ffzscript1 = document.createElement('script');
          ffzscript1.setAttribute('src','https://cdn.frankerfacez.com/script/script.min.js');
          document.head.appendChild(ffzscript1);
          0;
        `,
          true,
        );
      }

      // facebook chat doesn't fit our layout by default
      // inject a script that removes scrollbars and sets auto width for the chat
      if (this.userService.platform?.type === 'facebook') {
        Utils.sleep(2000).then(() => {
          if (!this.chatView) return;
          this.chatView.webContents
            .executeJavaScript(
              `
                document.querySelector('html').style.overflowY='hidden !important';
                var chatContainer = document.querySelector('div[data-pagelet="page"] > div');
                chatContainer.style.marginLeft = '0';
                chatContainer.style.marginRight = '0';
                `,
              true,
            )
            .catch(e => {});
        });
      }
    });
  }

  private handleSettingsChanged(changed: Partial<ICustomizationServiceState>) {
    if (!this.chatView) return;
    if (changed.chatZoomFactor) {
      this.chatView.webContents.setZoomFactor(changed.chatZoomFactor);
    }

    if (changed.enableBTTVEmotes != null || changed.enableFFZEmotes != null) {
      this.refreshChat();
    }
  }
}

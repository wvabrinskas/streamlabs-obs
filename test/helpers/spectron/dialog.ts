import { getContext, TExecutionContext } from '.';

export async function dialogDismiss(buttonLabel: string) {
  // There's probably a simpler way to handle this
  await getContext().context.app.webContents.executeJavaScript(
    `(() => { var _elec = require('electron'); _elec.ipcRenderer.send('__SPECTRON_FAKE_MESSAGE_BOX', '${buttonLabel}'); })();`,
  );
}

export async function dialogSelectPath(filePath: string) {
  const encodedFilePath = filePath.replace(/\\/g, '\\\\');
  await getContext().context.app.webContents.executeJavaScript(
    `(() => { var _elec = require('electron'); _elec.ipcRenderer.send('__SPECTRON_FAKE_SAVE_DIALOG', '${encodedFilePath}'); })();`,
  );
}

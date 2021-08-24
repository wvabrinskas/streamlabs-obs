// Source helper functions
import { focusMain, focusChild } from './core';
import { click, clickButton, isDisplayed, select, waitForDisplayed } from './core';
import { dialogDismiss } from '../spectron/dialog';
import { contextMenuClick } from '../spectron/context-menu';

async function clickSourceAction(selector: string) {
  const $el = await (await (await select('h2=Sources')).$('..')).$(selector);
  await $el.click();
}

export async function clickAddSource() {
  await clickSourceAction('.icon-add');
}

export async function clickRemoveSource() {
  await clickSourceAction('.icon-subtract');
  await dialogDismiss('OK');
}

export async function clickSourceProperties() {
  await clickSourceAction('.icon-settings');
}

export async function selectSource(name: string) {
  await click(`.item-title=${name}`);
}

export async function selectTestSource() {
  await click('.item-title*=__');
}

export async function rightClickSource(name: string) {
  await (await select(`.item-title=${name}`)).click({ button: 'right' });
}

export async function addSource(type: string, name: string, closeProps = true) {
  await focusMain();
  await clickAddSource();
  await focusChild();

  await waitForDisplayed('h2=Welcome to sources!');
  if (await isDisplayed(`li=${type}`)) {
    await click(`li=${type}`); // source
  } else {
    await click(`div=${type}`); // widget
  }

  await clickButton('Add Source');
  const isInputVisible = await isDisplayed('input', { timeout: 200, interval: 100 });
  if (!isInputVisible) {
    await click('[data-type="toggle"]');
    await waitForDisplayed('input');
  }
  await (await select('input')).setValue(name);

  await clickButton('Add Source');

  // Close source properties too
  if (closeProps) {
    await clickButton('Done');
  } else {
    await focusChild();
  }
}

export async function addExistingSource(type: string, name: string) {
  await focusMain();
  await clickAddSource();

  await focusChild();
  await click(`li=${type}`);
  await clickButton('Add Source');
  await click(`div=${name}`);
  await clickButton('Add Source');
}

export async function openRenameWindow(sourceName: string) {
  await focusMain();
  await rightClickSource(sourceName);
  await contextMenuClick('Rename');
  await focusChild();
}

export async function sourceIsExisting(sourceName: string) {
  return await isDisplayed(`.item-title=${sourceName}`);
}

export async function waitForSourceExist(sourceName: string, invert = false) {
  return (await select(`.item-title=${sourceName}`)).waitForExist({
    timeout: 5000,
    reverse: invert,
  });
}

export async function testSourceExists() {
  return (await select('.item-title*=__')).isExisting();
}

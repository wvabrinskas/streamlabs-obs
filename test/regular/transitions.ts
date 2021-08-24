import { useSpectron, test } from '../helpers/spectron';
import { clickSceneTransitions, addScene } from '../helpers/modules/scenes';
import { getFormInput } from '../helpers/spectron/forms';
import { dismissModal } from '../helpers/spectron/modals';
import { FormMonkey } from '../helpers/form-monkey';
import { click, clickButton, focusChild, focusMain } from '../helpers/modules/core';

useSpectron({
  restartAppAfterEachTest: false,
  clearCollectionAfterEachTest: true,
});

test('Changing transition options', async t => {
  const app = t.context.app;
  const transitionType = 'Fade';
  const transitionDuration = 500;

  // We need at least 2 scenes to edit transitions
  await addScene('Other Scene');

  await focusMain();
  await clickSceneTransitions();
  await focusChild();
  await (await app.client.$('.icon-edit')).click();
  const form = new FormMonkey(t);
  await form.fillByTitles({
    Type: transitionType,
    Duration: transitionDuration,
  });

  await dismissModal(t);
  await clickButton('Done');
  await focusMain();
  await clickSceneTransitions();
  await focusChild();

  await click('.icon-edit');

  console.log('includesByTitles');

  t.true(
    await form.includesByTitles({
      Type: transitionType,
      Duration: transitionDuration,
    }),
  );
  t.pass();
});

test('Adding and removing transitions', async t => {
  const app = t.context.app;

  // We need at least 2 scenes to edit transitions
  await addScene('Other Scene');

  await focusMain();
  await clickSceneTransitions();
  await focusChild();
  await (await app.client.$('button=Add Transition')).click();
  await dismissModal(t);
  await (await app.client.$('.icon-trash')).click();
  await (await app.client.$('.icon-edit')).click();
  const title = await getFormInput(t, 'Name');
  t.true(title === 'New Transition');
});

test('Changing connections', async t => {
  const app = t.context.app;
  const connectionBegin = 'Other Scene';
  const connectionTransition = 'New Transition';
  const connectionEnd = 'Scene';

  // We need at least 2 scenes to edit transitions
  await addScene('Other Scene');

  await focusMain();
  await clickSceneTransitions();
  await focusChild();
  await (await app.client.$('button=Add Transition')).click();
  await dismissModal(t);
  await (await app.client.$('button=Connections')).click();
  await (await app.client.$('button=Add Connection')).click();
  const form = new FormMonkey(t);
  await form.fillByTitles({
    'Beginning Scene': connectionBegin,
    'Scene Transition': connectionTransition,
    'Ending Scene': connectionEnd,
  });
  await (await t.context.app.client.$('button=Done')).click();
  await focusMain();
  await clickSceneTransitions();
  await focusChild();

  await (await app.client.$('button=Connections')).click();
  await (await app.client.$('.icon-edit')).click();

  t.true(
    await form.includesByTitles({
      'Beginning Scene': connectionBegin,
      'Scene Transition': connectionTransition,
      'Ending Scene': connectionEnd,
    }),
  );
});

test('Showing redudant connection warning', async t => {
  const app = t.context.app;

  // We need at least 2 scenes to edit transitions
  await addScene('Other Scene');

  await focusMain();
  await clickSceneTransitions();
  await focusChild();
  await (await app.client.$('button=Add Transition')).click();
  await dismissModal(t);
  await (await app.client.$('button=Connections')).click();
  await (await app.client.$('button=Add Connection')).click();
  await dismissModal(t);
  await (await app.client.$('button=Add Connection')).click();
  await dismissModal(t);

  await (await app.client.$('.transition-redundant')).waitForDisplayed();
  t.pass();
});

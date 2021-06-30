import { ModalLayout } from '../shared/ModalLayout';
import { $t } from '../../services/i18n';
import React, { useState } from 'react';
import { Services } from '../service-provider';
import { useOnCreate } from '../hooks';
import { assertIsDefined } from '../../util/properties-type-guards';
import { TextInput } from '../shared/inputs/TextInput';
import { Button } from 'antd';
import Form, { useForm } from '../shared/inputs/Form';

interface IWindowOptions {
  renameId?: string;
  itemsToGroup?: string[];
  parentId?: string;
  sceneId: string;
}

/**
 * Modal for creating or re-naming a folder
 */
export default function NameFolder() {
  // inject services
  const { ScenesService, EditorCommandsService, WindowsService } = Services;

  // define stateful variables and setters
  const [name, setName] = useState('');

  // define a form
  const form = useForm();

  // get window options on component create
  const options = useOnCreate(() => {
    const options = (WindowsService.state.child.queryParams as unknown) as IWindowOptions;
    const scene = ScenesService.views.getScene(options.sceneId);
    assertIsDefined(scene);
    const name = options.renameId
      ? scene.getFolder(options.renameId)!.name
      : ScenesService.suggestName('New Folder');
    setName(name);
    return options;
  });

  // define a submit method
  async function submit() {
    try {
      await form.validateFields();
    } catch (e: unknown) {
      return;
    }

    if (options.renameId) {
      EditorCommandsService.executeCommand(
        'RenameFolderCommand',
        options.sceneId,
        options.renameId,
        name,
      );
      WindowsService.actions.closeChildWindow();
    } else {
      const scene = ScenesService.views.getScene(options.sceneId);
      assertIsDefined(scene);

      EditorCommandsService.executeCommand(
        'CreateFolderCommand',
        options.sceneId,
        name,
        options?.itemsToGroup && options.itemsToGroup.length > 0
          ? scene.getSelection(options.itemsToGroup)
          : void 0,
      );
      WindowsService.actions.closeChildWindow();
    }
  }

  return (
    <ModalLayout onOk={submit} okText={$t('Submit')}>
      <Form layout="vertical" form={form}>
        <TextInput
          name="name"
          value={name}
          onInput={v => setName(v)}
          label={$t('Please enter the name of the folder')}
          required={true}
          uncontrolled={false}
        />
      </Form>
    </ModalLayout>
  );
}

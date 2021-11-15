import React, { useState, useRef, useMemo } from 'react';
import { Provider } from 'react-redux';
import { BoolButtonInput, ListInput, SwitchInput } from 'components-react/shared/inputs';
import InputWrapper from 'components-react/shared/inputs/InputWrapper';
import { TObsValue, IObsListInput, IObsInput } from 'components/obs/inputs/ObsInput';
import { Services } from 'components-react/service-provider';
import { useVuex } from 'components-react/hooks';
import { $t } from 'services/i18n';
import Utils from 'services/utils';
import styles from './AdvancedAudio.m.less';
import { ObsSettings, ObsSettingsSection } from '../../windows/settings/ObsSettings';
import { store } from '../../store';

export default function GlobalSettings() {
  const { SettingsService } = Services;

  const { advancedAudioSettings, isAdvancedOutput, audioTracks } = useVuex(() => ({
    advancedAudioSettings: SettingsService.views.advancedAudioSettings,
    isAdvancedOutput: SettingsService.views.isAdvancedOutput,
    audioTracks: SettingsService.views.audioTracks,
  }));

  const monitoringDevice = advancedAudioSettings?.parameters.find(
    param => param.name === 'MonitoringDeviceName',
  ) as IObsListInput<TObsValue>;
  const audioDucking = advancedAudioSettings?.parameters.find(
    param => param.name === 'DisableAudioDucking',
  ) as IObsInput<boolean>;

  function handleAdvancedSettingsChange(name: string, value: TObsValue) {
    SettingsService.actions.setSettingValue('Advanced', name, value);
  }

  function handleTracksChange(index: number, value: boolean) {
    const newArray = [...audioTracks];
    newArray[index] = Number(value);
    const newValue = Utils.binnaryArrayToNumber([...newArray].reverse());
    SettingsService.actions.setSettingValue('Output', 'RecTracks', newValue);
  }

  return (
    <>
      <ObsSettingsSection>
        {monitoringDevice && (
          <ListInput
            label={monitoringDevice.description}
            value={monitoringDevice.value}
            options={monitoringDevice.options.map(opt => ({
              value: opt.value,
              label: opt.description,
            }))}
            onChange={(value: string) =>
              handleAdvancedSettingsChange('MonitoringDeviceName', value)
            }
          />
        )}
        {audioDucking && (
          <SwitchInput
            label={audioDucking.description}
            value={audioDucking.value}
            onChange={(value: boolean) =>
              handleAdvancedSettingsChange('DisableAudioDucking', value)
            }
          />
        )}
        {isAdvancedOutput && (
          <InputWrapper
            label={$t('Audio Tracks')}
            tooltip={$t('Designates which tracks are being recorded')}
            layout="horizontal"
            style={{ flexWrap: 'nowrap' }}
          >
            <div className={styles.globalAudioTracks}>
              {audioTracks.map((track, i) => (
                <BoolButtonInput
                  label={String(i + 1)}
                  key={i}
                  value={!!track}
                  checkboxStyles={{ marginRight: '4px' }}
                  name={`flag${track}`}
                  onChange={(value: boolean) => handleTracksChange(i, value)}
                />
              ))}
            </div>
          </InputWrapper>
        )}
      </ObsSettingsSection>
      <Provider store={store}>
        <ObsSettings page="Audio" />
      </Provider>
    </>
  );
}

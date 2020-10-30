import { Component, Prop } from 'vue-property-decorator';
import cx from 'classnames';
import styles from './ImageUploaderInput.m.less';
import { BaseInput } from './BaseInput';
import { $t } from 'services/i18n';
import { IImageUploaderMetadata, IImageUploaderValue, IInputMetadata } from './index';
import { createProps } from 'components/tsx-component';

class Props {
  value: IImageUploaderValue = { localUrl: '', remoteUrl: '' };
  metadata: IImageUploaderMetadata = null;
}

@Component({ props: createProps(Props) })
export default class ImageUploaderInput extends BaseInput<
  IImageUploaderValue,
  IImageUploaderMetadata,
  Props
> {
  value: IImageUploaderValue;
  title: string;
  metadata: IImageUploaderMetadata;

  private get imageUrl() {
    return this.value.localUrl || this.value.remoteUrl;
  }

  render() {
    return (
      <div data-role="input" data-type="imageUploader" data-name={this.options.name}>
        {this.imageUrl && <img src={this.imageUrl} alt="" />}
      </div>
    );
  }
}

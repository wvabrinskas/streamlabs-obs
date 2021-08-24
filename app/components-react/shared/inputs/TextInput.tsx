import { Input } from 'antd';
import React from 'react';
import { InputComponent, TSlobsInputProps, useTextInput, ValuesOf } from './inputs';
import InputWrapper from './InputWrapper';
import { InputProps } from 'antd/lib/input';

// select which features from the antd lib we are going to use
const ANT_INPUT_FEATURES = ['addonBefore', 'addonAfter'] as const;

export type TTextInputProps = TSlobsInputProps<
  {
    uncontrolled?: boolean;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    inputRef?: React.Ref<Input>;
  },
  string,
  InputProps,
  ValuesOf<typeof ANT_INPUT_FEATURES>
>;

export const TextInput = InputComponent((p: TTextInputProps) => {
  const { inputAttrs, wrapperAttrs } = useTextInput('text', p, ANT_INPUT_FEATURES);
  return (
    <InputWrapper {...wrapperAttrs}>
      <Input {...inputAttrs} onFocus={p.onFocus} onKeyDown={p.onKeyDown} ref={p.inputRef} />
    </InputWrapper>
  );
});

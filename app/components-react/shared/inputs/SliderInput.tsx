import React from 'react';
import { InputComponent, TSlobsInputProps, useInput, ValuesOf } from './inputs';
import { Slider, InputNumber, Row, Col } from 'antd';
import { SliderSingleProps } from 'antd/lib/slider';
import InputWrapper from './InputWrapper';

// select which features from the antd lib we are going to use
const ANT_SLIDER_FEATURES = ['min', 'max', 'step', 'tooltipPlacement', 'tipFormatter'] as const;

export type TSliderInputProps = TSlobsInputProps<
  { hasNumberInput?: boolean; slimNumberInput?: boolean },
  number,
  SliderSingleProps,
  ValuesOf<typeof ANT_SLIDER_FEATURES>
>;

export const SliderInput = InputComponent((partialProps: TSliderInputProps) => {
  // apply default props
  const p = {
    hasNumberInput: false,
    ...partialProps,
  };
  const { inputAttrs, wrapperAttrs, dataAttrs } = useInput('slider', p, ANT_SLIDER_FEATURES);
  const numberInputHeight = p.slimNumberInput ? '50px' : '70px';

  function onChangeHandler(val: number) {
    // don't emit onChange if the value is out of range
    if (typeof val !== 'number') return;
    if (typeof p.max === 'number' && val > p.max) return;
    if (typeof p.min === 'number' && val < p.min) return;
    inputAttrs.onChange(val);
  }

  return (
    <InputWrapper {...wrapperAttrs}>
      <Row>
        <Col flex="auto" {...dataAttrs} data-role="input" data-value={inputAttrs.value}>
          <Slider {...inputAttrs} />
        </Col>

        {p.hasNumberInput && (
          <Col flex={numberInputHeight}>
            <InputNumber
              {...inputAttrs}
              onChange={onChangeHandler}
              style={{ width: numberInputHeight, marginLeft: '8px' }}
            />
          </Col>
        )}
      </Row>
    </InputWrapper>
  );
});

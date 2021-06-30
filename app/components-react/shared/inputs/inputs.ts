/**
 * Shared code for inputs
 */
import React, { useEffect, useContext, ChangeEvent, FocusEvent, useCallback, useRef } from 'react';
import { FormContext } from './Form';
import { useDebounce, useOnCreate, useForceUpdate } from '../../hooks';
import uuid from 'uuid';
import { FormItemProps } from 'antd/lib/form';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { $t } from '../../../services/i18n';
import pick from 'lodash/pick';

type TInputType =
  | 'text'
  | 'textarea'
  | 'toggle'
  | 'checkbox'
  | 'list'
  | 'tags'
  | 'switch'
  | 'slider'
  | 'image';

export type TInputLayout = 'horizontal' | 'vertical' | 'inline';

export interface IInputCommonProps<TValue> {
  value?: TValue;
  defaultValue?: TValue;
  name?: string;
  nowrap?: boolean;
  onChange?: (val: TValue, ev?: ChangeEvent | CheckboxChangeEvent) => unknown;
  onInput?: (val: TValue, ev?: ChangeEvent | CheckboxChangeEvent) => unknown;
  required?: boolean;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  debounce?: number;
  emptyVal?: string;
  /**
   * true if the input is in the uncontrolled mode
   * all input components except text inputs are controlled by default
   * @see https://reactjs.org/docs/uncontrolled-components.html
   */
  uncontrolled?: boolean;
  layout?: TInputLayout;
  rules?: unknown[];
}

export type ValuesOf<T extends ReadonlyArray<string>> = T[number];
export declare type SingleType<MixType> = MixType extends (infer Single)[] ? Single : MixType;

export const layoutPresets = {
  horizontal: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  vertical: {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  },
};

/**
 * A helper type for input props
 */
export type TSlobsInputProps<
  // required props
  TCustomProps extends object, // custom input props defined for SLOBS
  TValue, // the input value type
  // optional props
  TAntProps = {}, // props of the antd input that is working under the hood
  TFeatures extends keyof Partial<TAntProps> = never // props of antd input that we support
> = TCreateSlobsInputProps<TCustomProps, TValue, TAntProps, TFeatures>;

/**
 * A private helper for creating input props
 */
type TCreateSlobsInputProps<
  // use props from TSlobsInputProps:
  TCustomProps,
  TValue,
  TAntProps,
  TFeatures extends keyof Partial<TAntProps> = never,
  // generate helper props:
  TGeneratedProps = Pick<TAntProps, TFeatures> & FormItemProps & IInputCommonProps<TValue>
> = Omit<TGeneratedProps, keyof TCustomProps> & TCustomProps; // join generated props with custom props

/**
 * A base hook for inputs
 * Registers input in the Form to properly handle validations
 * and returns props for Input and Wrapper components
 */
export function useInput<
  TInputProps extends TSlobsInputProps<{}, any>,
  TValue = TInputProps['value']
>(type: TInputType, inputProps: TInputProps, antFeatures?: readonly string[]) {
  const { name, value, label } = inputProps;

  const uncontrolled = (() => {
    // inputs with debounce are always uncontrolled
    if (inputProps.debounce) return true;
    // use the value from props if provided
    if ('uncontrolled' in inputProps) return inputProps.uncontrolled;
    // the input is controlled by default
    return false;
  })();

  // get parent form if exist
  const formContext = useContext(FormContext);
  const form = formContext?.antForm;

  const inputId = useOnCreate(() => {
    // generate an unique id
    const id = `${name}-${uuid()}`;
    return id;
  });

  // create a ref for the localValue
  const localValueRef = useRef(value);
  const prevValueRef = useRef(value);

  // sync local value on props change
  if (value !== prevValueRef.current) {
    localValueRef.current = value;
    prevValueRef.current = value;
  }

  // set new local value
  // this function won't update the component
  function setLocalValue(newVal: TValue) {
    localValueRef.current = newVal;
  }

  useEffect(() => {
    // set empty string as a default empty value
    const emptyVal = typeof inputProps.emptyVal === 'undefined' ? '' : inputProps.emptyVal;

    // if the input is inside the form
    // then we need to setup it's value via Form API
    if (form && value !== emptyVal) form.setFieldsValue({ [inputId]: value });
  }, [value]);

  const forceUpdate = useForceUpdate();

  // create an `emitChange()` method and it's debounced version
  function emitChange(newVal: TValue) {
    prevValueRef.current = newVal;
    inputProps.onChange && inputProps.onChange(newVal);
  }
  const emitChangeDebounced = useDebounce(inputProps.debounce, emitChange);

  // create onChange handler
  const onChange = useCallback((newVal: TValue) => {
    if (newVal === localValueRef.current) return;
    localValueRef.current = newVal;

    // call forceUpdate if component is uncontrolled
    // controlled components should be updated automatically via props changing
    if (uncontrolled) {
      forceUpdate();
    }

    inputProps.onInput && inputProps.onInput(newVal);
    if (!inputProps.onChange) return;
    if (inputProps.debounce) {
      emitChangeDebounced(newVal);
    } else {
      emitChange(newVal);
    }
  }, []);

  // Create data-attributes for an Input element
  // These attributes help to find inputs in auto-tests
  const dataAttrs = {
    'data-type': type,
    'data-name': name,
    'data-title': label,
    'data-id': inputId,
  };

  // Create validation rules
  const rules = createValidationRules(type, inputProps);

  // pick props for the input wrapper
  const wrapperAttrs = {
    ...pick(inputProps, [
      'className',
      'style',
      'key',
      'label',
      'extra',
      'labelCol',
      'wrapperCol',
      'disabled',
      'nowrap',
      'layout',
      'rules',
    ]),
    rules,
    'data-role': 'input-wrapper',
    name: inputId,
  };

  // pick props for the input element
  const inputAttrs = {
    ...(pick(inputProps, 'disabled', 'placeholder', antFeatures || []) as {}),
    ...dataAttrs,
    'data-role': 'input',
    name: inputId,
    value: localValueRef.current,
    onChange,
  };

  return {
    inputAttrs,
    wrapperAttrs,
    forceUpdate,
    setLocalValue,
    emitChange,
  };
}

/**
 * Hook for text fields: input, textarea, password, number
 */
export function useTextInput<
  TProps extends TSlobsInputProps<
    { uncontrolled?: boolean; onBlur?: (ev: FocusEvent<any>) => unknown },
    TValue
  >,
  TValue extends string | number = string
>(p: TProps, antFeatures?: Parameters<typeof useInput>[2]) {
  // Text inputs are uncontrolled by default for better performance
  const uncontrolled = p.uncontrolled === true || p.uncontrolled !== false;
  const { inputAttrs, wrapperAttrs, forceUpdate, setLocalValue, emitChange } = useInput(
    'text',
    { uncontrolled, ...p },
    antFeatures,
  );

  // we need to handle onChange differently for text inputs
  const onChange = useCallback((ev: ChangeEvent<any>) => {
    if (!uncontrolled || p.debounce) {
      // for controlled and debounced inputs call the `onChange()` handler immediately
      inputAttrs.onChange(ev.target.value);
    } else {
      // for uncontrolled text inputs just set new localValue and update the component
      setLocalValue(ev.target.value);
      forceUpdate();
    }

    // for uncontrolled inputs the `onChange()` event handles in the `onBlur()` handler
    // use the `onInput()` event if you need to handle every keypress in controlled input
  }, []);

  const onBlur = useCallback((ev: FocusEvent<any>) => {
    // for uncontrolled components call the `onChange()` handler on blur
    const newVal = ev.target.value;
    if (uncontrolled && p.value !== newVal) {
      emitChange(newVal);
    }
    p.onBlur && p.onBlur(ev);
  }, []);

  return {
    wrapperAttrs,
    inputAttrs: {
      ...inputAttrs,
      onChange,
      onBlur,
    },
    originalOnChange: inputAttrs.onChange,
  };
}

/**
 * 2-way binding util for inputs
 *
 * @example
 * <pre>
 * function MyComponent() {
 *  const [myState, setMyState] = useState({name: '', email: ''});
 *  const bind = createBinding(myState, setMyState);
 * return <form>
 *     <input label="User Name" {...bind.name}>
 *     <input label="User Email" {...bind.email}>
 *   </form>
 *  }
 * </pre>
 */
export function createBinding<
  TState extends object,
  TFieldName extends keyof TState,
  TExtraProps extends object = {}
>(
  stateGetter: TState | (() => TState),
  setter: (newTarget: Partial<TState>) => unknown,
  extraPropsGenerator?: (fieldName: keyof TState) => TExtraProps,
): TBindings<TState, TFieldName, TExtraProps> {
  function getState(): TState {
    return typeof stateGetter === 'function'
      ? (stateGetter as Function)()
      : (stateGetter as TState);
  }
  return new Proxy(
    {},
    {
      get(t, fieldName: string) {
        const extraProps = extraPropsGenerator
          ? extraPropsGenerator(fieldName as keyof TState)
          : {};
        return {
          name: fieldName,
          value: getState()[fieldName],
          onChange(newVal: unknown) {
            setter({ ...getState(), [fieldName]: newVal });
          },
          ...extraProps,
        };
      },
    },
  ) as TBindings<TState, TFieldName, TExtraProps>;
}

export type TBindings<
  TState extends object,
  TFieldName extends keyof TState,
  TExtraProps extends object = {}
> = {
  [K in TFieldName]: {
    name: K;
    value: TState[K];
    onChange: (newVal: TState[K]) => unknown;
  } & TExtraProps;
};

function createValidationRules(type: TInputType, inputProps: IInputCommonProps<unknown>) {
  const rules = inputProps.rules ? [...inputProps.rules] : [];
  if (inputProps.required) {
    rules.push({ required: true, message: $t('The field is required') });
  }
  if (type === 'text' && inputProps.max) {
    rules.push({
      max: inputProps.max,
      message: $t('This field may not be greater than %{value} characters.', {
        value: inputProps.max,
      }),
    });
  }
  return rules;
}

/**
 * Function for creating new input components
 * For performance optimization ignores changing of all function props like onChange and onInput
 */
export function InputComponent<T extends Function>(f: T): T {
  return (React.memo(f as any, (prevProps: any, newProps: any) => {
    const keys = Object.keys(newProps);
    if (keys.length !== Object.keys(prevProps).length) return false;
    for (const key of keys) {
      if (typeof newProps[key] === 'function') continue;
      if (newProps[key] !== prevProps[key]) return false;
    }
    return true;
  }) as any) as T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import debounce from 'lodash/debounce';
import * as Yup from 'yup';
import { NamePath } from 'antd/es/form/interface';

const DEBOUNCE_WAIT = 500; // milliseconds

type FieldData = {
  name: NamePath;
  errors?: string[];
  touched?: boolean;
  validating?: boolean;
  value?: any;
};

type UseFormProps<T extends Yup.ObjectSchema<Yup.AnyObject>> = {
  form?: FormInstance<Yup.InferType<T>>;
  schema: T | null;
  onSubmit: (
    data: Yup.InferType<T> | null,
    error: Yup.ValidationError | null
  ) => void;
  validationOnChange?: boolean;
};

type UseFormReturn<T extends Yup.ObjectSchema<Yup.AnyObject>> = {
  formField: {
    form: FormInstance<Yup.InferType<T>>;
    onFinish: (values: Yup.InferType<T>) => void;
    onValuesChange: React.FormEventHandler<HTMLFormElement>;
  };
};

/**
 * Map Yup.ValidationError to Antd Form FieldData array
 * Because Yup error.path is a string with dot notation,
 * we need to convert it to NamePath type which is an array of string | number
 * For example: "user.address[0].street" => ["user", "address", 0, "street"]
 * This is to support nested fields and array fields in Antd Form
 * @see https://ant.design/components/form/#Form.Item
 */
const mapYupErrorsToFields = (error: Yup.ValidationError): FieldData[] =>
  error.inner.map(({ path, errors }) => {
    const name: NamePath =
      path
        ?.replace(/\[/g, '.')
        .replace(/\]/g, '')
        .split('.')
        .map((p) => (/^\d+$/.test(p) ? Number(p) : p)) ?? [];

    return { name, errors };
  });

export function useFormValidate<T extends Yup.ObjectSchema<Yup.AnyObject>>({
  form: externalForm,
  schema,
  onSubmit,
  validationOnChange = false,
}: UseFormProps<T>): UseFormReturn<T> {
  const [form] = Form.useForm<Yup.InferType<T>>();
  const formInstance = externalForm ?? form;
  const { getFieldsValue, setFields, getFieldError } = formInstance;

  const validateField = useCallback(
    debounce(async (fieldPath: (string | number)[], values: Yup.AnyObject) => {
      if (!schema) return;
      try {
        await schema.validateAt(fieldPath.join('.'), values);
        setFields([{ name: fieldPath as any, errors: [] }]);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setFields([{ name: fieldPath as any, errors: err.errors }]);
        }
      }
    }, DEBOUNCE_WAIT),
    [schema]
  );

  const onValuesChange = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      if (!schema || !('id' in e.target)) return;
      const target = e.target as HTMLInputElement;
      const arrIdField = target.id.split('_');
      const fieldPath = arrIdField
        .slice(1)
        .map((p) => (/^\d+$/.test(p) ? Number(p) : p));

      if (validationOnChange) {
        validateField(fieldPath, getFieldsValue());
      } else {
        const hasError = (getFieldError(fieldPath as any) as string[]).length > 0;
        if (hasError) setFields([{ name: fieldPath as any, errors: [] }]);
      }
    },
    [schema, validationOnChange]
  );

  const onFinish = useCallback(
    async (values: Yup.InferType<T>) => {
      if (!schema) return onSubmit(values, null);
      try {
        await schema.validate(values, { abortEarly: false });
        onSubmit(values, null);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const fields = mapYupErrorsToFields(err);
          setFields(fields);
          onSubmit(null, err);
        }
      }
    },
    [schema, onSubmit]
  );

  return {
    formField: {
      form: formInstance,
      onFinish,
      onValuesChange,
    },
  };
}

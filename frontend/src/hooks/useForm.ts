import { useState, ChangeEvent } from 'react';

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setFieldError = (name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const validateField = (name: keyof T, validator: (value: any) => string | null) => {
    const error = validator(values[name]);
    if (error) {
      setFieldError(name, error);
      return false;
    }
    return true;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    validateField,
  };
};

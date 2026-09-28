import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

type Props = Omit<TextFieldProps, "name"> & { name: string };

const FormTextField = ({ name, error, helperText = " ", ...props }: Props) => {
  const [field, meta] = useField<string>(name);
  const validationError = meta.touched && meta.error;

  return (
    <TextField
      {...field}
      {...props}
      error={Boolean(error || validationError)}
      helperText={error ? helperText : validationError || helperText}
    />
  );
};

export default FormTextField;

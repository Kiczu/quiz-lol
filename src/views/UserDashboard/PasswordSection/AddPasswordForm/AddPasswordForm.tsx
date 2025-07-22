import { Box, Button, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { useModal } from "../../../../context/ModalContext/ModalContext";
import { authService } from "../../../../services/authService";
import { getErrorMessage } from "../../../../utils/errorUtils";
import { inputStyle } from "../../userDashboard.style";

const validationSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[^\w]/, "Password must contain a special character"),
  confirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const AddPasswordForm = ({ email }: { email: string }) => {
  const { showModal } = useModal();

  const handleSubmit = async (
    values: { password: string; confirm: string },
    { resetForm }: any
  ) => {
    try {
      await authService.setPasswordForGoogleUser(email, values.password);
      showModal({
        title: "Success",
        content: "Password set! You can now log in with email and password.",
        variant: "success",
      });
      resetForm();
    } catch (err) {
      showModal({
        title: "Error",
        content: getErrorMessage(err),
        variant: "error",
      });
    }
  };

  return (
    <Formik
      initialValues={{ password: "", confirm: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <Form>
          <Box>
            <Typography mb={2}>Add password to your account:</Typography>
            <TextField
              name="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              sx={inputStyle}
              error={touched.password && Boolean(errors.password)}
              helperText={
                touched.password && errors.password ? errors.password : " "
              }
              autoComplete="new-password"
            />
            <TextField
              name="confirm"
              label="Confirm Password"
              type="password"
              value={values.confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              sx={inputStyle}
              error={touched.confirm && Boolean(errors.confirm)}
              helperText={
                touched.confirm && errors.confirm ? errors.confirm : " "
              }
              autoComplete="new-password"
            />
            <Button type="submit" variant="contained">
              Set Password
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddPasswordForm;

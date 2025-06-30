import { Box, Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { useModal } from "../../../../context/ModalContext/ModalContext";
import { authService } from "../../../../services/authService";
import { getErrorMessage } from "../../../../utils/errorUtils";

import { inputStyle } from "../../userDashboard.style";

const validationSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[^\w]/, "Password must contain a special character"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePasswordForm = () => {
  const { showModal } = useModal();

  const handlePasswordChange = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await authService.updateUserPassword(
        values.newPassword,
        values.currentPassword
      );
      showModal({
        variant: "success",
        title: "Success",
        content: "Password changed successfully!",
      });
    } catch (error: unknown) {
      showModal({
        variant: "error",
        title: "Error",
        content: getErrorMessage(error),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handlePasswordChange}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <Form>
          <Box>
            <TextField
              name="currentPassword"
              label="Current Password"
              type="password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              error={touched.currentPassword && Boolean(errors.currentPassword)}
              helperText={
                touched.currentPassword && errors.currentPassword
                  ? errors.currentPassword
                  : " "
              }
              autoComplete="current-password"
            />
            <TextField
              name="newPassword"
              label="New Password"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              error={touched.newPassword && Boolean(errors.newPassword)}
              helperText={
                touched.newPassword && errors.newPassword
                  ? errors.newPassword
                  : " "
              }
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={
                touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : " "
              }
            />
            <Button type="submit" variant="contained">
              Change Password
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;

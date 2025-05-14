import { useState } from "react";
import * as yup from "yup";
import { Box, TextField, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { inputStyle } from "../userDashboard.style";
import { authService } from "../../../services/authService";

const validationSchema = yup.object({
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await authService.changePassword(values.newPassword);
      setSuccess("Password changed successfully!");
      setError(null);
    } catch (error) {
      setError("Failed to change password. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={handlePasswordChange}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <Form>
          <Box>
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

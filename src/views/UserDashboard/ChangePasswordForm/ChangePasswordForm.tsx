import * as yup from "yup";
import { Box, TextField, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { authService } from "../../../services/authService";
import { useModal } from "../../../context/ModalContext/ModalContext";
import { inputStyle } from "../userDashboard.style";

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
  const { showModal, requestReauthentication } = useModal();

  const handlePasswordChange = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    const user = authService.getCurrentUser();
    if (!user || !user.email) {
      showModal({
        variant: "error",
        title: "Error",
        content: "User not authenticated.",
      });
      return;
    }

    try {
      await authService.updateUserPassword(values.newPassword);
      showModal({
        variant: "success",
        title: "Success",
        content: "Password updated successfully.",
      });
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        try {
          const currentPassword = await requestReauthentication();
          await authService.updateUserPassword(
            values.newPassword,
            currentPassword
          );
          showModal({
            variant: "success",
            title: "Success",
            content: "Password updated successfully.",
          });
        } catch (reauthError: any) {
          showModal({
            variant: "error",
            title: "Reauthentication failed",
            content: reauthError.message || "Failed to reauthenticate.",
          });
        }
      } else {
        showModal({
          variant: "error",
          title: "Error",
          content: error.message || "Failed to change password.",
        });
      }
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

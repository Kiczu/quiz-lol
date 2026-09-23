import { Box, Button } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";

import FormTextField from "../../../../components/FormTextField/FormTextField";
import { useModal } from "../../../../context/ModalContext/ModalContext";
import { authService } from "../../../../services/authService";
import { getErrorMessage } from "../../../../utils/errorUtils";
import { confirmPasswordSchema, passwordSchema } from "../../../../utils/passwordValidation";
import { inputStyle } from "../../userDashboard.style";

const validationSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: passwordSchema.required("New password is required"),
  confirmPassword: confirmPasswordSchema("newPassword"),
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
      {({ isSubmitting }) => (
        <Form>
          <Box>
            <FormTextField
              name="currentPassword"
              label="Current Password"
              type="password"
              fullWidth
              variant="outlined"
              sx={inputStyle}
              autoComplete="current-password"
            />
            <FormTextField
              name="newPassword"
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              sx={inputStyle}
            />
            <FormTextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              sx={inputStyle}
            />
            <Button type="submit" disabled={isSubmitting} variant="contained">
              Change Password
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;

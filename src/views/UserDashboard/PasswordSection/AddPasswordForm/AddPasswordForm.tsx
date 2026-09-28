import { Box, Button, Typography } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";

import FormTextField from "../../../../components/FormTextField/FormTextField";
import { useModal } from "../../../../context/ModalContext/ModalContext";
import { authService } from "../../../../services/authService";
import { getErrorMessage } from "../../../../utils/errorUtils";
import { confirmPasswordSchema, passwordSchema } from "../../../../utils/passwordValidation";
import { inputStyle } from "../../userDashboard.style";

const validationSchema = yup.object({
  password: passwordSchema,
  confirm: confirmPasswordSchema("password"),
});

interface Values {
  password: string;
  confirm: string;
}

const AddPasswordForm = ({ email }: { email: string }) => {
  const { showModal } = useModal();

  const handleSubmit = async (
    values: Values,
    { resetForm }: FormikHelpers<Values>
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
      {({ isSubmitting }) => (
        <Form>
          <Box>
            <Typography mb={2}>Add password to your account:</Typography>
            <FormTextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              sx={inputStyle}
              autoComplete="new-password"
            />
            <FormTextField
              name="confirm"
              label="Confirm Password"
              type="password"
              fullWidth
              sx={inputStyle}
              autoComplete="new-password"
            />
            <Button type="submit" disabled={isSubmitting} variant="contained">
              Set Password
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddPasswordForm;

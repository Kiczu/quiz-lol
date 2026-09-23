import {
  Avatar,
  Button,
  Typography,
  Grid,
  Box,
  Link,
} from "@mui/material";
import { Form, Formik } from "formik";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";

import FormTextField from "../../../components/FormTextField/FormTextField";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import { useModal } from "../../../context/ModalContext/ModalContext";
import { paths } from "../../../paths";
import { getErrorMessage } from "../../../utils/errorUtils";
import { confirmPasswordSchema, passwordSchema } from "../../../utils/passwordValidation";

import type { UserPrivateData } from "../../../api/types";

const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  firstName: yup.string().required("Name is required"),
  lastName: yup.string().required("Surname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema("password"),
});

interface RegistrationFormData extends Omit<UserPrivateData, "uid"> {
  username: string;
  password: string;
  confirmPassword: string;
}

const initValues: RegistrationFormData = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = () => {
  const { showModal, showErrorModal } = useModal();
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (values: RegistrationFormData) => {
    const { username, firstName, lastName, email, password } = values;

    try {
      await handleRegister(email, password, {
        username,
        firstName,
        lastName,
      });
      showModal({
        title: "Success",
        content: "Registration successful!",
        variant: "success",
        onConfirm: () => navigate(paths.DASHBOARD),
      });
    } catch (error: unknown) {
      showErrorModal(getErrorMessage(error));
    }
  };

  const formFields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      autoComplete: "username",
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      autoComplete: "given-name",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      autoComplete: "family-name",
    },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      autoComplete: "new-password",
    },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Avatar sx={{ bgcolor: "secondary.main" }} />
      <Typography component="h1" variant="h5" mb={2} mt={1}>
        Sign up
      </Typography>
      <Formik
        initialValues={initValues}
        onSubmit={handleSubmit}
        validationSchema={registerSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              {formFields.map(({ name, label, type, autoComplete }) => (
                <Grid
                  item
                  xs={12}
                  sm={["username", "email"].includes(name) ? 12 : 6}
                  key={name}
                >
                  <FormTextField
                    fullWidth
                    label={label}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    helperText={null}
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to={paths.LOGIN} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterForm;

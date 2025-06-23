import * as yup from "yup";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { UserPrivateData } from "../../../api/types";
import { paths } from "../../../paths";
import { authService } from "../../../services/authService";
import { useModal } from "../../../context/ModalContext/ModalContext";
import { getErrorMessage } from "../../../utils/errorUtils";

const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  firstName: yup.string().required("Name is required"),
  lastName: yup.string().required("Surname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^\w]/, "Password must contain at least one special character"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
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
  const navigate = useNavigate();
  const handleSubmit = async (values: RegistrationFormData) => {
    const { username, firstName, lastName, email, password } = values;

    try {
      await authService.registerUser(email, password, {
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
        {({
          values,
          handleBlur,
          handleChange,
          handleSubmit,
          errors,
          touched,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {formFields.map(({ name, label, type, autoComplete }) => (
                <Grid
                  item
                  xs={12}
                  sm={["username", "email"].includes(name) ? 12 : 6}
                  key={name}
                >
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    value={values[name as keyof RegistrationFormData]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched[name as keyof RegistrationFormData] &&
                      Boolean(errors[name as keyof RegistrationFormData])
                    }
                    helperText={
                      touched[name as keyof RegistrationFormData] &&
                      errors[name as keyof RegistrationFormData]
                    }
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
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

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
import { Link as RouterLink } from "react-router-dom";
import { Form, Formik } from "formik";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import type { UserDataResponseRegister } from "../../../api/types";
import { paths } from "../../../paths";

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

interface RegistrationData extends UserDataResponseRegister {
  confirmPassword: string;
}

const initValues: RegistrationData = {
  uid: "",
  avatar: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
};

const RegisterForm = () => {
  const { handleCreateUser } = useAuth();

  const handleSubmit = (values: UserDataResponseRegister) =>
    handleCreateUser(values);

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
      <Avatar sx={{ bgcolor: "secondary.main" }}></Avatar>
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
            <Grid container spacing={1}>
              {formFields.map(({ name, label, type, autoComplete }) => (
                <Grid item xs={12} sm={name === "username" ? 12 : 6} key={name}>
                  <TextField
                    fullWidth
                    name={name}
                    label={label}
                    type={type}
                    autoComplete={autoComplete}
                    value={values[name as keyof typeof values]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(touched[name as keyof typeof values]) &&
                      Boolean(errors[name as keyof typeof values])
                    }
                    helperText={
                      touched[name as keyof typeof values] &&
                      errors[name as keyof typeof values]
                        ? errors[name as keyof typeof values]
                        : " "
                    }
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign up
            </Button>
          </Form>
        )}
      </Formik>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to={paths.RESET_PASSWORD}>
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to={paths.LOGIN}>
            Have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;

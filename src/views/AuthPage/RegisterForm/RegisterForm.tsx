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
  firstName: yup.string().required("Imię jest wymagane"),
  lastName: yup.string().required("Nazwisko jest wymagane"),
  email: yup
    .string()
    .email("Wprowadź poprawny adres E-Mail")
    .required("E-Mail jest wymagany"),
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .matches(/[A-Z]/, "Hasło musi zawierać dużą literę")
    .matches(/[0-9]/, "Hasło musi zawierać cyfrę")
    .matches(/[^\w]/, "Hasło musi zawierać znak specjalny"),
  confirmPassword: yup
    .string()
    .required("Hasła muszą być takie same")
    .oneOf([yup.ref("password")], "Hasła muszą być takie same"),
});

interface RegistrationData extends UserDataResponseRegister {
  confirmPassword: string;
}

const initValues: RegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = () => {
  const { handleCreateUser } = useAuth();

  const handleSubmit = (values: UserDataResponseRegister) => handleCreateUser(values);

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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First name"
                  autoFocus
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={
                    touched.firstName && errors.firstName
                      ? errors.firstName
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="family-name"
                  name="lastName"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={
                    touched.lastName && errors.lastName ? errors.lastName : " "
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  name="email"
                  fullWidth
                  id="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={
                    touched.email && errors.email ? errors.email : " "
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={
                    touched.password && errors.password ? errors.password : " "
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(touched.confirmPassword) &&
                    Boolean(errors.confirmPassword)
                  }
                  helperText={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : " "
                  }
                />
              </Grid>
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

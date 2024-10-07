import * as yup from "yup";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Container,
  Link,
  Grid,
  Box,
  CssBaseline,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { paths } from "../../paths";
import type { UserData } from "../../api/types";
import { FormContainer } from "./register.style";

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

interface RegistrationData extends UserData {
  confirmPassword: string;
}

const initValues: RegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterPage = () => {
  const { handleCreateUser } = useAuth();

  const handleSubmit = (values: UserData) => handleCreateUser(values);

  return (
    <Container component="div" maxWidth="xs">
      <CssBaseline enableColorScheme />
      <Box sx={FormContainer}>
        <Avatar sx={{ m: 1 }}></Avatar>
        <Typography component="h1" variant="h5" margin={2}>
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
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={
                      touched.lastName && errors.lastName
                        ? errors.lastName
                        : " "
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
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={
                      touched.password && errors.password
                        ? errors.password
                        : " "
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
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href={paths.LOGIN} variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default RegisterPage;

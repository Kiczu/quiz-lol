import * as yup from "yup";
import { Avatar, Button, TextField, Box, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useAuth } from "../../../context/LoginContext/LoginContext";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("E-Mail is required"),
  password: yup.string().required("Password is required"),
});

interface Values {
  email: string;
  password: string;
}

const initValues: Values = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const { handleSignIn } = useAuth();

  const handleSubmit = ({ email, password }: Values) => {
    handleSignIn(email, password);
  };

  return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
      <Formik
        initialValues={initValues}
        onSubmit={handleSubmit}
        validationSchema={loginSchema}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          errors,
          touched,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="E-Mail"
                name="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email ? errors.email : " "}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={
                  touched.password && errors.password ? errors.password : " "
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;

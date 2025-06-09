import * as yup from "yup";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import { useModal } from "../../../context/ModalContext/ModalContext";
import { paths } from "../../../paths";

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
  const { showModal } = useModal();
  const { handleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }: Values) => {
    try {
      await handleSignIn(email, password);
      showModal({
        title: "Welcome!",
        content: "You have successfully logged in.",
        variant: "success",
        onConfirm: () => navigate(paths.DASHBOARD),
      });
    } catch (error: any) {
      if(error.code === "auth/user-not-found") {
        showModal({
          title: "User not found",
          content: "The user with the provided email does not exist.",
          variant: "error",
        });
      } else if (error.code === "auth/wrong-password") {
        showModal({
          title: "Wrong password",
          content: "The password you entered is incorrect.",
          variant: "error",
        });
      } else {
        showModal({
          title: "An error occurred",
          content: "Please try again later.",
          variant: "error",
        });
      }
    }
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
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to={paths.RESET_PASSWORD}>
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to={paths.REGISTER}>
            Don't have an account? Sign up
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;

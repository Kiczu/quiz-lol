import { Box, Button, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";

import { EditableUserFields, RawUserData } from "../../../api/types";
import FormTextField from "../../../components/FormTextField/FormTextField";
import { useModal } from "../../../context/ModalContext/ModalContext";
import { useUsernameValidation } from "../../../hooks/useUsernameValidation";
import { colors } from "../../../theme/colors";
import { getErrorMessage, isFirebaseCode } from "../../../utils/errorUtils";
import { inputStyle } from "../userDashboard.style";

type EditUserFormProps = {
  userData: RawUserData;
  updateUserData: (values: EditableUserFields) => Promise<void>;
};

const validationSchema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email("Invalid email"),
  username: yup
    .string()
    .test("is-username-editable", "Username is required", (value, context) => {
      return context.options.context?.isUsername ? !!value : true;
    }),
});

const EditUserForm = ({
  userData,
  updateUserData,
}: EditUserFormProps) => {
  const { showModal } = useModal();

  const { usernameError, validateUsername } = useUsernameValidation(
    userData?.username
  );

  if (!userData) return null;

  const isUsername = !userData.username;

  const handleSubmit = async (values: EditableUserFields): Promise<void> => {
    if (!userData) return;

    const isUnchanged =
      values.username === userData.username &&
      values.firstName === userData.firstName &&
      values.lastName === userData.lastName &&
      values.email === userData.email;

    if (isUnchanged) return;

    try {
      await updateUserData(values);
      showModal({
        title: "Success",
        content: "User data updated successfully",
        variant: "success",
      });
    } catch (error: unknown) {
      if (isFirebaseCode(error, "email-change")) {
        showModal({
          title: "Email Change Required",
          content: getErrorMessage(error),
          variant: "info",
        });
      } else {
        showModal({
          title: "Error",
          content: getErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  return (
    <Formik<EditableUserFields>
      initialValues={{
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleBlur, isSubmitting }) => {
        const handleUsernameBlur = async (
          e: React.FocusEvent<HTMLInputElement>
        ) => {
          handleBlur(e);
          if (!isUsername) return;
          await validateUsername(e.target.value.trim());
        };
        return (
          <Form>
            <Box mb={3}>
              {isUsername && (
                <Typography color={colors.warning} sx={{ mb: 2 }}>
                  To finish setting up your account, please choose a username.
                </Typography>
              )}
              <FormTextField
                name="username"
                label="Username"
                onBlur={handleUsernameBlur}
                fullWidth
                variant="outlined"
                sx={inputStyle}
                disabled={!isUsername}
                error={Boolean(usernameError)}
                helperText={
                  usernameError || (isUsername
                    ? "The username is permanent, choose wisely!"
                    : "You cannot change your username")
                }
              />

              <FormTextField
                name="firstName"
                label="First Name"
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />
              <FormTextField
                name="lastName"
                label="Last Name"
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />
              <FormTextField
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                sx={inputStyle}
                helperText={null}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                sx={{ mt: 3 }}
              >
                Save Changes
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditUserForm;

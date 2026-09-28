import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form, Formik } from "formik";
import { expect, it, vi } from "vitest";
import * as yup from "yup";

import FormTextField from "./FormTextField";

it("binds values and shows validation only after blur", async () => {
  const submit = vi.fn();
  render(
    <Formik initialValues={{ name: "" }} onSubmit={submit}
      validationSchema={yup.object({ name: yup.string().required("Name required") })}>
      <Form>
        <FormTextField name="name" label="Name" helperText="Your name" />
        <button type="submit">Save</button>
      </Form>
    </Formik>
  );
  const input = screen.getByRole("textbox");
  expect(screen.queryByText("Name required")).not.toBeInTheDocument();
  fireEvent.blur(input);
  expect(await screen.findByText("Name required")).toBeInTheDocument();
  fireEvent.change(input, { target: { value: "Annie" } });
  fireEvent.click(screen.getByText("Save"));
  await waitFor(() => expect(submit).toHaveBeenCalledWith({ name: "Annie" }, expect.anything()));
  expect(screen.getByText("Your name")).toBeInTheDocument();
});

it("preserves external errors and custom blur handlers", () => {
  const onBlur = vi.fn();
  render(
    <Formik initialValues={{ name: "Annie" }} onSubmit={vi.fn()}>
      <FormTextField name="name" label="Name" error helperText="Already taken" onBlur={onBlur} />
    </Formik>
  );
  expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Already taken")).toBeInTheDocument();
  fireEvent.blur(screen.getByRole("textbox"));
  expect(onBlur).toHaveBeenCalledOnce();
});

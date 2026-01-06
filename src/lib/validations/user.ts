import { z } from "zod";

export const userCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});

export const userUpdateSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    email: z.email("Invalid email address").optional(),
    phoneNumber: z.string().min(1, "Phone number is required").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    role: z.enum(["ADMIN", "STAFF"]).optional(),
  })
  .refine(
    (data) =>
      data.firstName !== undefined ||
      data.lastName !== undefined ||
      data.username !== undefined ||
      data.email !== undefined ||
      data.phoneNumber !== undefined ||
      data.password !== undefined ||
      data.role !== undefined,
    { message: "At least one field must be provided" }
  );

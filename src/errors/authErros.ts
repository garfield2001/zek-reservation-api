import { AppError } from "@/lib/errors";

export class AuthError extends AppError {
  constructor(message: string, status: number, code = "AUTH_ERROR") {
    super(message, status, code);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }
}

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404, "USER_NOT_FOUND");
  }
}

export class DuplicateUserError extends AppError {
  constructor() {
    super(
      "User with this email or username already exists",
      409,
      "USER_ALREADY_EXISTS"
    );
  }
}


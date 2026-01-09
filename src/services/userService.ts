import bcrypt from "bcryptjs";
import {
  CreateUserData,
  UpdateUserData,
  PublicUser,
  CreateUserInput,
  UpdateUserInput,
} from "@/types/types";
import {
  UserRepository,
  getPrismaErrorCode,
} from "@/repositories/userRepository";
import { UserNotFoundError, DuplicateUserError } from "@/errors/authErros";
import { toPublicUser } from "@/mappers/userMapper";

export interface UserService {
  createUser(input: CreateUserInput): Promise<PublicUser>;
  listUsers(): Promise<PublicUser[]>;
  getUserById(id: number): Promise<PublicUser>;
  updateUser(id: number, input: UpdateUserInput): Promise<PublicUser>;
  deleteUser(id: number): Promise<void>;
}

export function createUserService(userRepository: UserRepository): UserService {
  return {
    async createUser(input) {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 10);

        const data: CreateUserData = {
          firstName: input.firstName,
          lastName: input.lastName,
          username: input.username,
          email: input.email,
          phoneNumber: input.phoneNumber,
          password: hashedPassword,
          role: input.role,
        };

        const user = await userRepository.create(data);

        return toPublicUser(user);
      } catch (error) {
        const code = getPrismaErrorCode(error);
        if (code === "P2002") {
          throw new DuplicateUserError();
        }
        throw error;
      }
    },

    async listUsers() {
      const users = await userRepository.list();
      return users.map(toPublicUser);
    },

    async getUserById(id) {
      const user = await userRepository.findById(id);

      if (!user) {
        throw new UserNotFoundError();
      }

      return toPublicUser(user);
    },

    async updateUser(id, input) {
      const data: UpdateUserData = {};

      if (input.firstName !== undefined) data.firstName = input.firstName;
      if (input.lastName !== undefined) data.lastName = input.lastName;
      if (input.username !== undefined) data.username = input.username;
      if (input.email !== undefined) data.email = input.email;
      if (input.phoneNumber !== undefined) data.phoneNumber = input.phoneNumber;
      if (input.role !== undefined) data.role = input.role;

      if (input.password !== undefined) {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        data.password = hashedPassword;
      }

      try {
        const user = await userRepository.update(id, data);

        return toPublicUser(user);
      } catch (error) {
        const code = getPrismaErrorCode(error);

        if (code === "P2025") {
          throw new UserNotFoundError();
        }

        if (code === "P2002") {
          throw new DuplicateUserError();
        }

        throw error;
      }
    },

    async deleteUser(id) {
      try {
        await userRepository.delete(id);
      } catch (error) {
        const code = getPrismaErrorCode(error);

        if (code === "P2025") {
          throw new UserNotFoundError();
        }

        throw error;
      }
    },
  };
}

import { prismaUserRepository } from "@/repositories/userRepository";

const defaultUserService = createUserService(prismaUserRepository);

export const createUser =
  defaultUserService.createUser.bind(defaultUserService);
export const listUsers = defaultUserService.listUsers.bind(defaultUserService);
export const getUserById =
  defaultUserService.getUserById.bind(defaultUserService);
export const updateUser =
  defaultUserService.updateUser.bind(defaultUserService);
export const deleteUser =
  defaultUserService.deleteUser.bind(defaultUserService);

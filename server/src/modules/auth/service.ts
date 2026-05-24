import { ApiError } from "../../lib/http.js";
import { hashPassword, signToken, verifyPassword } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { defaultCategoryData } from "../categories/service.js";

export async function signUp(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ApiError(409, "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      memberships: {
        create: {
          role: "OWNER",
          workspace: {
            create: {
              name: "Personal",
              type: "PERSONAL"
            }
          }
        }
      }
    },
    include: {
      memberships: {
        include: {
          workspace: true
        }
      }
    }
  });

  const personalWorkspace = user.memberships[0]?.workspace;
  if (personalWorkspace) {
    await prisma.category.createMany({
      data: defaultCategoryData(personalWorkspace.id),
      skipDuplicates: true
    });
  }

  return {
    token: signToken(user.id),
    user: {
      id: user.id,
      email: user.email
    },
    workspaces: user.memberships.map((membership) => membership.workspace)
  };
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: {
          workspace: true
        }
      }
    }
  });

  if (!user) {
    throw new ApiError(401, "INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "INVALID_CREDENTIALS");
  }

  return {
    token: signToken(user.id),
    user: {
      id: user.id,
      email: user.email
    },
    workspaces: user.memberships.map((membership) => membership.workspace)
  };
}

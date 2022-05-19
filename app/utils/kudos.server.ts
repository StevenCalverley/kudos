// app/utils/kudos.server.ts

import { db } from "./db.server";
import type { KudoStyle, Prisma } from "@prisma/client";

export const createKudo = async (
  message: string,
  userId: string,
  recipientId: string,
  style: KudoStyle
) => {
  await db.kudo.create({
    data: {
      // 1
      message,
      style,
      // 2
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
    },
  });
};

export const getFilteredKudos = async (
  userId: string,
  sortFilter: Prisma.KudoOrderByWithRelationInput,
  whereFilter: Prisma.KudoWhereInput
) => {
  return await db.kudo.findMany({
    select: {
      id: true,
      style: true,
      message: true,
      author: {
        select: {
          profile: true,
        },
      },
    },
    orderBy: {
      ...sortFilter,
    },
    where: {
      recipientId: userId,
      ...whereFilter,
    },
  });
};

export const getRecentKudos = async () => {
  return await db.kudo.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      style: {
        select: {
          emoji: true,
        },
      },
      recipient: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
  });
};

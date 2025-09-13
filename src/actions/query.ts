"use server";
import dbClient from "@/db";

export async function createQuery(email: string, query: string) {
  return dbClient.query.create({
    data: {
      email,
      query,
    },
  });
}

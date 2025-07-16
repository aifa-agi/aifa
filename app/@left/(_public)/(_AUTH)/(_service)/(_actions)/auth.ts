// @/app/@left/(_public)/(_AUTH)/(auth)/(_service)/(_actions)/auth.ts

import NextAuth, { type DefaultSession, type Profile } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserType } from "@prisma/client";
import { compare } from "bcrypt-ts";

// Провайдеры
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

// Логика и утилиты ANMA
import { prisma } from "@/lib/db";
import { getUserById } from "../(_db-queries)/user-queries";
import { syncRoleUsersWithEnv } from "../(_libs)/sync-role-users";
import { createGuestUser } from "../(_db-queries)/create-guest-user";
import { getUser } from "../(_db-queries)/get-user";
import { DUMMY_PASSWORD } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_constants)/constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type: UserType;
      name?: string;
    } & DefaultSession["user"];
  }
}

const providers: Provider[] = [
  Credentials({
    credentials: {},
    async authorize({ email, password }: any) {
      if (!email || !password) return null;
      const normalizedEmail = email.toLowerCase();

      // Получаем пользователя с этим email из базы
      const users = await getUser(normalizedEmail);
      if (!users.length) {
        // Защита от timing attack
        await compare(password, DUMMY_PASSWORD);
        return null;
      }

      // Проверяем поочередно все роли
      const user =
        users.find((u) => u.type === "architect") ||
        users.find((u) => u.type === "admin") ||
        users.find((u) => u.type === "editor") ||
        users[0];

      if (!user.password) {
        await compare(password, DUMMY_PASSWORD);
        return null;
      }

      const passwordsMatch = await compare(password, user.password);

      if (!passwordsMatch) {
        if (user.type === "architect")
          throw new Error("architect_password_incorrect");
        if (user.type === "admin") throw new Error("admin_password_incorrect");
        if (user.type === "editor")
          throw new Error("editor_password_incorrect");
        return null;
      }
      // Возвращаем пользователя с правильным типом
      return {
        id: user.id,
        email: user.email,
        type: user.type as UserType,
      };
    },
  }),
  Credentials({
    id: "guest",
    credentials: {},
    async authorize() {
      const guestUser = await createGuestUser();
      return { ...guestUser, type: "guest" };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
  providers.push(
    Resend({ apiKey: process.env.RESEND_API_KEY, from: process.env.EMAIL_FROM })
  );
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  events: {
    // This event is triggered EVERY TIME on successful sign-in
    async signIn({ user, account, profile }) {
      // Sync privileged roles from .env on every sign-in to keep them up to date
      if (user) {
        await syncRoleUsersWithEnv();
      }

      // If the user signs in with Google, update their email and image.
      // This ensures the data is always fresh from the provider.
      if (account?.provider === "google" && user && profile?.email) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            email: profile.email,
            // Conditionally update the image only if profile.picture exists
            ...(profile.picture && { image: profile.picture }),
          },
        });
      }
    },
    // This event is triggered ONLY ONCE when a user links an account
    async linkAccount({ user }) {
      // When a user links a new account (e.g., first time with Google/Resend),
      // set their role to a standard authenticated user.
      await prisma.user.update({
        where: { id: user.id },
        data: { type: UserType.authUser },
      });
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.type = (user as any).type;
      }
      if (token.sub) {
        try {
          // Пытаемся обновить данные с коротким timeout
          const dbUser = await getUserById(token.sub, {
            retries: 1,
            timeout: 3000,
            throwOnError: false,
          });

          if (dbUser) {
            token.type = dbUser.type;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
          } else {
            console.warn(
              `Could not refresh user data for ${token.sub}, using cached token data`
            );
          }
        } catch (error) {
          console.error(
            "Failed to refresh user data, using cached token:",
            error
          );
          await signOut({
            redirectTo: "/login",
          });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        if (token.type) session.user.type = token.type as UserType;
        session.user.name = token.name || "";
        session.user.image = token.picture;
      }
      return session;
    },
  },
});

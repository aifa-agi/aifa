// @/app\@left\(_public)\(_CHAT-FRACTAL)\(chat)\(_service)\(_constants)\constants.ts

import { generateDummyPassword } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_libs)/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

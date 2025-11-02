import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from "next";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  // Next.js 16でTurbopackがデフォルトのため、Turbopack設定を追加
  turbopack: {},
};

export default withVanillaExtract(nextConfig);

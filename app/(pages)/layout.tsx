"use client";

import { Layout } from '../../components/common/Layout';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}

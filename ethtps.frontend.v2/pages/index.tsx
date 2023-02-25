import Link from "next/link";
import Layout from "../components/Layout";
import { TestPage } from "ethtps.pages";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <TestPage />
    <p>
      <Link href="/about">About</Link>
    </p>
  </Layout>
);

export default IndexPage;

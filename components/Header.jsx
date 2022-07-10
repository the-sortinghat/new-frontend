import Head from "next/head";

const Header = ({
  title,
  description = "A tool to characterize the architecture of service-based systems",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Header;

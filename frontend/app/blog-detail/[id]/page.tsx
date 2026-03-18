import React from "react";

interface pageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: pageProps) => {
  const { id } = await params;
  return (
    <div className="text-black pt-24">
      <h1>hello</h1>
      {id}
    </div>
  );
};

export default page;

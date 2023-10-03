import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs, api } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";

dayjs.extend(relativeTime);

const Sidebar = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="w-72 p-10">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <Image
            src={user.imageUrl}
            alt="Profile image"
            width={80}
            height={80}
            className="rounded-2xl"
          />
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div>
          <li className="flex list-none flex-col gap-3 font-bold">
            <ul className="cursor-pointer hover:text-primary">
              <Link href="/dashboard">Dashboard</Link>
            </ul>
            <ul className="cursor-pointer hover:text-primary">Archive</ul>
            <ul className="cursor-pointer hover:text-primary">Settings</ul>
            <ul className="cursor-pointer hover:text-primary">Account</ul>
          </li>
        </div>
      </div>
    </div>
  );
};

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;

  const postIcon = {
    TWITTER: "/x.png",
    LINKEDIN: "/linkedin.png",
  };

  return (
    <div
      className="flex gap-3 overflow-hidden break-words px-2 py-4"
      key={post.id}
    >
      <div>
        <Image
          src={postIcon[post.platform]}
          width={50}
          height={50}
          alt="Author profile image"
          className="rounded-full"
        />
      </div>
      <div className="block">
        <h3>{post.content}</h3>
        <p className="font-thin ">
          {`${dayjs(post.postDate).fromNow()} (${dayjs(post.postDate).format(
            "DD/MM/YYYY HH:mm",
          )})`}
        </p>
      </div>
    </div>
  );
};

const RightContent = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="grow bg-slate-600 px-14 py-8">
      {!data && <div>Something went wrong...</div>}
      <h1 className="text-lg font-bold">Scheduled posts</h1>
      {!!data &&
        data.map((fullPost) => (
          <PostView key={fullPost.post.id} {...fullPost} />
        ))}
    </section>
  );
};

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.createPost.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="rounded p-4 text-slate-900"
        cols={20}
        rows={5}
      />
      <div className="flex justify-end gap-3 text-sm">
        <Button
          onClick={() =>
            mutate({
              content: input,
              platform: "TWITTER",
              postDate: dayjs().toDate(),
            })
          }
          disabled={isPosting}
        >
          Post now
        </Button>
        <Button disabled={isPosting}>Schedule post</Button>
      </div>
    </>
  );
};

const Content = () => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl text-white xl:flex-row">
      <section id="main-content" className="bg-slate-400 px-14 py-8 xl:w-[70%]">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <CreatePostWizard />
        </div>
      </section>
      <RightContent />
    </div>
  );
};

const Dashboard = () => {
  return (
    <main className="h-screen p-8">
      <div className="flex gap-8">
        <Sidebar />
        <Content />
      </div>
    </main>
  );
};

export default Dashboard;

import AuthenticatedLayout from "@/components/authenticated-layout";
import { Spinner } from "@/components/ui/spinner";
import { type RouterOutputs, api } from "@/utils/api";
import { Linkedin, Twitter } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Archive = () => {
  return (
    <AuthenticatedLayout>
      <Content />
    </AuthenticatedLayout>
  );
};

const Content = () => {
  return (
    <section
      id="main-content"
      className="w-full rounded-2xl bg-slate-600 px-10 py-12 text-white"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Posts archive</h1>
        <PostsList />
      </div>
    </section>
  );
};

const PostsList = () => {
  const { data, isLoading, isError, isSuccess } =
    api.posts.getAllArchived.useQuery();

  return (
    <section>
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {isError && (
        <h3 className="text-md pt-4 text-destructive">
          Failed to fetch archived posts.
        </h3>
      )}

      {isSuccess && (
        <div>
          {data.length === 0 && (
            <h3 className="text-md pt-4 text-slate-300">
              No archived posts yet.
            </h3>
          )}
          {data.map((post) => (
            <PostItem key={post.id} {...post} />
          ))}
        </div>
      )}
    </section>
  );
};

type Post = RouterOutputs["posts"]["getAll"][number];

const PostItem = (props: Post) => {
  const { content, postDate, platforms } = props;

  const platformIcons = {
    TWITTER: <Twitter size={16} />,
    LINKEDIN: <Linkedin size={16} />,
  };

  return (
    <div className="flex gap-3 overflow-hidden break-words py-4">
      <div className="block">
        <h3>{content}</h3>
        <p className="font-thin ">
          {`${dayjs(postDate).fromNow()} (${dayjs(postDate).format(
            "DD/MM/YYYY HH:mm",
          )})`}
        </p>
        <p className="flex items-center gap-2 text-sm font-light">
          {platforms.map((platform) => (
            <span key={platform.id}>{platformIcons[platform.name]}</span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default Archive;

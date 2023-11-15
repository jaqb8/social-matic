import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { type RouterOutputs, api } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { CalendarIcon, Linkedin, Loader2, Twitter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatValueWithinRange } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { PlatformEnum } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import AuthenticatedLayout from "@/components/authenticated-layout";
import Link from "next/link";
import { type OAuthProvider } from "@clerk/nextjs/dist/types/server";

dayjs.extend(relativeTime);

const Dashboard = () => {
  return (
    <AuthenticatedLayout>
      <Content />
    </AuthenticatedLayout>
  );
};

const Content = () => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl text-white xl:flex-row">
      <section
        id="main-content"
        className="bg-slate-400 px-10 py-12 xl:w-[70%]"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <CreatePostWizard />
        </div>
      </section>
      <PostsList />
    </div>
  );
};

const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.createPost.useMutation({
    onSuccess: (data) => {
      console.log(`Post scheduled! ${JSON.stringify(data)}`);
      void ctx.posts.getAllScheduled.invalidate();
      toast.success("Post scheduled!");
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to schedule post! Please try again.");
      }
    },
  });

  const formSchema = z.object({
    content: z
      .string()
      .min(1, {
        message: "Your post must be at least 1 character long.",
      })
      .max(255, {
        message: "Your post must be at most 255 characters long.",
      }),
    platforms: z.array(PlatformEnum).nonempty({
      message: "You have to select at least one platform.",
    }),
    postDate: z.date({
      required_error: "You have to select a date.",
    }),
    postTime: z
      .object({
        hour: z
          .string()
          .min(1, {
            message: "You have to select a valid hour.",
          })
          .max(2, {
            message: "You have to select a valid hour.",
          }),
        minute: z
          .string()
          .min(1, {
            message: "You have to select a valid minute.",
          })
          .max(2, {
            message: "You have to select a valid minute.",
          }),
      })
      .refine((data) => {
        if (data.hour && data.minute) {
          const hourValue = parseInt(data.hour, 10);
          const minuteValue = parseInt(data.minute, 10);
          return (
            hourValue >= 0 &&
            hourValue <= 23 &&
            minuteValue >= 0 &&
            minuteValue <= 59
          );
        }
        return false;
      }, "You have to select a valid time."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      platforms: [],
      postTime: {
        hour: "",
        minute: "",
      },
    },
  });

  const platformItems = [
    {
      label: "Twitter",
      id: PlatformEnum.enum.TWITTER,
      icon: <Twitter size={16} />,
      disabled: !user?.externalAccounts.find(
        (account) => account.provider === "twitter",
      ),
    },
    {
      label: "LinkedIn",
      id: PlatformEnum.enum.LINKEDIN,
      icon: <Linkedin size={16} />,
      disabled: !user?.externalAccounts.find(
        (account) => account.provider === ("linkedin_oidc" as OAuthProvider),
      ),
    },
  ] as const;

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (
    data: z.infer<typeof formSchema>,
  ) => {
    const { postDate, postTime, content, platforms } = data;

    const fullPostDate = dayjs(postDate)
      .hour(parseInt(postTime.hour))
      .minute(parseInt(postTime.minute))
      .toDate();
    console.log(fullPostDate);

    mutate({
      content,
      postDate: fullPostDate,
      platforms,
    });
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form, form.formState.isSubmitSuccessful, form.reset]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(onSubmit)(event);
          }}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Post Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="text-slate-900"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-900" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platforms"
            render={() => (
              <FormItem>
                <div className="pb-1">
                  <FormLabel className="text-base">Platform</FormLabel>
                  <FormDescription className="text-slate-200">
                    Select the platform you want to post to. If desired platform
                    is not available, please connect your account in the{" "}
                    <Link
                      className="font-bold hover:text-accent-foreground"
                      href="/user-profile"
                    >
                      account settings
                    </Link>{" "}
                    page.
                  </FormDescription>
                </div>
                <div className="flex gap-2">
                  {platformItems.map((platform) => (
                    <FormField
                      key={platform.id}
                      control={form.control}
                      name="platforms"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={platform.id}
                            className="flex-1 items-start sm:flex-none"
                          >
                            <FormControl>
                              <Toggle
                                className="w-full sm:w-auto"
                                variant="outline"
                                pressed={field.value?.includes(platform.id)}
                                disabled={platform.disabled}
                                onPressedChange={(pressed) => {
                                  return pressed
                                    ? field.onChange([
                                        ...field.value,
                                        platform.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== platform.id,
                                        ),
                                      );
                                }}
                              >
                                {platform.icon}
                                <span className="ps-1">{platform.label}</span>
                              </Toggle>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage className="text-red-900" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postDate"
            render={() => (
              <FormItem className="flex flex-col">
                <div className="pb-1">
                  <FormLabel className="text-base">Post Date</FormLabel>
                  <FormDescription className="text-slate-200">
                    Select the day and time you want to post.
                  </FormDescription>
                </div>
                <div className="flex flex-col gap-6 sm:flex-row">
                  <FormField
                    control={form.control}
                    name="postDate"
                    render={({ field }) => (
                      <FormItem className="sm:flex-initial">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal text-slate-900 sm:w-60",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  dayjs(field.value).format("DD/MM/YYYY")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < dayjs().subtract(1, "day").toDate()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-900" />
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postTime"
            render={() => (
              <FormItem>
                <div className="pb-1">
                  <FormLabel className="text-base">Post Time</FormLabel>
                  <FormDescription className="text-slate-200">
                    Select the time you want to post.
                  </FormDescription>
                </div>
                <div className="flex items-center gap-1">
                  <FormField
                    control={form.control}
                    name="postTime.hour"
                    render={({ field }) => (
                      <FormItem className="w-16 flex-initial">
                        <FormControl>
                          <Input
                            placeholder="00"
                            className={cn(
                              "cursor-pointer text-center text-slate-900",
                              !field.value && "text-muted-foreground",
                            )}
                            type="number"
                            min={0}
                            max={23}
                            maxLength={2}
                            {...field}
                            onBlur={() => {
                              form.setValue(
                                "postTime.hour",
                                formatValueWithinRange(field.value, 0, 23),
                              );
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span>:</span>
                  <FormField
                    control={form.control}
                    name="postTime.minute"
                    render={({ field }) => (
                      <FormItem className="w-16 flex-initial">
                        <FormControl>
                          <Input
                            placeholder="00"
                            className={cn(
                              "cursor-pointer text-center text-slate-900",
                              !field.value && "text-muted-foreground",
                            )}
                            type="number"
                            min={0}
                            max={59}
                            maxLength={2}
                            {...field}
                            onBlur={() => {
                              form.setValue(
                                "postTime.minute",
                                formatValueWithinRange(field.value, 0, 59),
                              );
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormMessage className="text-red-900">
                  {form.formState.errors.postTime?.root?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {isPosting && (
            <Button
              disabled
              variant="outline"
              className="flex w-full gap-2 border-0 bg-gradient-to-r from-slate-600 to-purple-950 font-bold drop-shadow-md sm:w-auto"
            >
              <Loader2 className="animate-spin" size={18} />
              Please wait
            </Button>
          )}

          {!isPosting && (
            <Button
              onClick={() => {
                console.log(form.formState.errors);
              }}
              variant="outline"
              className="w-full bg-inherit from-slate-600 to-purple-950 font-bold hover:border-0 hover:bg-gradient-to-r hover:text-slate-100 hover:drop-shadow-md sm:w-auto"
              type="submit"
            >
              Submit
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

const PostsList = () => {
  const { data, isLoading, isError, isSuccess } =
    api.posts.getAllScheduled.useQuery();

  return (
    <section className="grow bg-slate-600 px-10 py-8">
      <h1 className="text-2xl font-bold">Scheduled posts</h1>
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {isError && <div>Failed to fetch scheduled posts.</div>}
      {isSuccess && (
        <>
          {data.length === 0 && (
            <h3 className="text-md pt-4 text-slate-300">
              No scheduled posts yet.
            </h3>
          )}
          {data.map((post) => (
            <PostItem key={post.id} {...post} />
          ))}
        </>
      )}
    </section>
  );
};

type Post = RouterOutputs["posts"]["getAll"][number];

const PostItem = (props: Post) => {
  const { content, postDate, platform } = props;

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
          <span>{platformIcons[platform as PlatformEnum]}</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

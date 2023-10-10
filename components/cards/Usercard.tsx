import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopInteractedTags } from "@/lib/actions/tags.actions";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";
interface Props {
  user: {
    id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}
const Usercard = async ({ user }: Props) => {
  const interactedtags = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          height={100}
          width={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center ">
          <h3 className="h3-bold text-dark200_light800 line-clamp-1">
            {user.username}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.name}
          </p>
        </div>

        <div className="mt-5">
          {interactedtags?.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedtags?.map((tags) => (
                <RenderTag key={tags._id} id={tags._id} name={tags.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags Yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default Usercard;

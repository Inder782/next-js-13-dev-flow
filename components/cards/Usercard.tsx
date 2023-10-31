import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopInteractedTags } from "@/lib/actions/tags.actions";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";
interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const Usercard = async ({ user }: Props) => {
  const interactedtags = await getTopInteractedTags({ userId: user._id });

  return (
    <article className="background-light900_dark200 rounded-2xl flex flex-col items-center justify-center  border p-8 max-xs:min-w-full xs:w-[260px] shadow-light100">
      <Link href={`/profile/${user.clerkId}`}>
        <Image
          src={user.picture}
          alt="user profile picture"
          height={100}
          width={100}
          className="flex w-full rounded-full"
        />
        <div className="mt-4 text-center ">
          <h3 className="h3-bold text-dark200_light800 line-clamp-1">
            {user.username}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.name}
          </p>
        </div>
      </Link>
      <div className="mt-5">
        {interactedtags.length > 0 ? (
          <div className="flex items-center gap-2">
            {interactedtags.map((tags) => (
              <RenderTag key={tags._id} _id={tags._id} name={tags.name} />
            ))}
          </div>
        ) : (
          <Badge>No tags Yet</Badge>
        )}
      </div>
    </article>
  );
};

export default Usercard;

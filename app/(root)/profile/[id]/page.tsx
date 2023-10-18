import { Button } from "@/components/ui/button";
import { getuserinfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import { userInfo } from "os";
import Stats from "@/components/shared/Stats";

const Page = async ({ params }: URLProps) => {
  const userinfo = await getuserinfo({ userId: params.id });
  const { userId: clerkId } = auth();

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userinfo?.user.picture}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userinfo?.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userinfo?.user.username}
            </p>
            <div>
              <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                {userinfo?.user.location && (
                  <p>
                    <ProfileLink
                      imgUrl="/assets/icons/location.svg"
                      title={userinfo.user.location}
                    />
                  </p>
                )}
                {userinfo?.user.location && (
                  <p>
                    <ProfileLink
                      imgUrl="/assets/icons/link.svg"
                      href={userinfo.user.portfolioWebsite}
                      title="Portfolio"
                    />
                  </p>
                )}
                <ProfileLink
                  imgUrl="/assets/icons/calendar.svg"
                  title={getJoinedDate(userinfo?.user.joinedAt)}
                />
              </div>
            </div>
            {userinfo?.user.bio && (
              <p className="paragraphql-regular text-dark400_light800">
                {userinfo.user.bio}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end  max-sm:mb-5 max-sm:w-full sm:mt-3">
        <SignedIn>
          {clerkId === userinfo?.user.clerkId && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </SignedIn>
      </div>
      <Stats />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="account" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">Posts</TabsContent>
          <TabsContent value="answers">Answers.</TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;

import { type ClassValue, clsx } from "clsx";
import { Url } from "next/dist/shared/lib/router/router";
import { twMerge } from "tailwind-merge";
import { date } from "zod";
import qs from "query-string";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export function getJoinedDate(date: Date): string {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object");
  }

  // Extract date components in UTC
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" }); // Months are zero-based

  // Create a string in the format "YYYY-MM-DD"
  const joinedDate = `${month} ${year}`;

  return joinedDate;
}

interface Urlqueryparams {
  params: string;
  key: string;
  value: string | null;
}

export function formUrlquery({ params, key, value }: Urlqueryparams) {
  const currenturl = qs.parse(params);
  currenturl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currenturl,
    },
    {
      skipNull: true,
    }
  );
}

interface RemoveUrlqueryparams {
  params: string;
  keytoRemove: string[];
}

export function removekeyfromquery({
  params,
  keytoRemove,
}: RemoveUrlqueryparams) {
  const currenturl = qs.parse(params);
  keytoRemove.forEach((key) => {
    delete currenturl[key];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currenturl,
    },
    {
      skipNull: true,
    }
  );
}

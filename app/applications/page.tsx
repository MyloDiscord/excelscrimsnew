"use client";

import { useEffect, useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ApplicationsPage() {
  const { user, isSignedIn, isLoaded } = useUser();

  const [selectedRole, setSelectedRole] = useState("");
  const [hideDiscordCard, setHideDiscordCard] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const hide = localStorage.getItem("hideDiscordCard");
    if (hide !== "true") {
      setHideDiscordCard(false);
      setTimeout(() => setCardVisible(true), 50);
    } else {
      setHideDiscordCard(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white text-lg">
        Loading...
      </div>
    );
  }

  const hostQuestions = (
    <>
      <label className="font-semibold">Why do you want to be a Host?</label>
      <Textarea className="mb-4" placeholder="Explain in detail..." />
      <label className="font-semibold">
        Do you have experience hosting events?
      </label>
      <Textarea className="mb-4" placeholder="Tell us about it..." />
    </>
  );

  const helperQuestions = (
    <>
      <label className="font-semibold">
        Why should we choose you as a Helper?
      </label>
      <Textarea className="mb-4" placeholder="Explain your strengths..." />
      <label className="font-semibold">
        Have you helped moderate a community before?
      </label>
      <Textarea className="mb-4" placeholder="Share your experience..." />
    </>
  );

  const adminQuestions = (
    <>
      <div className="mb-6 mt-2 bg-[#292929] p-4 rounded-md border border-white/20 text-zinc-300 space-y-4">
        <h2 className="text-lg font-semibold text-white">Overview</h2>
        <p>
          If your application is successful, you will be recruited as an{" "}
          <span className="font-semibold">Excel Admin</span>. This role involves
          major leadership when dealing with staff and server members. This role
          involves running our scrims operations for our players. Experience
          with being in charge of staff.
        </p>
        <h2 className="text-lg font-semibold text-white">Benefits</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Gain experience in one of the best Scrims Servers in NA.</li>
          <li>Be a part of our staff community and meet new people.</li>
          <li>
            Contribute to the server to allow us to provide an amazing
            experience.
          </li>
        </ul>
        <p className="text-sm text-zinc-400">
          Due to the large volume of applicants, we do not contact those whose
          application is denied. If you don&#39;t receive a DM within a week,
          you should expect your application to have been denied.
        </p>
      </div>

      <label className="font-semibold">
        How old are you?
        <p className="text-sm text-zinc-400">
          You must be at least 14 years of age.
        </p>
      </label>
      <Textarea className="mb-4" placeholder="Age..." />

      <label className="font-semibold">What is your Discord Username?</label>
      <Textarea
        className="mb-4"
        value={user?.username || user?.fullName || "Loading..."}
        disabled
      />
    </>
  );

  const getQuestions = () => {
    if (selectedRole === "host") return hostQuestions;
    if (selectedRole === "helper") return helperQuestions;
    if (selectedRole === "admin") return adminQuestions;
    return null;
  };

  return (
    <div className="relative min-h-screen bg-[#121212] flex flex-col justify-center items-center p-6 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <div className="z-10 w-full max-w-2xl bg-[#1e1e1e] p-8 rounded-2xl shadow-xl border border-white/10">
        <h1 className="text-3xl font-bold text-center mb-4 capitalize">
          {selectedRole ? `${selectedRole} Application` : "Applications"}
        </h1>

        {!hideDiscordCard && (
          <div
            className={`mb-6 transition-all duration-500 ease-in-out transform ${
              cardVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            <div className="relative flex items-center gap-3 p-4 rounded-xl bg-[#1A1A1A] border border-white/10 shadow-sm">
              <button
                onClick={() => {
                  setCardVisible(false);

                  setTimeout(() => {
                    setHideDiscordCard(true);
                    localStorage.setItem("hideDiscordCard", "true");
                  }, 500);
                }}
                className="absolute top-2 right-2 text-zinc-500 hover:text-white text-sm cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>

              <div className="flex items-center justify-center bg-[#5865F2]/20 text-[#5865F2] p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 245 240"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M104.4 104.8c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.3-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1Zm36.3 0c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.3-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1Z" />
                  <path d="M189.5 20h-134C42.5 20 30 32.5 30 48v144c0 15.5 12.5 28 28 28h114l-5.3-18.4 12.8 11.9 12.1 11.2 21.5 19V48c0-15.5-12.5-28-28-28ZM160.1 149s-4.1-4.9-7.5-9.2c14.9-4.2 20.5-13.4 20.5-13.4-4.6 3-9 5.1-12.9 6.5-5.6 2.4-11 4-16.3 5-10.8 2-20.7 1.5-29.2-.1-6.4-1.2-11.9-3-16.5-5-2.6-1.1-5.4-2.4-8.2-4.1-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s5.5 9 20 13.4c-3.4 4.3-7.6 9.4-7.6 9.4-25.1-.8-34.6-17.3-34.6-17.3 0-36.6 16.4-66.4 16.4-66.4C76.9 58 90.6 58.6 90.6 58.6l1 1.2c-19.2 5.6-28.1 14-28.1 14s2.4-1.3 6.4-3.1c11.6-5.1 20.8-6.5 24.6-6.9.6-.1 1.1-.2 1.7-.2 6-1 12.7-1.2 19.8-.2 9.3 1.1 19.3 3.9 29.5 9.6 0 0-8.4-8-26.6-13.5l1.4-1.6s13.7-.6 27.9 10.4c0 0 16.4 29.8 16.4 66.4 0-.1-9.7 16.5-34.9 17.3Z" />
                </svg>
              </div>

              <div className="text-sm text-zinc-300 leading-snug">
                If you aren&#39;t in our Discord, join&nbsp;
                <a
                  href="https://discord.gg/scrims"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5865F2] font-medium underline underline-offset-2 hover:text-[#4752C4] transition"
                >
                  discord.gg/scrims
                </a>
                .
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Select Role</label>
          <Select onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="host">Host</SelectItem>
              <SelectItem value="helper">Helper</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedRole && (
          <form className="flex flex-col gap-4">
            {getQuestions()}
            <Button
              type="submit"
              className="ml-2 px-3 py-1 text-sm rounded-md font-medium text-red-400 bg-red-700/20 hover:bg-red-700/40 transition cursor-pointer"
            >
              Submit Application
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

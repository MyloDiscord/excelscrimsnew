"use client";

import { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
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
  const [selectedRole, setSelectedRole] = useState("");

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
      <label className="font-semibold">
        What makes you a good fit for Admin?
      </label>
      <Textarea className="mb-4" placeholder="Explain your qualifications..." />
      <label className="font-semibold">
        How would you handle a conflict between staff?
      </label>
      <Textarea className="mb-4" placeholder="Describe your approach..." />
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
        <h1 className="text-3xl font-bold text-center mb-6 capitalize">
          {selectedRole ? `${selectedRole} Application` : "Apply for a Role"}
        </h1>  
 
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

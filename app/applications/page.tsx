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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const scenario1Options = [
  {
    value: "understand",
    label: "Learn about the situation for a better understanding.",
  },
  { value: "demote", label: "Demote the Admin immediately." },
  { value: "warning", label: "Give the Admin member a Warning." },
  { value: "moveon", label: "Just end the argument and move on." },
];

const scenario2Options = [
  { value: "staff", label: "Check for new staff/host applications." },
  {
    value: "general",
    label: "Go to #general and start having a conversation.",
  },
  {
    value: "communicate",
    label: "Communicate with other Admins/Management to discuss todays agenda.",
  },
];

const scenario3Options = [
  { value: "demote", label: "Demote the Admin immediately." },
  { value: "tell", label: "Tell Management." },
  {
    value: "side",
    label: "Get the Admin side of the story before taking action.",
  },
  { value: "discuss", label: "Discuss it with other Admins." },
];

export default function ApplicationsPage() {
  const { user, isSignedIn, isLoaded } = useUser();

  const discordId =
    user?.externalAccounts?.find((acc) => acc.provider === "discord")
      ?.providerUserId || "Unavailable";

  const [selectedRole, setSelectedRole] = useState("");
  const [hideDiscordCard, setHideDiscordCard] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  const [age, setAge] = useState("");
  const [adminRegion, setAdminRegion] = useState("");
  const [adminWhyJob, setAdminWhyJob] = useState("");
  const [adminContribution, setAdminContribution] = useState("");
  const [contributionError, setContributionError] = useState("");
  const [adminActivity, setAdminActivity] = useState("");
  const [activityError, setActivityError] = useState("");
  const [adminUnderstanding, setAdminUnderstanding] = useState("");
  const [understandingError, setUnderstandingError] = useState("");
  const [pastExp, setPastExp] = useState("");
  const [pastExpError, setPastExpError] = useState("");

  const [scenario1, setScenario1] = useState("");
  const [scenario2, setScenario2] = useState("");
  const [scenario3, setScenario3] = useState("");
  const [scenario1Error, setScenario1Error] = useState("");
  const [scenario2Error, setScenario2Error] = useState("");
  const [scenario3Error, setScenario3Error] = useState("");

  // Role-specific questions
  const [hostAnswer1, setHostAnswer1] = useState("");
  const [hostAnswer2, setHostAnswer2] = useState("");
  const [helperAnswer1, setHelperAnswer1] = useState("");
  const [helperAnswer2, setHelperAnswer2] = useState("");

  const [formPage, setFormPage] = useState(1);

  // Error states for validation messages
  const [ageError, setAgeError] = useState("");
  const [regionError, setRegionError] = useState("");
  const [whyJobError, setWhyJobError] = useState("");
  const [hostAnswer1Error, setHostAnswer1Error] = useState("");
  const [hostAnswer2Error, setHostAnswer2Error] = useState("");
  const [helperAnswer1Error, setHelperAnswer1Error] = useState("");
  const [helperAnswer2Error, setHelperAnswer2Error] = useState("");
  const [roleError, setRoleError] = useState("");

  const [isAlertOpen, setIsAlertOpen] = useState(false);

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

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white text-lg">
        You must be logged in to submit an application.
      </div>
    );
  }

  function validateAdminStep1() {
    let valid = true;

    setAgeError("");
    setRegionError("");

    if (!age.trim()) {
      setAgeError("Please enter your age.");
      valid = false;
    } else {
      const numericAge = parseInt(age);
      if (isNaN(numericAge) || numericAge < 14) {
        setAgeError("You must be at least 14 years old.");
        valid = false;
      }
    }

    if (!adminRegion.trim()) {
      setRegionError("Please enter your region.");
      valid = false;
    }

    return valid;
  }

  function validateAdminStep2() {
    let valid = true;
    setWhyJobError("");
    setContributionError("");
    setActivityError("");
    setUnderstandingError("");
    setPastExpError("");

    if (!adminWhyJob.trim()) {
      setWhyJobError("Please explain why you want to do this job.");
      valid = false;
    }
    if (!adminContribution.trim()) {
      setContributionError(
        "Please explain what you can tribute to Excel Scrims."
      );
      valid = false;
    }
    if (!adminActivity.trim()) {
      setActivityError("Please describe your activity in Excel Scrims.");
      valid = false;
    }
    if (!adminUnderstanding || adminUnderstanding === "") {
      setUnderstandingError("Please select Yes or No.");
      valid = false;
    }
    if (!pastExp.trim()) {
      setPastExpError("Please explain what experience you have.");
      valid = false;
    }
    return valid;
  }

  const hostQuestions = (
    <>
      <label className="font-semibold">Why do you want to be a Host?</label>
      <Textarea
        className={`mb-1 ${hostAnswer1Error ? "border-red-500" : ""}`}
        placeholder="Explain in detail..."
        value={hostAnswer1}
        onChange={(e) => {
          setHostAnswer1(e.target.value);
          if (hostAnswer1Error) setHostAnswer1Error("");
        }}
      />
      {hostAnswer1Error && (
        <p className="text-red-500 text-sm mb-3">{hostAnswer1Error}</p>
      )}

      <label className="font-semibold">
        Do you have experience hosting events?
      </label>
      <Textarea
        className={`mb-1 ${hostAnswer2Error ? "border-red-500" : ""}`}
        placeholder="Tell us about it..."
        value={hostAnswer2}
        onChange={(e) => {
          setHostAnswer2(e.target.value);
          if (hostAnswer2Error) setHostAnswer2Error("");
        }}
      />
      {hostAnswer2Error && (
        <p className="text-red-500 text-sm mb-3">{hostAnswer2Error}</p>
      )}
    </>
  );

  const helperQuestions = (
    <>
      <label className="font-semibold">
        Why should we choose you as a Helper?
      </label>
      <Textarea
        className={`mb-1 ${helperAnswer1Error ? "border-red-500" : ""}`}
        placeholder="Explain your strengths..."
        value={helperAnswer1}
        onChange={(e) => {
          setHelperAnswer1(e.target.value);
          if (helperAnswer1Error) setHelperAnswer1Error("");
        }}
      />
      {helperAnswer1Error && (
        <p className="text-red-500 text-sm mb-3">{helperAnswer1Error}</p>
      )}

      <label className="font-semibold">
        Have you helped moderate a community before?
      </label>
      <Textarea
        className={`mb-1 ${helperAnswer2Error ? "border-red-500" : ""}`}
        placeholder="Share your experience..."
        value={helperAnswer2}
        onChange={(e) => {
          setHelperAnswer2(e.target.value);
          if (helperAnswer2Error) setHelperAnswer2Error("");
        }}
      />
      {helperAnswer2Error && (
        <p className="text-red-500 text-sm mb-3">{helperAnswer2Error}</p>
      )}
    </>
  );

  const adminQuestions = (
    <>
      {formPage === 1 && (
        <>
          <div className="mb-6 mt-2 bg-[#292929] p-4 rounded-md border border-white/20 text-zinc-300 space-y-4">
            <h2 className="text-lg font-semibold text-white">Overview</h2>
            <p>
              If your application is successful, you will be recruited as an{" "}
              <span className="font-semibold">Excel Admin</span>. This role
              involves major leadership when dealing with staff and server
              members. This role involves running our scrims operations for our
              players. Experience with being in charge of staff.
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
              Due to the large volume of applicants, we do not contact those
              whose application is denied. If you don&apos;t receive a DM within
              a week, you should expect your application to have been denied.
            </p>
          </div>

          <label className="font-semibold">
            How old are you?
            <p className="text-sm text-zinc-400">
              You must be at least 14 years of age.
            </p>
          </label>
          <Textarea
            className={`mb-2 ${ageError ? "border-red-500" : ""}`}
            placeholder="Age..."
            value={age}
            onChange={(e) => {
              const value = e.target.value;
              setAge(value);

              const numericAge = parseInt(value);
              if (!isNaN(numericAge) && numericAge < 14) {
                setAgeError("You must be 14 or older.");
              } else {
                setAgeError("");
              }
            }}
          />
          {ageError && <p className="text-red-500 text-sm mb-3">{ageError}</p>}

          <label className="font-semibold">
            What is your Discord Username?
          </label>
          <Textarea
            className="mb-4"
            value={user?.username || user?.fullName || "Loading..."}
            disabled
          />

          <label className="font-semibold">What is your Discord ID?</label>
          <Textarea className="mb-4" value={discordId} disabled />

          <label className="font-semibold">What region are you?</label>
          <Select
            value={adminRegion}
            onValueChange={(val) => {
              setAdminRegion(val);
              if (regionError) setRegionError("");
            }}
          >
            <SelectTrigger
              className={`mb-2 ${regionError ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NA-East">NA Central</SelectItem>
              <SelectItem value="NA-East">NA East</SelectItem>
              <SelectItem value="NA-West">NA West</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Oceania">Oceania</SelectItem>
              <SelectItem value="Brazil">Brazil</SelectItem>
              <SelectItem value="Asia">Asia</SelectItem>
              <SelectItem value="Middle East">Middle East</SelectItem>
            </SelectContent>
          </Select>

          {regionError && (
            <p className="text-red-500 text-sm mb-3">{regionError}</p>
          )}

          <Button
            type="button"
            onClick={() => {
              if (validateAdminStep1()) {
                setFormPage(2);
              }
            }}
            className="self-end px-3 py-1 text-sm rounded-md font-medium text-white bg-blue-700/20 hover:bg-blue-700/40 transition cursor-pointer"
          >
            Next &rarr;
          </Button>
        </>
      )}

      {formPage === 2 && (
        <>
          <label className="font-semibold">
            Why do you want to do this job?
          </label>
          <Textarea
            className={`mb-2 ${whyJobError ? "border-red-500" : ""}`}
            placeholder="Explain..."
            value={adminWhyJob}
            onChange={(e) => {
              setAdminWhyJob(e.target.value);
              if (whyJobError) setWhyJobError("");
            }}
          />
          {whyJobError && (
            <p className="text-red-500 text-sm mb-3">{whyJobError}</p>
          )}

          <label className="font-semibold">
            What can you contribute to Excel Scrims?
          </label>
          <Textarea
            className={`mb-2 ${contributionError ? "border-red-500" : ""}`}
            placeholder="Explain..."
            value={adminContribution}
            onChange={(e) => {
              setAdminContribution(e.target.value);
              if (contributionError) setContributionError("");
            }}
          />
          {contributionError && (
            <p className="text-red-500 text-sm mb-3">{contributionError}</p>
          )}

          <label className="font-semibold">
            Are you highly active in Excel Scrims?
          </label>
          <Textarea
            className={`mb-2 ${activityError ? "border-red-500" : ""}`}
            placeholder="Answer..."
            value={adminActivity}
            onChange={(e) => {
              setAdminActivity(e.target.value);
              if (activityError) setActivityError("");
            }}
          />
          {activityError && (
            <p className="text-red-500 text-sm mb-3">{activityError}</p>
          )}

          <label className="font-semibold">
            Do you understand the importance of this job?
          </label>
          <Select
            value={adminUnderstanding}
            onValueChange={(val) => {
              setAdminUnderstanding(val);
              if (understandingError) setUnderstandingError("");
            }}
          >
            <SelectTrigger
              className={`mb-2 ${understandingError ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select an answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          {understandingError && (
            <p className="text-red-500 text-sm mb-3">{understandingError}</p>
          )}

          <label className="font-semibold">
            Do you have any past experience being an Administrator?
          </label>
          <p className="text-sm text-zinc-400">
            Preferably experience in a Fortnite Scrim server. (List them below)
          </p>
          <Textarea
            className={`mb-2 ${pastExpError ? "border-red-500" : ""}`}
            placeholder="Answer..."
            value={pastExp}
            onChange={(e) => {
              setPastExp(e.target.value);
              if (pastExpError) setPastExpError("");
            }}
          />
          {pastExpError && (
            <p className="text-red-500 text-sm mb-3">{pastExpError}</p>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={() => setFormPage(1)}
              className="px-3 py-1 text-sm rounded-md font-medium text-white bg-zinc-700/20 hover:bg-zinc-700/40 transition cursor-pointer"
            >
              &larr; Back
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (validateAdminStep2()) {
                  setFormPage(3);
                }
              }}
              className="self-end px-3 py-1 text-sm rounded-md font-medium text-white bg-blue-700/20 hover:bg-blue-700/40 transition cursor-pointer"
            >
              Next &rarr;
            </Button>
          </div>

          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent className="bg-[#1e1e1e] text-white border border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to submit your application? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer text-black">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={() => {
                    setIsAlertOpen(false);
                    handleSubmit();
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {formPage === 3 && (
        <>
          <div className="mb-6 bg-[#222226] p-4 rounded-lg border border-white/10">
            <p className="text-zinc-200 font-semibold">
              This section will give you scenarios and you will have to answer
              the question about what action you would take when facing said
              scenario.
            </p>
          </div>

          {/* Question 1 */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">
              Question #1: How would you handle seeing an Admin being
              unprofessional and disrespectful towards server members?
            </label>
            <div className="flex flex-col gap-3">
              {scenario1Options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={scenario1 === opt.value}
                    onCheckedChange={() => {
                      setScenario1(opt.value);
                      setScenario1Error("");
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {scenario1Error && (
              <p className="text-red-500 text-sm mt-2">{scenario1Error}</p>
            )}
          </div>

          {/* Question 2 */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">
              Question #2: When you get on for the day, you should do what?
            </label>
            <div className="flex flex-col gap-3">
              {scenario2Options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={scenario2 === opt.value}
                    onCheckedChange={() => {
                      setScenario2(opt.value);
                      setScenario2Error("");
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {scenario2Error && (
              <p className="text-red-500 text-sm mt-2">{scenario2Error}</p>
            )}
          </div>

          {/* Question 3 */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">
              Question #3: How would you handle a report on another Admin?
            </label>
            <div className="flex flex-col gap-3">
              {scenario3Options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={scenario3 === opt.value}
                    onCheckedChange={() => {
                      setScenario3(opt.value);
                      setScenario3Error("");
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {scenario3Error && (
              <p className="text-red-500 text-sm mt-2">{scenario3Error}</p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              onClick={() => setFormPage(2)}
              className="px-3 py-1 text-sm rounded-md font-medium text-white bg-zinc-700/20 hover:bg-zinc-700/40 transition cursor-pointer"
            >
              &larr; Back
            </Button>

            <Button
              type="button"
              className="px-3 py-1 text-sm rounded-md font-medium text-red-400 bg-red-700/20 hover:bg-red-700/40 transition cursor-pointer"
              onClick={() => {
                // Validate all questions
                let valid = true;
                if (!scenario1) {
                  setScenario1Error("Please select an answer.");
                  valid = false;
                }
                if (!scenario2) {
                  setScenario2Error("Please select an answer.");
                  valid = false;
                }
                if (!scenario3) {
                  setScenario3Error("Please select an answer.");
                  valid = false;
                }
                if (valid) setIsAlertOpen(true);
              }}
            >
              Submit Application
            </Button>
          </div>

          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent className="bg-[#1e1e1e] text-white border border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to submit your application? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer text-black">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={() => {
                    setIsAlertOpen(false);
                    handleSubmit();
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );

  type ScenarioOption = {
    value: string;
    label: string;
  };

  function getLabel(options: ScenarioOption[], value: string): string {
    const found = options.find((opt) => opt.value === value);
    return found ? found.label : value;
  }

  function handleSubmit() {
    let answers;
    if (selectedRole === "host") {
      answers = {
        role: "host",
        answer1: hostAnswer1,
        answer2: hostAnswer2,
      };
    } else if (selectedRole === "helper") {
      answers = {
        role: "helper",
        answer1: helperAnswer1,
        answer2: helperAnswer2,
      };
    } else if (selectedRole === "admin") {
      answers = {
        role: "admin",
        age,
        region: adminRegion,
        whyJob: adminWhyJob,
        contribution: adminContribution,
        activity: adminActivity,
        understanding: adminUnderstanding,
        pastExp,
        scenario1: getLabel(scenario1Options, scenario1),
        scenario2: getLabel(scenario2Options, scenario2),
        scenario3: getLabel(scenario3Options, scenario3),
      };
    }
    console.log("Submitted answers:", answers);
    toast.success(
      "Application submitted successfully - you will hear back from us within a week. Best of luck!"
    );
  }

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
                If you aren&apos;t in our Discord, join&nbsp;
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
          <Select
            onValueChange={(val) => {
              setSelectedRole(val);
              setRoleError("");
              setFormPage(1);
            }}
            value={selectedRole}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="host">Host</SelectItem>
              <SelectItem value="helper">Helper</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {roleError && (
            <p className="text-red-500 text-sm mt-1">{roleError}</p>
          )}
        </div>

        {selectedRole && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            {getQuestions()}
          </form>
        )}
      </div>
    </div>
  );
}

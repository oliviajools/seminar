"use client";

import { useSessionStore } from "@/store/useSessionStore";
import SessionJoin from "@/components/SessionJoin";
import PresenterDashboard from "@/components/PresenterDashboard";
import ParticipantView from "@/components/ParticipantView";

export default function Home() {
  const { role } = useSessionStore();

  console.log("Current role:", role);

  if (role === "presenter") {
    return <PresenterDashboard />;
  }

  if (role === "participant") {
    return <ParticipantView />;
  }

  return <SessionJoin />;
}

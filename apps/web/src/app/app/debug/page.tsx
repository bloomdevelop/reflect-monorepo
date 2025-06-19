"use client";


import React, { useRef } from "react";
import { useLog } from "@/app/hooks/useLogContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function DebugPage() {
  const { logs, addLog } = useLog();
  const logIdRef = useRef(1);

  function handleTestLog() {
	addLog(`Test log #${logIdRef.current}`);
	logIdRef.current++;
  }

  return (
	<div className="p-4 space-y-6">
	  <h1 className="text-4xl font-bold">Debug</h1>
	  <Separator />

	  {/* Navigation Tools */}
	  <div className="flex flex-wrap gap-2">
		<Link href="/login">
		  <Button>Login</Button>
		</Link>
		<Link href="/settings">
		  <Button>Open Settings</Button>
		</Link>
		<Link href="/">
		  <Button>Home</Button>
		</Link>
		<Link href="/profile">
		  <Button>Profile</Button>
		</Link>
		<Button variant="secondary" onClick={handleTestLog}>
		  Add Test Log
		</Button>
	  </div>

	  {/* Logs Section */}
	  <div>
		<h2 className="text-2xl font-semibold mb-2">Logs</h2>
		<div className="bg-neutral-900 text-neutral-100 rounded p-4 max-h-64 overflow-y-auto text-sm font-mono border border-neutral-700">
		  {logs.map((log) => (
			<div key={log}>{log}</div>
		  ))}
		</div>
	  </div>
	</div>
  );
}

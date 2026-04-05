"use client";

import { useState, useEffect, useRef } from "react";
import type { NSFWModel } from "@/utils/analyzeNSFW";

type ModelState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; model: NSFWModel }
  | { status: "error"; error: string };

let globalModelState: ModelState = { status: "idle" };
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((fn) => fn());
}

async function loadModelIfNeeded() {
  if (
    globalModelState.status === "loading" ||
    globalModelState.status === "ready"
  ) {
    return;
  }

  globalModelState = { status: "loading" };
  notifySubscribers();

  try {
    const [tf, nsfwjs] = await Promise.all([
      import("@tensorflow/tfjs"),
      import("nsfwjs"),
    ]);

    try {
      await tf.setBackend("wasm");
      await tf.ready();
    } catch {
      try {
        await tf.setBackend("webgl");
        await tf.ready();
      } catch {
        await tf.setBackend("cpu");
        await tf.ready();
      }
    }

    const model = await nsfwjs.load();

    globalModelState = { status: "ready", model: model as unknown as NSFWModel };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido ao carregar modelo.";
    globalModelState = { status: "error", error: message };
  }

  notifySubscribers();
}

export type NSFWHookState =
  | { status: "idle" | "loading" }
  | { status: "ready"; model: NSFWModel }
  | { status: "error"; error: string };

export function useNSFW(): NSFWHookState & { retry: () => void } {
  const [, forceUpdate] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const update = () => {
      if (mountedRef.current) forceUpdate((n) => n + 1);
    };
    subscribers.add(update);

    loadModelIfNeeded();

    return () => {
      mountedRef.current = false;
      subscribers.delete(update);
    };
  }, []);

  const retry = () => {
    if (globalModelState.status !== "error") return;
    globalModelState = { status: "idle" };
    loadModelIfNeeded();
  };

  return { ...globalModelState, retry };
}
"use client";

import { useEffect, useRef } from "react";
import { NeuralField } from "@/landing/lib/neural-engine";
import { useReducedMotion } from "@/landing/hooks/useReducedMotion";
import { useTheme } from "@/landing/components/theme/ThemeProvider";

type NeuralNetworkProps = {
  hostRef: React.RefObject<HTMLElement | null>;
};

export function NeuralNetwork({ hostRef }: NeuralNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<NeuralField | null>(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const field = new NeuralField(canvas, { reducedMotion: reduced });
    field.setThemeFrom(document.documentElement);
    field.start();
    fieldRef.current = field;

    return () => {
      field.destroy();
      fieldRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    fieldRef.current?.setThemeFrom(document.documentElement);
  }, [theme]);

  useEffect(() => {
    const host = hostRef.current;
    const field = () => fieldRef.current;
    if (!host) return;

    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      field()?.setPointer({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      });
    };

    const onLeave = () => {
      field()?.setPointer({ x: 0, y: 0, active: false });
    };

    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      field()?.setScroll(progress);
    };

    host.addEventListener("pointermove", onPointer);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hostRef]);

  return (
    <canvas
      ref={canvasRef}
      className="neural-field pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

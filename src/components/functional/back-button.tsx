"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  label?: string;
}

export function BackButton({ className,  label = "Go Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className={cn("flex items-center gap-2", className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}

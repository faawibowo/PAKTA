"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface OperationalTermsSectionProps {
  control: Control<any>;
}

export function OperationalTermsSection({ control }: OperationalTermsSectionProps) {
  return (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        5. Operational Terms
      </h3>

      <FormField
        control={control}
        name="serviceLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Service Level / Performance Metrics
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., delivery time, handling quality, on-time % target, liability cap..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="insuranceRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insurance Requirements</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., cargo insurance coverage, liability insurance requirements..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="liabilityIndemnity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Liability & Indemnity</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., who bears loss/damage risk, liability limitations..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="forceMajeure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Force Majeure (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., unexpected events clause, specific force majeure events..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
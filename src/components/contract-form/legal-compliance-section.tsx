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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LegalComplianceSectionProps {
  control: Control<any>;
}

export function LegalComplianceSection({ control }: LegalComplianceSectionProps) {
  return (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        6. Legal & Compliance
      </h3>

      <FormField
        control={control}
        name="governingLaw"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Governing Law / Jurisdiction</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select governing law" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="indonesia">
                  Indonesian Law
                </SelectItem>
                <SelectItem value="singapore">
                  Singapore Law
                </SelectItem>
                <SelectItem value="malaysia">
                  Malaysian Law
                </SelectItem>
                <SelectItem value="international">
                  International Maritime Law
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="confidentiality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Confidentiality / NDA (Optional)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., confidentiality requirements, non-disclosure terms..."
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
        name="disputeResolution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dispute Resolution</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select dispute resolution method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="court">
                  Court litigation
                </SelectItem>
                <SelectItem value="arbitration">
                  Arbitration
                </SelectItem>
                <SelectItem value="mediation">
                  Mediation
                </SelectItem>
                <SelectItem value="mediation-then-arbitration">
                  Mediation then Arbitration
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
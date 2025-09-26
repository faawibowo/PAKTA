"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DurationTerminationSectionProps {
  control: Control<any>;
}

export function DurationTerminationSection({ control }: DurationTerminationSectionProps) {
  return (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        4. Duration & Termination
      </h3>

      <FormField
        control={control}
        name="contractDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contract Duration</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="3 months">3 Months</SelectItem>
                <SelectItem value="6 months">6 Months</SelectItem>
                <SelectItem value="1 year">1 Year</SelectItem>
                <SelectItem value="2 years">2 Years</SelectItem>
                <SelectItem value="3 years">3 Years</SelectItem>
                <SelectItem value="indefinite">
                  Indefinite (until terminated)
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="terminationClause"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Termination Clause</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., 30-day written notice, breach of contract conditions..."
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
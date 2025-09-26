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

interface PartiesIdentificationSectionProps {
  control: Control<any>;
}

export function PartiesIdentificationSection({ control }: PartiesIdentificationSectionProps) {
  return (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        1. Parties & Identification
      </h3>

      <FormField
        control={control}
        name="contractTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contract Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Freight Forwarding Agreement"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="partyAName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Party A (Client/Shipper) - Company Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="partyBName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Party B (Provider/Carrier) - Company Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Logistics Pro Ltd"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="partyAAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party A Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="123 Business St, City, Country"
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
          name="partyBAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party B Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="456 Logistics Ave, City, Country"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="partyARepresentative"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party A Representative</FormLabel>
              <FormControl>
                <Input placeholder="John Doe, CEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="partyBRepresentative"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party B Representative</FormLabel>
              <FormControl>
                <Input
                  placeholder="Jane Smith, Operations Manager"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
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

interface ScopeOfWorkSectionProps {
  control: Control<any>;
}

export function ScopeOfWorkSection({ control }: ScopeOfWorkSectionProps) {
  return (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        2. Scope of Work / Services
      </h3>

      <FormField
        control={control}
        name="serviceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="freight-forwarding">
                  Freight Forwarding
                </SelectItem>
                <SelectItem value="transport">
                  Transport Services
                </SelectItem>
                <SelectItem value="warehousing">
                  Warehousing
                </SelectItem>
                <SelectItem value="cold-chain">
                  Cold Chain Logistics
                </SelectItem>
                <SelectItem value="last-mile">
                  Last Mile Delivery
                </SelectItem>
                <SelectItem value="3pl">
                  Third Party Logistics (3PL)
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
        name="goodsCommodities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Goods/Commodities Covered</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., electronics, perishables, hazardous materials"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="serviceLocations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Locations</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Origin, destination, warehouses, and other relevant locations..."
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
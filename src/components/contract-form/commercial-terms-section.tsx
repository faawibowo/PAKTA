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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommercialTermsSectionProps {
  control: Control<any>;
}

export function CommercialTermsSection({ control }: CommercialTermsSectionProps) {
  return (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        3. Commercial Terms
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="contractValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Value</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 100,000 (fixed fee, per shipment, per km)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">
                    USD - US Dollar
                  </SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="IDR">
                    IDR - Indonesian Rupiah
                  </SelectItem>
                  <SelectItem value="SGD">
                    SGD - Singapore Dollar
                  </SelectItem>
                  <SelectItem value="MYR">
                    MYR - Malaysian Ringgit
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="paymentTerms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Terms</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="net-15">
                  Net 15 days
                </SelectItem>
                <SelectItem value="net-30">
                  Net 30 days
                </SelectItem>
                <SelectItem value="net-60">
                  Net 60 days
                </SelectItem>
                <SelectItem value="upfront">
                  Upfront payment
                </SelectItem>
                <SelectItem value="milestone">
                  Milestone payments
                </SelectItem>
                <SelectItem value="cod">
                  Cash on Delivery
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="penaltyFees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Penalty/Late Fees (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 2% per month for late payment"
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
"use client";

import { FormEvent, ReactNode, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const frequencyOptions = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Half-Yearly",
  "Yearly",
  "One-Time",
];

const schemeOptions = ["RD", "PPF", "TD", "MIS", "NSC", "Other"];

type Account = {
  accountNumber: string;
  accountName: string;
  scheme: string;
  collectionAmount: string;
  frequency: string;
  startDate: string;
  maturityDate: string;
  previousPaid: string;
};

const createEmptyAccount = (): Account => ({
  accountNumber: "",
  accountName: "",
  scheme: "",
  collectionAmount: "",
  frequency: "Monthly",
  startDate: "",
  maturityDate: "",
  previousPaid: "0",
});

export function PipelineSection() {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    username: "",
    password: "",
  });

  // Every customer starts with one account.
  const [accounts, setAccounts] = useState<Account[]>([
    createEmptyAccount(),
  ]);

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateCustomer = (
    field: keyof typeof customer,
    value: string
  ) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors([]);
    setSuccess("");
  };

  const updateAccount = (
    index: number,
    field: keyof Account,
    value: string
  ) => {
    setAccounts((current) =>
      current.map((account, accountIndex) =>
        accountIndex === index
          ? { ...account, [field]: value }
          : account
      )
    );

    setErrors([]);
    setSuccess("");
  };

  const addAccount = () => {
    setAccounts((current) => [
      ...current,
      createEmptyAccount(),
    ]);
  };

  const removeAccount = (index: number) => {
    if (accounts.length === 1) return;

    setAccounts((current) =>
      current.filter((_, accountIndex) => accountIndex !== index)
    );
  };

  const validate = () => {
    const nextErrors: string[] = [];

    // Customer validation
    if (!customer.name.trim()) {
      nextErrors.push("Full name is required.");
    }

    if (!/^\d{10}$/.test(customer.phone)) {
      nextErrors.push(
        "Phone number must contain exactly 10 digits."
      );
    }

    if (!customer.username.trim()) {
      nextErrors.push("Username is required.");
    }

    if (customer.password.length < 6) {
      nextErrors.push(
        "Password must be at least 6 characters."
      );
    }

    // Account validation
    accounts.forEach((account, index) => {
      const accountLabel = `Account ${index + 1}`;

      if (!account.accountNumber.trim()) {
        nextErrors.push(
          `${accountLabel}: account number is required.`
        );
      }

      if (!account.scheme) {
        nextErrors.push(
          `${accountLabel}: scheme is required.`
        );
      }

      if (
        !account.collectionAmount ||
        Number(account.collectionAmount) <= 0
      ) {
        nextErrors.push(
          `${accountLabel}: collection amount must be greater than zero.`
        );
      }

      if (!account.startDate) {
        nextErrors.push(
          `${accountLabel}: start date is required.`
        );
      }

      if (!account.maturityDate) {
        nextErrors.push(
          `${accountLabel}: maturity date is required.`
        );
      }

      if (
        account.startDate &&
        account.maturityDate &&
        account.maturityDate < account.startDate
      ) {
        nextErrors.push(
          `${accountLabel}: maturity date must be after start date.`
        );
      }
    });

    return nextErrors;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationErrors = validate();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccess("");

    // Replace this with your Supabase/API call later.
    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setIsSubmitting(false);
    setErrors([]);

    setSuccess(
      `${customer.name} was created successfully with ${accounts.length
      } account${accounts.length === 1 ? "" : "s"}.`
    );
  };

  return (
    <div className="mx-auto w-full">

      {/* PAGE HEADER */}
      <div className="mb-7">
        <Badge
          variant="secondary"
          className="mb-2 bg-accent text-accent-foreground"
        >
          Customer onboarding
        </Badge>

        <h1 className="text-2xl font-semibold tracking-tight">
          Add Customer
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter customer details and account information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
      >

        {/* ONE MAIN CONTAINER */}
        <Card className="overflow-hidden rounded-2xl border shadow-sm">

          <CardContent className="p-5 sm:p-7">

            {/* CUSTOMER DETAILS */}
            <div className="mb-7">

              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <UserRound className="size-5 text-primary" />
                </div>

                <CardTitle className="text-base">
                  Basic Customer Information
                </CardTitle>
              </div>

              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

                <Field label="Full Name" required>
                  <Input
                    value={customer.name}
                    onChange={(event) =>
                      updateCustomer(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Rahul Kumar"
                  />
                </Field>

                <Field label="Phone Number" required>
                  <Input
                    inputMode="numeric"
                    maxLength={10}
                    value={customer.phone}
                    onChange={(event) =>
                      updateCustomer(
                        "phone",
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="9876543210"
                  />
                </Field>

                <Field label="Username" required>
                  <Input
                    value={customer.username}
                    onChange={(event) =>
                      updateCustomer(
                        "username",
                        event.target.value
                      )
                    }
                    placeholder="rahul01"
                  />
                </Field>

                <Field
                  label="Password"
                  required
                  hint="Minimum 6 characters"
                >
                  <Input
                    type="password"
                    value={customer.password}
                    onChange={(event) =>
                      updateCustomer(
                        "password",
                        event.target.value
                      )
                    }
                    placeholder="Enter password"
                  />
                </Field>

              </div>
            </div>

            {/* SIMPLE DIVIDER */}
            <div className="mb-7 border-t" />

            {/* ACCOUNTS */}
            <div className="space-y-4">

              {accounts.map((account, index) => (
                <AccountCard
                  key={index}
                  account={account}
                  index={index}
                  canRemove={accounts.length > 1}
                  updateAccount={updateAccount}
                  removeAccount={removeAccount}
                />
              ))}

              {/* ADD ACCOUNT */}
              <Button
                type="button"
                variant="outline"
                onClick={addAccount}
                className="border-dashed"
              >
                <Plus />
                Add Another Account
              </Button>

            </div>

          </CardContent>

          {/* CREATE ACTION */}
          <div className="flex justify-end border-t bg-muted/20 px-5 py-4 sm:px-7">

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? "Creating Customer..."
                : "Create Customer"}
            </Button>

          </div>

        </Card>

      </form>
    </div>
  );
}

/* -------------------------------- */
/* ACCOUNT CARD */
/* -------------------------------- */

function AccountCard({
  account,
  index,
  canRemove,
  updateAccount,
  removeAccount,
}: {
  account: Account;
  index: number;
  canRemove: boolean;
  updateAccount: (
    index: number,
    field: keyof Account,
    value: string
  ) => void;
  removeAccount: (index: number) => void;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 sm:p-5">

      {/* ACCOUNT HEADER */}
      <div className="mb-5 flex items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <WalletCards className="size-4 text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Account {index + 1}
            </h3>

            {index === 0 && (
              <p className="text-xs text-muted-foreground">
                Primary account
              </p>
            )}
          </div>

        </div>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeAccount(index)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />

            <span className="hidden sm:inline">
              Remove
            </span>
          </Button>
        )}

      </div>

      {/* ACCOUNT FIELDS */}
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

        <Field label="Account No." required>
          <Input
            value={account.accountNumber}
            onChange={(event) =>
              updateAccount(
                index,
                "accountNumber",
                event.target.value
              )
            }
            placeholder="ACC-1001"
          />
        </Field>

        <Field label="Scheme" required>
          <select
            value={account.scheme}
            onChange={(event) =>
              updateAccount(
                index,
                "scheme",
                event.target.value
              )
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              Select scheme
            </option>

            {schemeOptions.map((scheme) => (
              <option
                key={scheme}
                value={scheme}
              >
                {scheme}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Account Name">
          <Input
            value={account.accountName}
            onChange={(event) =>
              updateAccount(
                index,
                "accountName",
                event.target.value
              )
            }
            placeholder="Monthly RD"
          />
        </Field>

        <Field
          label="Collection Amount"
          required
        >
          <Input
            type="number"
            min="1"
            value={account.collectionAmount}
            onChange={(event) =>
              updateAccount(
                index,
                "collectionAmount",
                event.target.value
              )
            }
            placeholder="1000"
          />
        </Field>

        <Field label="Frequency" required>
          <select
            value={account.frequency}
            onChange={(event) =>
              updateAccount(
                index,
                "frequency",
                event.target.value
              )
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {frequencyOptions.map(
              (frequency) => (
                <option
                  key={frequency}
                  value={frequency}
                >
                  {frequency}
                </option>
              )
            )}
          </select>
        </Field>

        <Field label="Start Date" required>
          <Input
            type="date"
            value={account.startDate}
            onChange={(event) =>
              updateAccount(
                index,
                "startDate",
                event.target.value
              )
            }
          />
        </Field>

        <Field label="Maturity Date" required>
          <Input
            type="date"
            value={account.maturityDate}
            onChange={(event) =>
              updateAccount(
                index,
                "maturityDate",
                event.target.value
              )
            }
          />
        </Field>

        <Field
          label="Previous Paid"
          hint="Optional"
        >
          <Input
            type="number"
            min="0"
            value={account.previousPaid}
            onChange={(event) =>
              updateAccount(
                index,
                "previousPaid",
                event.target.value
              )
            }
            placeholder="0"
          />
        </Field>

      </div>
    </div>
  );
}

/* -------------------------------- */
/* FIELD */
/* -------------------------------- */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">

      <Label>
        {label}

        {required && (
          <span className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>

      {children}

      {hint && (
        <p className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

    </div>
  );
}

export default PipelineSection;
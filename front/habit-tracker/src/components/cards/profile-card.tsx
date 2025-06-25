import { Button } from "@/components/ui/button.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useNavigate, type UseNavigateResult } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

async function deleteAccount(navigate: UseNavigateResult<string>) {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + "delete-account", {
      credentials: "include",
      mode: "cors",
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    if (response.ok) {
      await navigate({ to: "/" });
    } else {
      toast.error("Failed to delete account");
    }
  } catch {
    toast.error("Failed to delete account", { description: "Could not connect to the server" });
  }
}

export function DeleteButton() {
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" className="flex flex-1">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently destroy all your data and you will not be able to recover it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
            onClick={() => deleteAccount(navigate)}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ProfileCard() {
  return (
    <div className="flex flex-col items-center gap-6 p-6 border rounded-md max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-center">Account Management</h2>
      <Trash2 className="text-destructive" size={48} />
      <p className="text-center text-lg font-medium text-destructive">
        Account deletion is irreversible.
      </p>
      <DeleteButton />
    </div>
  );
}


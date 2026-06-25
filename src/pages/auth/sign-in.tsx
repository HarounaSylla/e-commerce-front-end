import { SignIn } from "@clerk/react";


export function SignInPage() {
    return (<div className="flex min-h-[70vh] items-center justify-center p-4">
        <SignIn />
    </div>
    );
}
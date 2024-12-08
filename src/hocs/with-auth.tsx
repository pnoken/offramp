import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import Spinner from "@/components/spinner";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuth = (props: P) => {
    const { authenticated, ready } = usePrivy();
    const router = useRouter();
    // If not authenticated, return null or a loading state

    if (!ready) {
      return <Spinner />;
    }

    if (ready && !authenticated) {
      // Replace this code with however you'd like to handle an unauthenticated user
      // As an example, you might redirect them to a login page
      router.push("/");
    }

    if (ready && authenticated) {
      // Replace this code with however you'd like to handle an authenticated user
      router.push("/home");
    }

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;

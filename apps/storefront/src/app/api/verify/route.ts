import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import type { AuthTokenClaims } from "@privy-io/server-auth";
import { PrivyClient } from "@privy-io/server-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

export interface AuthenticateSuccessResponse {
  claims: AuthTokenClaims;
}

export interface AuthenticationErrorResponse {
  error: string;
}

export async function GET(req: NextRequest) {
  const headerAuthToken = req.headers.get("authorization")?.replace(/^Bearer /, "");
  const cookieAuthToken = req.cookies.get("privy-token")?.value;

  const authToken = cookieAuthToken || headerAuthToken;
  if (!authToken) {
    return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
  }

  try {
    const claims = await client.verifyAuthToken(authToken);
    return NextResponse.json({ claims });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

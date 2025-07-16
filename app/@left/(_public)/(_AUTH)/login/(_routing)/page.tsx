// @/(_AUTH/(auth)/login/(_routing)/page.tsx
import MvpLoginForm from "../(_service)/(_components)/mvp-login-form";
import GoogleLoginForm from "../(_service)/(_components)/providers/google-login-form";
import ResendLoginForm from "../(_service)/(_components)/providers/resend-login-form";
import ProvidersLoginHeader from "../(_service)/(_components)/providers-login-header";
import PublicLoginFooter from "../(_service)/(_components)/public-login-footer";

export default async function LoginPage() {
  const isGoogleEnabled = !!(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const isResendEnabled = !!(
    process.env.RESEND_API_KEY && process.env.EMAIL_FROM
  );

  const isProductionMode = isGoogleEnabled || isResendEnabled;

  return (
    <div className="relative h-dvh bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        {!isProductionMode ? <MvpLoginForm /> : <ProvidersLoginHeader />}
        <div className="grid gap-6 px-4 sm:px-16">
          {isGoogleEnabled && <GoogleLoginForm />}
          {isResendEnabled && <ResendLoginForm />}
          {/* Add New Provider Here */}
          <PublicLoginFooter />
        </div>
      </div>
    </div>
  );
}

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C1F0C]">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-[#F5F5F5] border-2 border-[#E4A853]',
            headerTitle: 'text-[#2C5530]',
            headerSubtitle: 'text-[#2C5530]/80',
            formButtonPrimary: 'bg-[#2C5530] hover:bg-[#2C5530]/90',
          },
        }}
      />
    </div>
  );
}

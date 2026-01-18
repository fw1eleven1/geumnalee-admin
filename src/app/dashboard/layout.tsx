import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardWrapper } from '@/components/layout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardWrapper userEmail={session.user.email}>
      {children}
    </DashboardWrapper>
  );
}

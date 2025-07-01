import ProfileView from "@/components/ui/profile-view";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <div className="flex justify-evenly items-center p-8 min-h-screen overflow-y-auto sm:flex-row flex-col pt-[calc(var(--nav-height))]">
      <ProfileView username={username} />
    </div>
  );
}

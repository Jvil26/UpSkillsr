import ProfileClient from "@/components/ui/profile-client";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <div
      className="flex justify-evenly items-center p-8 min-h-screen overflow-y-auto sm:flex-row flex-col"
      style={{ paddingTop: "calc(var(--nav-height) + 50px)" }}
    >
      <ProfileClient username={username} />
    </div>
  );
}

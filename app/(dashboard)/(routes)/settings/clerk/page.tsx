import { UserProfile as ClerkUserProfile } from '@clerk/nextjs';

const ClerkPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto h-full">
      <ClerkUserProfile path="/settings/clerk" routing="path" />
    </div>
  );
};

export default ClerkPage;

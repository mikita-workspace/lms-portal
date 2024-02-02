import { UserButton as ClerkUserButton } from '@clerk/nextjs';

const Home = () => {
  return (
    <div>
      <ClerkUserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Home;

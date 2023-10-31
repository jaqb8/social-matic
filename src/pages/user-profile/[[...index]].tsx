import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="flex justify-center p-10">
    <UserProfile path="/user-profile" routing="path" />
  </div>
);

export default UserProfilePage;

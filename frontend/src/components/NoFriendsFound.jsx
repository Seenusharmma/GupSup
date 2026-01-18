import { UserPlus } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="rounded-lg p-8 text-center" style={{
      backgroundColor: 'var(--wa-bg-primary)',
      border: '1px solid var(--wa-border)'
    }}>
      <div className="flex justify-center mb-4">
        <UserPlus className="size-16" style={{ color: 'var(--wa-text-tertiary)' }} strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--wa-text-primary)' }}>
        No friends yet
      </h3>
      <p style={{ color: 'var(--wa-text-secondary)' }} className="text-sm">
        Connect with language partners below to start practicing together!
      </p>
    </div>
  );
};

export default NoFriendsFound;

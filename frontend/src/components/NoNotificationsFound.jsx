import { Bell } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div 
        className="size-24 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: 'var(--wa-bg-secondary)',
          border: '2px solid var(--wa-border)'
        }}
      >
        <Bell className="size-12" style={{ color: 'var(--wa-text-tertiary)' }} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--wa-text-primary)' }}>
        No notifications yet
      </h3>
      <p style={{ color: 'var(--wa-text-secondary)' }} className="text-sm max-w-md">
        When you receive friend requests or new connections, they'll appear here.
      </p>
    </div>
  );
}

export default NoNotificationsFound;

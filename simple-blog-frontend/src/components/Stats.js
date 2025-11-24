
export default function Stats({ user }) {
  if (!user) return <div style={{ padding: 20 }}>You must be logged in to see stats.</div>;
  return (
    <div style={{ padding: 20 }}>
      <h2>Stats</h2>
      <p>Welcome, {user.username}. This is a protected page.</p>
    </div>
  );
}

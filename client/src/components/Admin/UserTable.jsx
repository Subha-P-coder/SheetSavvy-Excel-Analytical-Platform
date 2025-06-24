import React from 'react';

const UserTable = ({ users, onDelete }) => {
  return (
    <table className="admin-user-table">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Role</th><th>Registered</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onDelete(user._id)}>❌ Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

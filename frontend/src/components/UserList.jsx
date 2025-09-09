import { useState } from "react";
import { Trash, UserCog } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const USERS_PER_PAGE = 5;

const UserList = () => {
  const { users, updateUser, deleteUser } = useUserStore();
  const [page, setPage] = useState(1);

  const totalPages = users ? Math.ceil(users.length / USERS_PER_PAGE) : 1;
  const paginatedUsers = users
    ? users.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE)
    : [];

  const setRole = async (id) => {
    await updateUser(id);
  };

  const deleteSelectedUser = async (id) => {
    await deleteUser(id);
  };

  return (
    <>
      <div className="overflow-x-auto mx-auto mt-8 p-5 rounded-l shadow-lg bg-base-100 border border-base-300 max-w-5xl">
        <table className="table table-xs table-pin-rows table-pin-cols">
          <thead className="bg-base-200">
            <tr>
              <th className="text-base font-semibold text-base-content">#</th>
              <td className="text-base font-semibold text-base-content">Username</td>
              <td className="text-base font-semibold text-base-content">Email</td>
              <td className="text-base font-semibold text-base-content">Role</td>
              <td className="text-base font-semibold text-base-content">Created At</td>
              <td className="text-base font-semibold text-base-content">Actions</td>
            </tr>
          </thead>
          <tbody>
            {(paginatedUsers.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-base-content/70">
                  No users found.
                </td>
              </tr>
            )}
            {paginatedUsers.map((user, idx) => (
              <tr key={user._id} className="hover:bg-base-200 transition">
                <th className="font-medium">{(page - 1) * USERS_PER_PAGE + idx + 1}</th>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                    ${user.isAdmin
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                  >
                    {user.isAdmin ? "Admin" : "Parking Staff"}
                  </span>
                </td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button
                    onClick={() => deleteSelectedUser(user._id)}
                    className="btn btn-xs btn-ghost text-red-500 hover:bg-transparent  hover:text-red-700 border-none"
                    title="Delete User"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                  <div className="tooltip" data-tip={user.isAdmin ? "Set as Parking Staff" : "Set as Admin"}>
                    <button
                      onClick={() => setRole(user._id)}
                      className="btn btn-xs btn-ghost text-blue-500 hover:bg-transparent hover:text-blue-700 border-none"
                      title={user.isAdmin ? "Set as Parking Staff" : "Set as Admin"}
                    >
                      <UserCog className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>
      <div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-2">
            <div className="join">
              {Array.from({ length: totalPages }).map((_, i) => (
                <input
                  key={i}
                  className="join-item btn btn-square"
                  type="radio"
                  name="user-pagination"
                  aria-label={String(i + 1)}
                  checked={page === i + 1}
                  onChange={() => setPage(i + 1)}
                  readOnly
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>

  )
}

export default UserList
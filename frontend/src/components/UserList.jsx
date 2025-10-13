import { useState, useEffect } from "react";
import { UserLockIcon, UserCheck2, UserCog, Users, UserStarIcon, UserSearchIcon } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const USERS_PER_PAGE = 10;
const UserList = () => {
  const { user, users, updateUser, deactivateOrActivateUser, fetchAllUsers, updateUserBranch } = useUserStore();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    console.log("users", users);;
  }, []);

  const currentUser = user;

  const [page, setPage] = useState(1);

  const totalPages = users ? Math.ceil(users.length / USERS_PER_PAGE) : 1;
  const paginatedUsers = users
    ? users.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE)
    : [];

  const setRole = async (id) => {
    await updateUser(id);
  };

  const setBranch = async (id, branch) => {
    await updateUserBranch(id, branch);
  };

  const deactivateOrActivateSelectedUser = async (id) => {
    await deactivateOrActivateUser(id);
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter((user) => user.role === "admin").length;
  const totalParkingStaff = users.filter((user) => user.role === "parkingStaff").length;
  const totalItAdmins = users.filter((user) => user.role === "itAdmin").length;
  const totalInactiveUsers = users.filter((user) => !user.isActive).length;
  const totalActiveUsers = users.filter((user) => user.isActive).length;


  return (
    <>
      <div className="overflow-x-auto mx-auto mt-10 mb-15 rounded-l shadow-lg bg-base-100 border-none max-w-7xl">
        <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
            <h2 className="text-2xl font-bold text-white">User List</h2>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            </div>
          </div>
          <p className="text-white/80 mt-2">User details will be displayed here</p>
        </div>

        {/* Stats */}
        <div className="stats w-full bg-base-100  border-base-300">

          <div className="stat">
            <div className="stat-figure text-warning">
              <Users className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-warning">
              {totalUsers}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <UserCheck2 className="h-8 w-8" />
            </div>
            <div className="stat-title">Active Users</div>
            <div className="stat-value text-success">
              {totalActiveUsers}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-error">
              <UserLockIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Inactive Users</div>
            <div className="stat-value text-error">
              {totalInactiveUsers}
            </div>
          </div>


          <div className="stat">
            <div className="stat-figure text-primary">
              <UserSearchIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Parking Staffs</div>
            <div className="stat-value text-primary">
              {totalParkingStaff}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <UserStarIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Admins</div>
            <div className="stat-value text-warning">
              {totalAdmins}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <UserStarIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">IT Admins</div>
            <div className="stat-value text-warning">
              {totalItAdmins}
            </div>
          </div>

        </div>

        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="text-base font-semibold text-base-content">#</th>
              <td className="text-base font-semibold text-base-content">Username</td>
              <td className="text-base font-semibold text-base-content">Email</td>
              <td className="text-base font-semibold text-base-content">Role</td>
              <td className="text-base font-semibold text-base-content">Status</td>
              <td className="text-base font-semibold text-base-content">Branch</td>
              <td className="text-base font-semibold text-base-content">Created At</td>
              {currentUser.role === "itAdmin" && <td className="text-base font-semibold text-base-content">Last Login</td>}
              {currentUser.role === "itAdmin" && <td className="text-base font-semibold text-base-content">Actions</td>}
            </tr>
          </thead>
          <tbody>
            {(paginatedUsers.length === 0) && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-base-content/70">
                  No users found.
                </td>
              </tr>
            )}
            {paginatedUsers.map((user, idx) => (
              <tr key={user._id} className="hover:bg-base-200 transition">
                <th className="py-4">{(page - 1) * USERS_PER_PAGE + idx + 1}</th>
                <td className="py-4">{user.username}</td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
    ${user.role === "itAdmin"
                        ? "bg-red-100 text-red-800 border border-red-300"
                        : user.role === "admin"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                  >
                    {user.role === "itAdmin"
                      ? "IT Admin"
                      : user.role === "admin"
                        ? "Admin"
                        : "Parking Staff"
                    }
                  </span>

                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                    ${user.isActive
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="dropdown  dropdown-end">
                    <label
                      tabIndex={0}
                      className={`btn btn-xs cursor-pointer
                        ${user.branch === "Main Branch" ? "btn-primary" :
                          user.branch === "South Branch" ? "btn-secondary" :
                            user.branch === "North Branch" ? "btn-accent" : "btn-ghost"}`}
                    >
                      {user.branch || "Select Branch"}
                    </label>
                    {currentUser.role === "itAdmin" && (
                      <>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300">
                          <li>
                            <button
                              onClick={(e) => {
                                setBranch(user._id, "Main Branch");
                                e.target.blur();
                                document.activeElement.blur();
                              }}>
                              Main Branch
                            </button>
                          </li>
                          <li>
                            <button onClick={(e) => {
                              setBranch(user._id, "North Branch");
                              e.target.blur();
                              document.activeElement.blur();
                            }}>
                              North Branch
                            </button>
                          </li>
                          <li>
                            <button onClick={(e) => {
                              setBranch(user._id, "South Branch");
                              e.target.blur();
                              document.activeElement.blur();
                            }}>
                              South Branch
                            </button>
                          </li>
                        </ul>
                      </>
                    )
                    }
                  </div>
                </td>
                <td>
                  {user.createdAt
                    ? dayjs(user.createdAt).format('MMM D, YYYY')
                    : "-"}
                </td>
                {currentUser.role === "itAdmin" &&
                  <td>
                    {user.lastLogin
                      ? dayjs(user.lastLogin).fromNow()
                      : "-"}
                  </td>}
                {currentUser.role === "itAdmin" &&
                  <td>
                    {currentUser._id !== user._id ?
                      (
                        <>
                          {user.isActive ? (
                            <button
                              onClick={() => deactivateOrActivateSelectedUser(user._id)}
                              className="btn btn-xs btn-ghost text-red-500 hover:bg-transparent  hover:text-red-700 border-none"
                              title="Deactivate User"
                            >
                              <UserLockIcon className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => deactivateOrActivateSelectedUser(user._id)}
                              className="btn btn-xs btn-ghost text-green-500 hover:bg-transparent hover:text-green-700 border-none"
                              title="Activate User"
                            >
                              <UserCheck2 className="h-4 w-4" />
                            </button>
                          )
                          }

                          <div
                            className="tooltip"
                            data-tip={
                              user.role === "admin"
                                ? "Set as Parking Staff"
                                : "Set as Admin"
                            }
                          >
                            <button
                              onClick={() => setRole(user._id)}
                              className="btn btn-xs btn-ghost text-blue-500 hover:bg-transparent hover:text-blue-700 border-none"
                              title={
                                user.role === "admin"
                                  ? "Set as Parking Staff"
                                  : "Set as Admin"
                              }
                              disabled={user.role === "itAdmin"}
                            >
                              <UserCog className="h-4 w-4" />
                            </button>
                          </div>

                        </>

                      )
                      : null
                    }
                  </td>
                }
              </tr>
            ))}
          </tbody>
        </table>


      </div>
      <div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-10">
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
import { useVehicleStore } from "../stores/useVehicleStore";
import { Check, X, Eye, Edit3, Trash2, FileText, UserPlus, Search, User, CirclePlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "../stores/useUserStore";

const REQUESTS_PER_PAGE = 10;

const VehicleRequestList = () => {
  const {
    vehicles,
    loadingVehicles,
    approveVehicleRequest,
    approveUpdateVehicleRequest,
    approveDeleteVehicleRequest,
    denyVehicleRequest,
    rejectUpdateVehicleRequest,
    rejectDeleteVehicleRequest,
    viewVehicles
  } = useVehicleStore();
  const { user } = useUserStore();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [requestType, setRequestType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log("VehicleRequestList", vehicles);
  }, [vehicles]);

  useEffect(() => {
    console.log("Selected Vehicle", selectedVehicle);
  }, [selectedVehicle]);

  useEffect(() => {
    // Fetch vehicle data when the component mounts
    viewVehicles();
  }, [viewVehicles]);

  // Reset page if search changes and removes items
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleApproveVehicleRegistration = (vehicleId) => {
    approveVehicleRequest(vehicleId);
    console.log(`Approving vehicle with ID: ${vehicleId}`);
  };

  const handleApproveUpdateVehicle = (vehicleId) => {
    approveUpdateVehicleRequest(vehicleId);
    console.log(`Approving update for vehicle with ID: ${vehicleId}`);
  };

  const handleApproveDeleteVehicle = (vehicleId) => {
    approveDeleteVehicleRequest(vehicleId);
    console.log(`Approving delete for vehicle with ID: ${vehicleId}`);
  };

  const handleRejectRegistration = (vehicleId) => {
    denyVehicleRequest(vehicleId);
    console.log(`Rejecting registration for vehicle with ID: ${vehicleId}`);
  };

  const handleRejectUpdateRequest = (vehicleId, type) => {
    rejectUpdateVehicleRequest(vehicleId);
    console.log(`Rejecting ${type} for vehicle with ID: ${vehicleId}`);
  };

  const handleRejectDeleteRequest = (vehicleId) => {
    rejectDeleteVehicleRequest(vehicleId);
    console.log(`Rejecting delete for vehicle with ID: ${vehicleId}`);
  };

  // Open/close modal
  const openModal = (vehicle, type) => {
    setSelectedVehicle(vehicle);
    setRequestType(type);
    document.getElementById("request_modal").showModal();
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setRequestType(null);
    document.getElementById("request_modal").close();
  };

  // Get request data helper function
  const getRequestData = (vehicle, type) => {
    if (!vehicle) return null;

    if (type === "registration") {
      return { requestedAt: vehicle.createdAt, reason: "New vehicle registration" };
    }
    if (type === "update") {
      return vehicle.updateRequest;
    }
    if (type === "delete") {
      return vehicle.deleteRequest;
    }
    return null;
  };

  // Helper function to check if request belongs to current user
  const isUserRequest = (vehicle, type) => {
    if (!user) return false;

    switch (type) {
      case "registration":
        return vehicle.addedBy?._id === user._id || vehicle.addedBy?.id === user._id;
      case "update":
        return vehicle.updateRequest?.requestedBy?._id === user._id ||
          vehicle.updateRequest?.requestedBy?.id === user._id;
      case "delete":
        return vehicle.deleteRequest?.requestedBy?._id === user._id ||
          vehicle.deleteRequest?.requestedBy?.id === user._id;
      default:
        return false;
    }
  };

  // --- Filter for current user's requests only (admin sees all) ---
  const unapprovedVehicles = Array.isArray(vehicles)
    ? vehicles.filter(
      (v) =>
        (v?.isApproved === false ||
          v?.isApproved === "false" ||
          v?.isApproved === null ||
          v?.isApproved === undefined) &&
        (user.role === "admin" || isUserRequest(v, "registration"))
    )
    : [];

  const updateRequests = Array.isArray(vehicles)
    ? vehicles.filter(
      (v) =>
        v?.updateRequest &&
        (!v?.updateRequest?.status || v?.updateRequest?.status === "pending") &&
        (user.role === "admin" || isUserRequest(v, "update"))
    )
    : [];

  const deleteRequests = Array.isArray(vehicles)
    ? vehicles.filter(
      (v) =>
        v?.deleteRequest &&
        (!v?.deleteRequest?.status || v?.deleteRequest?.status === "pending") &&
        (user.role === "admin" || isUserRequest(v, "delete"))
    )
    : [];

  const totalRequests =
    unapprovedVehicles.length + updateRequests.length + deleteRequests.length;

  // Build rows
  const getAllRequestRows = () => {
    const rows = [];
    let rowIndex = 1;

    unapprovedVehicles.forEach((vehicle) => {
      rows.push({
        id: `${vehicle._id}-registration`,
        vehicle,
        type: "registration",
        rowNumber: rowIndex++,
        badge: { text: "Registration", class: "badge-warning" },
        requestedBy: vehicle.addedBy?.username,
        requestData: { requestedAt: vehicle.createdAt, reason: "New vehicle registration" },
      });
    });

    updateRequests.forEach((vehicle) => {
      rows.push({
        id: `${vehicle._id}-update`,
        vehicle,
        type: "update",
        rowNumber: rowIndex++,
        badge: { text: "Edit Request", class: "badge-info" },
        requestedBy: vehicle.updateRequest?.requestedBy?.username,
        requestData: vehicle.updateRequest,
      });
    });

    deleteRequests.forEach((vehicle) => {
      rows.push({
        id: `${vehicle._id}-delete`,
        vehicle,
        type: "delete",
        rowNumber: rowIndex++,
        badge: { text: "Delete Request", class: "badge-error" },
        requestedBy: vehicle.deleteRequest?.requestedBy?.username,
        requestData: vehicle.deleteRequest,
      });
    });

    return rows;
  };

  // --- apply search ---
  const allRequestRows = getAllRequestRows();
  const filteredRows = allRequestRows.filter((row) =>
    row.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- apply pagination ---
  const totalPages = Math.ceil(filteredRows.length / REQUESTS_PER_PAGE) || 1;
  const paginatedRows = filteredRows.slice(
    (page - 1) * REQUESTS_PER_PAGE,
    page * REQUESTS_PER_PAGE
  );

  // Get request data for selected vehicle
  const requestData = selectedVehicle ? getRequestData(selectedVehicle, requestType) : null;

  if (loadingVehicles) {
    return (
      <div className="flex items-center justify-center py-10 h-100">
        <LoadingSpinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto max-w-6xl mx-auto my-10 rounded-xl shadow-lg bg-base-100 border border-base-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {user.role === "admin" ? "All Vehicle Requests" : "My Vehicle Requests"}
            </h2>
            <p className="text-white/80 mt-2">
              {user.role === "admin"
                ? "Manage all registration, edit and delete requests"
                : "View your submitted registration, edit and delete requests"
              }
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <label className="input flex items-center gap-2 w-full md:w-64">
              <Search className="w-4 h-4 opacity-70" />
              <input
                type="text"
                className="grow"
                placeholder="Search by plate number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="stats w-full bg-base-100 border-base-300">
          <div className="stat">
            <div className="stat-figure text-warning">
              <CirclePlusIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Registration Requests</div>
            <div className="stat-value text-warning">
              {unapprovedVehicles.length}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <Edit3 className="h-8 w-8" />
            </div>
            <div className="stat-title">Edit Requests</div>
            <div className="stat-value text-primary">
              {updateRequests.length}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-error">
              <Trash2 className="h-8 w-8" />
            </div>
            <div className="stat-title">Delete Requests</div>
            <div className="stat-value text-error">
              {deleteRequests.length}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <FileText className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Requests</div>
            <div className="stat-value text-info">
              {totalRequests}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Request Type</th>
                <th>Vehicle</th>
                {user.role === "admin" && <th>Requested By</th>}
                <th>Details</th>
                {user.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={user.role === "admin" ? 6 : 4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-base-content/60">
                      <FileText className="h-16 w-16" />
                      <p className="text-lg font-medium">No requests found</p>
                      <p className="text-sm">
                        {user.role === "admin"
                          ? "No pending requests at this time"
                          : "You haven't submitted any requests yet"
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.rowNumber}</td>
                    <td>
                      <div className={`badge ${row.badge.class} badge-xs`}>
                        {row.badge.text}
                      </div>
                    </td>
                    <td>
                      <div className="font-bold">{row.vehicle.plateNumber}</div>
                      <div className="text-sm text-base-content/60">{row.vehicle.makeModel}</div>
                    </td>
                    {user.role === "admin" && <td>{row.requestedBy}</td>}
                    <td>
                      <button
                        onClick={() => openModal(row.vehicle, row.type)}
                        className="btn btn-circle btn-sm btn-ghost hover:bg-transparent border-none"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                    {user.role === "admin" && (
                      <td>
                        <div className="flex gap-2">
                          <div className="tooltip tooltip-top" data-tip="Approve">
                            <button
                              onClick={() => {
                                if (row.type === 'registration') {
                                  handleApproveVehicleRegistration(row.vehicle._id);
                                } else if (row.type === 'update') {
                                  handleApproveUpdateVehicle(row.vehicle._id);
                                } else if (row.type === 'delete') {
                                  handleApproveDeleteVehicle(row.vehicle._id);
                                }
                              }}
                              className="btn btn-circle btn-sm btn-success hover:bg-success/90"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="tooltip tooltip-top" data-tip="Reject">
                            <button
                              onClick={() => {
                                if (row.type === 'registration') {
                                  handleRejectRegistration(row.vehicle._id);
                                } else if (row.type === 'update') {
                                  handleRejectUpdateRequest(row.vehicle._id);
                                } else if (row.type === 'delete') {
                                  handleRejectDeleteRequest(row.vehicle._id);
                                }
                              }}
                              className="btn btn-circle btn-sm btn-error hover:bg-error/90"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-6 mt-4">
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

      {/* Request Modal */}
      <dialog id="request_modal" className="modal backdrop-blur-md">
        <div className="modal-box max-w-2xl bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg">
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>

          {selectedVehicle && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg bg-transparent ${requestType === 'registration' ? 'bg-warning/20' :
                  requestType === 'update' ? 'bg-info/20' : requestType === 'delete' ? 'bg-error/20' : 'bg-warning/20'
                  }`}>
                  {requestType === 'registration' ?
                    <UserPlus className="h-6 w-6 text-warning" /> :
                    requestType === 'update' ?
                      <Edit3 className="h-6 w-6 text-info" /> :
                      <Trash2 className="h-6 w-6 text-error" />
                  }
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {requestType === 'registration' ? 'Registration Request Details' :
                      requestType === 'update' ? 'Edit Request Details' : 'Delete Request Details'}
                  </h3>
                  <p className="text-white/60">
                    Vehicle: {selectedVehicle.plateNumber}
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                {/* Current Vehicle Info */}
                <div className="card bg-base-200 p-4">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Vehicle Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label label-text-alt text-base-content/60">Plate Number</label>
                      <div className="bg-base-100 p-2 rounded text-sm font-mono">
                        {selectedVehicle.plateNumber}
                      </div>
                    </div>
                    <div>
                      <label className="label label-text-alt text-base-content/60">Make & Model</label>
                      <div className="bg-base-100 p-2 rounded text-sm">
                        {selectedVehicle.makeModel}
                      </div>
                    </div>
                    <div>
                      <label className="label label-text-alt text-base-content/60">Owner Name</label>
                      <div className="bg-base-100 p-2 rounded text-sm">
                        {selectedVehicle.ownerName}
                      </div>
                    </div>
                    <div>
                      <label className="label label-text-alt text-base-content/60">Branch</label>
                      <div className="bg-base-100 p-2 rounded text-sm">
                        {selectedVehicle.branch}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Info */}
                {requestData && (
                  <div className="card bg-base-200 p-4">
                    <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Request Information
                    </h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="label label-text-alt text-base-content/60">Requested By</label>
                          <div className="bg-base-100 p-2 rounded text-sm font-semibold">
                            {requestType === "registration"
                              ? selectedVehicle.addedBy?.username
                              : requestType === "update"
                                ? selectedVehicle.updateRequest?.requestedBy?.username
                                : selectedVehicle.deleteRequest?.requestedBy?.username
                            }
                          </div>
                        </div>
                        <div>
                          <label className="label label-text-alt text-base-content/60">Requested At</label>
                          <div className="bg-base-100 p-2 rounded text-sm">
                            {requestData?.requestedAt
                              ? new Date(requestData.requestedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                              : "-"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="label label-text-alt text-base-content/60">Reason</label>
                        <div className="bg-base-100 p-3 rounded text-sm min-h-16">
                          {requestData?.reason || "No reason provided"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Changes Preview (for update requests) */}
                {requestType === 'update' && selectedVehicle.updateRequest && (
                  <div className="card bg-base-200 border border-info/20 p-4">
                    <h4 className="font-semibold text-info mb-3 flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Proposed Changes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedVehicle.updateRequest && (
                        <div>
                          <label className="label label-text-alt text-base-content/60">New Plate Number</label>
                          <div className="bg-info/20 text-info-content p-2 rounded text-sm font-mono">
                            {selectedVehicle.updateRequest.requestedPlateNumber}
                          </div>
                        </div>
                      )}
                      {selectedVehicle.makeModel && (
                        <div>
                          <label className="label label-text-alt text-base-content/60">New Make & Model</label>
                          <div className="bg-info/20 text-info-content p-2 rounded text-sm">
                            {selectedVehicle.updateRequest.requestedModelAndMake}
                          </div>
                        </div>
                      )}
                      {selectedVehicle.ownerName && (
                        <div>
                          <label className="label label-text-alt text-base-content/60">New Owner Name</label>
                          <div className="bg-info/20 text-info-content p-2 rounded text-sm">
                            {selectedVehicle.updateRequest.requestedOwnerName}
                          </div>
                        </div>
                      )}
                      {selectedVehicle.branch && (
                        <div>
                          <label className="label label-text-alt text-base-content/60">New Branch</label>
                          <div className="bg-info/20 text-info-content p-2 rounded text-sm">
                            {selectedVehicle.updateRequest.requestedBranch}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {user.role === "admin" && (
                <div className="modal-action">
                  <button
                    onClick={() => {
                      if (requestType === 'registration') {
                        handleRejectRegistration(selectedVehicle._id);
                      } else if (requestType === 'update') {
                        handleRejectUpdateRequest(selectedVehicle._id);
                      } else if (requestType === 'delete') {
                        handleRejectDeleteRequest(selectedVehicle._id);
                      }
                      closeModal();
                    }}
                    className="btn btn-error"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      if (requestType === 'registration') {
                        handleApproveVehicleRegistration(selectedVehicle._id);
                      }
                      else if (requestType === 'update') {
                        handleApproveUpdateVehicle(selectedVehicle._id);
                      }
                      else if (requestType === 'delete') {
                        handleApproveDeleteVehicle(selectedVehicle._id);
                      }
                      closeModal();
                    }}
                    className="btn btn-success"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="modal-backdrop" onClick={closeModal}>
        </div>
      </dialog>
    </>
  );
};

export default VehicleRequestList;
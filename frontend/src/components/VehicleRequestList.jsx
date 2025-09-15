import { useVehicleStore } from "../stores/useVehicleStore";
import { Check, X, Eye, Edit3, Trash2, Calendar, User, FileText, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const VehicleRequestList = () => {
  const { vehicles, loadingVehicles, approveVehicleRequest} = useVehicleStore();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [requestType, setRequestType] = useState(null);

  useEffect(() => {
    console.log("VehicleRequestList", vehicles);
  }, [vehicles]);

  const handleApprove = (vehicleId) => {
    // Implement the logic to approve the vehicle
    approveVehicleRequest(vehicleId);
    console.log(`Approving vehicle with ID: ${vehicleId}`);
  };
  // Open modal for viewing details
  const openModal = (vehicle, type) => {
    setSelectedVehicle(vehicle);
    setRequestType(type);
    document.getElementById('request_modal').showModal();
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setRequestType(null);
    document.getElementById('request_modal').close();
  };

  const getRequestData = (vehicle, type) => {
    if (type === "update") return vehicle.updateRequest;
    if (type === "delete") return vehicle.deleteRequest;
    if (type === "registration") {
      // Get the addedBy user name for registration requests
      const addedByName = vehicle.addedBy.username

      return {
        requestedAt: vehicle.createdAt,
        reason: "New vehicle registration",
        requestedBy: addedByName
      };
    }
    return null;
  };


  // Calculate all request counts with better filtering
  const unapprovedVehicles = Array.isArray(vehicles) ? vehicles.filter(v => {
    // Handle different possible values for isApproved
    return v.isApproved === false || v.isApproved === "false" || v.isApproved === null || v.isApproved === undefined;
  }) : [];

  const updateRequests = Array.isArray(vehicles) ? vehicles.filter(v => {
    return v.updateRequest && (!v.updateRequest.status || v.updateRequest.status === 'pending');
  }) : [];

  const deleteRequests = Array.isArray(vehicles) ? vehicles.filter(v => {
    return v.deleteRequest && (!v.deleteRequest.status || v.deleteRequest.status === 'pending');
  }) : [];

  const totalRequests = unapprovedVehicles.length + updateRequests.length + deleteRequests.length;



  // Generate all request rows
  const getAllRequestRows = () => {
    const rows = [];
    let rowIndex = 1;

    // Add unapproved vehicle rows
    unapprovedVehicles.forEach((vehicle) => {
      rows.push({
        id: `${vehicle._id}-registration`,
        vehicle,
        type: 'registration',
        rowNumber: rowIndex++,
        badge: { text: 'Registration', class: 'badge-warning' },
        requestedBy: vehicle.addedBy?.username,
        requestData: { requestedAt: vehicle.createdAt, reason: 'New vehicle registration' }
      });
    });

    // Add update request rows
    updateRequests.forEach((vehicle) => {
      rows.push({
        id: `${vehicle._id}-update`,
        vehicle,
        type: 'update',
        rowNumber: rowIndex++,
        badge: { text: 'Edit Request', class: 'badge-info' },
        requestedBy: vehicle.updateRequest?.requestedBy?.username,
        requestData: vehicle.updateRequest
      });
    });

    // Add delete request rows
    deleteRequests.forEach((vehicle) => {
      rows.push({
        id: `${vehicle._id}-delete`,
        vehicle,
        type: 'delete',
        rowNumber: rowIndex++,
        badge: { text: 'Delete Request', class: 'badge-error' },
        requestedBy: vehicle.deleteRequest?.requestedBy?.username,
        requestData: vehicle.deleteRequest
      });
    });

    return rows;
  };

  if (loadingVehicles) {
    return (
      <div className="flex items-center justify-center py-10 h-100">
        <LoadingSpinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const allRequestRows = getAllRequestRows();

  return (
    <>
      <div className="overflow-x-auto max-w-6xl mx-auto my-10 rounded-xl shadow-lg bg-base-100 border border-base-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Vehicle Requests</h2>
              <p className="text-white/80">Manage registration, edit and delete requests</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="stats w-full bg-base-100 border-b border-base-300">
          <div className="stat">
            <div className="stat-figure text-warning">
              <UserPlus className="h-8 w-8" />
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
                <th className="text-base-content font-semibold">
                  <div className="flex items-center gap-2">
                    <span>#</span>
                  </div>
                </th>
                <th className="text-base-content font-semibold">
                  <div className="flex items-center gap-2">
                    <span>Request Type</span>
                  </div>
                </th>
                <th className="text-base-content font-semibold">
                  <div className="flex items-center gap-2">
                    <span>Vehicle</span>
                  </div>
                </th>
                <th className="text-base-content font-semibold">
                  <div className="flex items-center gap-2">
                    <span>Requested By</span>
                  </div>
                </th>
                <th className="text-base-content font-semibold">
                  <div className="flex items-center gap-2">
                    <span>Details</span>
                  </div>
                </th>
                <th className="text-base-content font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allRequestRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-base-content/60">
                      <FileText className="h-16 w-16" />
                      <p className="text-lg font-medium">No requests found</p>
                      <p className="text-sm">All vehicle requests have been processed</p>
                    </div>
                  </td>
                </tr>
              ) : (
                allRequestRows.map((row) => (
                  <tr key={row.id} className="hover:bg-base-200/50 transition-colors">
                    <th className="font-medium">{row.rowNumber}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className={`badge ${row.badge.class} badge-sm`}>
                            {row.badge.text}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold text-base-content">
                            {row.vehicle.plateNumber}
                          </div>
                          <div className="text-sm text-base-content/60">
                            {row.vehicle.makeModel}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold text-base-content">
                            {row.requestedBy}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="tooltip tooltip-top" data-tip="View Details">
                          <button
                            onClick={() => openModal(row.vehicle, row.type)}
                            className="btn btn-circle btn-sm btn-ghost hover:bg-info/20 hover:text-info"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <div className="tooltip tooltip-top" data-tip="Approve">
                          <button
                            onClick={ () => handleApprove(row.vehicle._id)}
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
                              } else {
                                handleReject(row.vehicle._id, row.type);
                              }
                            }}
                            className="btn btn-circle btn-sm btn-error hover:bg-error/90"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Modal */}
      <dialog id="request_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>

          {selectedVehicle && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${requestType === 'registration' ? 'bg-warning/20' :
                  requestType === 'update' ? 'bg-info/20' : 'bg-error/20'
                  }`}>
                  {requestType === 'registration' ?
                    <UserPlus className="h-6 w-6 text-warning" /> :
                    requestType === 'update' ?
                      <Edit3 className="h-6 w-6 text-info" /> :
                      <Trash2 className="h-6 w-6 text-error" />
                  }
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {requestType === 'registration' ? 'Registration Request Details' :
                      requestType === 'update' ? 'Edit Request Details' : 'Delete Request Details'}
                  </h3>
                  <p className="text-base-content/60">
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
                  </div>
                </div>

                {/* Request Info */}
                {(() => {
                  const requestData = getRequestData(selectedVehicle, requestType);
                  return (
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
                              {requestType === "registration" ? selectedVehicle.addedBy?.username : requestType === "update" ? selectedVehicle.updateRequest?.requestedBy.username : selectedVehicle.deleteRequest?.requestedBy.username}
                            </div>
                          </div>
                          <div>
                            <label className="label label-text-alt text-base-content/60">Requested At</label>
                            <div className="bg-base-100 p-2 rounded text-sm">
                              {requestData?.requestedAt ?
                                new Date(requestData.requestedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }) : '-'}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="label label-text-alt text-base-content/60">Reason</label>
                          <div className="bg-base-100 p-3 rounded text-sm min-h-16">
                            {requestData?.reason || 'No reason provided'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Changes Preview (for update requests) */}
                {requestType === 'update' && selectedVehicle.updateRequest && (
                  <div className="card bg-info/10 border border-info/20 p-4">
                    <h4 className="font-semibold text-info mb-3 flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Proposed Changes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedVehicle.updateRequest.plateNumber && (
                        <div>
                          <label className="label label-text-alt text-base-content/60">New Plate Number</label>
                          <div className="bg-info/20 text-info-content p-2 rounded text-sm font-mono">
                            {selectedVehicle.updateRequest.plateNumber}
                          </div>
                        </div>
                      )}
                      {selectedVehicle.updateRequest.makeModel && (
                        <div>
                          <label className="label label-text-alt text-base-content/60">New Make & Model</label>
                          <div className="bg-info/20 text-info-content p-2 rounded text-sm">
                            {selectedVehicle.updateRequest.makeModel}
                          </div>
                        </div>
                      )}
                      {selectedVehicle.updateRequest.ownerName && (
                        <div>
                          <label className="label label-text-alt text-base-content/60">New Owner Name</label>
                          <div className="bg-info/20 text-info-content p-2 rounded text-sm">
                            {selectedVehicle.updateRequest.ownerName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    if (requestType === 'registration') {
                      handleRejectRegistration(selectedVehicle._id);
                    } else {
                      handleReject(selectedVehicle._id, requestType);
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
                      handleApproveRegistration(selectedVehicle._id);
                    } else {
                      handleApprove(selectedVehicle._id, requestType);
                    }
                    closeModal();
                  }}
                  className="btn btn-success"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
              </div>
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
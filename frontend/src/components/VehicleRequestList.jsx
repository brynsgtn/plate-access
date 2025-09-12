import { useState } from "react";
import { Edit, Trash2, Clock } from "lucide-react";

// Mock data for demonstration
const mockVehicles = [
  {
    _id: "1",
    plateNumber: "ABC123",
    makeModel: "Toyota Corolla",
    ownerName: "John Doe",
    updateRequest: {
      requestedBy: "staff1",
      requestedAt: "2024-09-01T10:00:00Z",
      approvedOrDeclinedAt: null,
      reason: "Change color to blue",
      status: "pending"
    },
    deleteRequest: null
  },
  {
    _id: "2",
    plateNumber: "XYZ789",
    makeModel: "Honda Civic",
    ownerName: "Jane Smith",
    updateRequest: null,
    deleteRequest: {
      requestedBy: "staff2",
      approvedOrDeclinedAt: null,
      reason: "Owner sold the car",
      status: "pending"
    }
  },
  {
    _id: "3",
    plateNumber: "LMN456",
    makeModel: "Ford Focus",
    ownerName: "Alice Johnson",
    updateRequest: {
      requestedBy: "staff3",
      requestedAt: "2024-09-03T12:00:00Z",
      approvedOrDeclinedAt: null,
      reason: "Update model year",
      status: "pending"
    },
    deleteRequest: {
      requestedBy: "staff4",
      approvedOrDeclinedAt: null,
      reason: "Duplicate entry",
      status: "pending"
    }
  }
];

const VehicleRequestList = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);

  // Approve or reject logic would go here

  return (
    <div className="overflow-x-auto max-w-6xl mx-auto my-10 rounded-xl shadow-lg bg-base-100 border border-base-300">
      <h2 className="text-xl font-bold text-primary p-4">Vehicle Edit & Delete Requests</h2>
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Plate Number</th>
            <th>Make & Model</th>
            <th>Owner</th>
            <th>Request Type</th>
            <th>Requested By</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.flatMap((vehicle, idx) => {
            const rows = [];
            if (vehicle.updateRequest) {
              rows.push(
                <tr key={vehicle._id + "-edit"}>
                  <th>{idx + 1}</th>
                  <td>{vehicle.plateNumber}</td>
                  <td>{vehicle.makeModel}</td>
                  <td>{vehicle.ownerName}</td>
                  <td>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-info text-info-content border border-info">
                      <Edit className="h-4 w-4" /> Edit
                    </span>
                  </td>
                  <td>{vehicle.updateRequest.requestedBy}</td>
                  <td>{vehicle.updateRequest.reason}</td>
                  <td>
                    <span className={`badge ${vehicle.updateRequest.status === "pending" ? "badge-warning" : vehicle.updateRequest.status === "approved" ? "badge-success" : "badge-error"}`}>
                      {vehicle.updateRequest.status}
                    </span>
                  </td>
                  <td>
                    {vehicle.updateRequest.requestedAt
                      ? new Date(vehicle.updateRequest.requestedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button className="btn btn-xs btn-success mr-2">Approve</button>
                    <button className="btn btn-xs btn-error">Reject</button>
                  </td>
                </tr>
              );
            }
            if (vehicle.deleteRequest) {
              rows.push(
                <tr key={vehicle._id + "-delete"}>
                  <th>{idx + 1}</th>
                  <td>{vehicle.plateNumber}</td>
                  <td>{vehicle.makeModel}</td>
                  <td>{vehicle.ownerName}</td>
                  <td>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-error text-error-content border border-error">
                      <Trash2 className="h-4 w-4" /> Delete
                    </span>
                  </td>
                  <td>{vehicle.deleteRequest.requestedBy}</td>
                  <td>{vehicle.deleteRequest.reason}</td>
                  <td>
                    <span className={`badge ${vehicle.deleteRequest.status === "pending" ? "badge-warning" : vehicle.deleteRequest.status === "approved" ? "badge-success" : "badge-error"}`}>
                      {vehicle.deleteRequest.status}
                    </span>
                  </td>
                  <td>
                    {vehicle.deleteRequest.requestedAt
                      ? new Date(vehicle.deleteRequest.requestedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button className="btn btn-xs btn-success mr-2">Approve</button>
                    <button className="btn btn-xs btn-error">Reject</button>
                  </td>
                </tr>
              );
            }
            return rows;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleRequestList;
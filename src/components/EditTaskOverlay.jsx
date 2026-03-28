function EditTaskOverlay({
  isOpen,
  onClose,
  onSubmit,
  editTaskForm,
  onFormChange,
  projects,
  selectedProjectId,
  users
}) {
  if (!isOpen) return null;

  const selectedProject = projects.find(
    (project) => project.project_id === selectedProjectId
  );

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        zIndex: 1050,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow w-100"
        style={{
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center border-bottom p-3">
          <div className="text-start">
            <h2 className="mb-1">Edit Task</h2>
            <p className="text-muted mb-0">
              Update the selected task.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-3">
          <div className="mb-3">
            <label className="form-label">Project</label>
            <input
              type="text"
              className="form-control"
              value={selectedProject?.project_name ?? ""}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="task_title"
              value={editTaskForm.task_title}
              onChange={onFormChange}
              placeholder="Enter task title"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="4"
              name="task_description"
              value={editTaskForm.task_description}
              onChange={onFormChange}
              placeholder="Enter task description"
            />
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="task_status"
                value={editTaskForm.task_status}
                onChange={onFormChange}
              >
                <option value="todo">todo</option>
                <option value="doing">doing</option>
                <option value="done">done</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Assigned User</label>
              <select
                className="form-select"
                name="assigned_to_user_id"
                value={editTaskForm.assigned_to_user_id}
                onChange={onFormChange}
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.user_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                name="due_date"
                value={editTaskForm.due_date}
                onChange={onFormChange}
              />
            </div>
          </div>
        </div>

        <div className="border-top p-3 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskOverlay;
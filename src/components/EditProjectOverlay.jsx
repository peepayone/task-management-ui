function EditProjectOverlay({
  isOpen,
  onClose,
  onSubmit,
  editProjectForm,
  onFormChange,
  isEditing
}) {
  if (!isOpen) return null;

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
          maxWidth: "560px",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center border-bottom p-3">
          <div>
            <h2 className="h5 mb-1">Edit Project</h2>
            <p className="text-muted mb-0">
              Update the selected project.
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
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-control"
              name="project_name"
              value={editProjectForm.project_name}
              onChange={onFormChange}
              placeholder="Enter project name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Project Description</label>
            <textarea
              className="form-control"
              rows="4"
              name="project_description"
              value={editProjectForm.project_description}
              onChange={onFormChange}
              placeholder="Enter project description"
            />
          </div>
        </div>

        <div className="border-top p-3 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
            disabled={isEditing}
          >
            {isEditing ? "Editng..." : "Cancel"}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={isEditing}
          >
            {isEditing ? "Editng..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProjectOverlay;
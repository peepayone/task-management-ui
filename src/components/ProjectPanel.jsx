/**
 * 左側 Project 清單面板
 */
function ProjectPanel({
  projects,
  selectedProjectId,
  onProjectChange,
  onOpenNewProject,
  onOpenEditProject
}) {
  return (
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-grid col-12">
        <h2 className="h5 mb-2">Projects</h2>
        <div>
          <button
            type="button"
            className="btn btn-success btn-sm m-1"
            onClick={onOpenNewProject}>
            + New Project
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm m-1"
            onClick={onOpenEditProject}
            disabled={!selectedProjectId}
          >
            Edit Project
          </button>
        </div>
        </div> 
      </div>
      <div className="list-group">
        {projects.length > 0 ? (
          projects.map((project) => (
            <button
              key={project.project_id}
              type="button"
              className={`list-group-item list-group-item-action text-start ${
                selectedProjectId === project.project_id ? "active" : ""
              }`}
              onClick={() => onProjectChange(project.project_id)}
            >
              <div className="fw-semibold">{project.project_name}</div>
              <small>
                {project.project_description || "No project description"}
              </small>
            </button>
          ))
        ) : (
          <div className="text-muted">No projects found.</div>
        )}
      </div>
    </div>
  );
}

export default ProjectPanel;
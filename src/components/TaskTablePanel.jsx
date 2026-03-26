/**
 * Task 工具列
 */
function TaskTablePanel({
  users,
  selectedProjectId,
  taskStatusFilter,
  assignedUserFilter,
  sortBy,
  sortOrder,
  setTaskStatusFilter,
  setAssignedUserFilter,
  setSortBy,
  setSortOrder,
  onOpenNewTask,
  tasks,
  selectedTaskId,
  setSelectedTaskId,
  getStatusBadgeClass
}) {
  return (
    <div className="card-body">
        {/* Toolbar */}
        <div className="d-flex flex-column flex-md-row mb-3 w-100">
            <div className="d-grid gap-3 col-12">
                <h2 className="h5 mb-0">Tasks</h2>
                <div className="row g-2">
                    <div className="col-12 col-md-6">
                        <select
                            className="form-select"
                            value={taskStatusFilter}
                            onChange={(e) => setTaskStatusFilter(e.target.value)}>
                            <option value="">Status Filter</option>
                            <option value="todo">todo</option>
                            <option value="doing">doing</option>
                            <option value="done">done</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-6">
                        <select
                            className="form-select"
                            value={assignedUserFilter}
                            onChange={(e) => setAssignedUserFilter(e.target.value)}>
                            <option value="">Assigned User Filter</option>
                            {users.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.user_name}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-6">
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}>
                            <option value="">Sort By</option>
                            <option value="due_date">Due Date</option>
                            <option value="created_at">Created At</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-6">
                        <select
                            className="form-select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button
                    className="btn btn-primary btn-sm"
                    onClick={onOpenNewTask}
                    disabled={!selectedProjectId}>
                    + New Task
                    </button>
                </div>
            </div>
        </div>
        {/* Task Table */}
        <div className="table-responsive">
            <table className="table table-hover align-middle">
            <thead className="table-light">
                <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                </tr>
            </thead>
            <tbody>
                {tasks.length > 0 ? (
                tasks.map((task) => (
                    <tr
                    key={task.task_id}
                    style={{ cursor: "pointer" }}
                    className={
                        selectedTaskId === task.task_id ? "table-active" : ""
                    }
                    onClick={() => setSelectedTaskId(task.task_id)}
                    >
                    <td>{task.task_title}</td>
                    <td>
                        <span
                        className={`badge ${getStatusBadgeClass(
                            task.task_status
                        )}`}
                        >
                        {task.task_status}
                        </span>
                    </td>
                    <td>{task.assigned_to_user_name ?? "-"}</td>
                    <td>
                        {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "-"}
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="4" className="text-center text-muted">
                    No tasks found for this project.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
    </div> 
  );
}

export default TaskTablePanel;
/**
 * Task 詳細資訊面板
 */
function TaskDetailPanel({
  selectedTask,
  comments,
  getStatusBadgeClass,
  newCommentContent,
  setNewCommentContent,
  onSubmitComment,
  onDeleteTask,
  onOpenEditTask,
  onDeleteComment,
  currentUserId,
  isCreatingComment,
  isDeletingComment,
  isDeletingTask
}) {
  return (
    <div>
      <div className="card-body">
        <h2 className="h5 mb-3">Task Detail</h2>
        
        {selectedTask ? (
            <div>
                <div className="mb-3">
                    <div className="mb-2">
                        <strong>Project</strong>
                        <div>{selectedTask.project_name}</div>
                    </div>

                    <div className="mb-2">
                        <strong>Title</strong>
                        <div>{selectedTask.task_title}</div>
                    </div>

                    <div className="mb-2">
                        <strong>Status</strong>
                        <div>
                        <span
                            className={`badge ${getStatusBadgeClass(
                            selectedTask.task_status
                            )}`}
                        >
                            {selectedTask.task_status}
                        </span>
                        </div>
                    </div>

                    <div className="mb-2">
                        <strong>Assigned To</strong>
                        <div>{selectedTask.assigned_to_user_name ?? "-"}</div>
                    </div>

                    <div className="mb-2">
                        <strong>Due Date</strong>
                        <div>
                        {selectedTask.due_date
                            ? new Date(selectedTask.due_date).toLocaleString()
                            : "-"}
                        </div>
                    </div>

                    <div className="mb-2">
                        <strong>Description</strong>
                        <div>{selectedTask.task_description || "-"}</div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm m-1"
                        onClick={onOpenEditTask}
                        disabled={!selectedTask}
                    >
                        Edit Task
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm m-1"
                        onClick={onDeleteTask}
                        disabled={!selectedTask || isDeletingTask}
                    >
                        {isDeletingTask ? "Deleting..." : "Delete Task"}
                    </button>
                </div>
                <hr />
                {/* Comment Section */}
                <h3 className="h6 mb-3">Comments</h3>
                <div className="mb-3">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                    <div
                        key={comment.task_comment_id}
                        className="border rounded p-2 mb-2 bg-light position-relative"
                    >

                        <div className="fw-semibold">{comment.user_name}</div>
                        {/* 只有本人才能刪 */}
                        {comment.user_id === currentUserId && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                            onClick={() => onDeleteComment(comment.task_comment_id)}
                            disabled={isDeletingComment}
                        >
                            ×
                        </button>
                        )}
                        <div>{comment.task_comment_content}</div>
                    </div>
                    ))
                ) : (
                    <p className="text-muted">No comments yet.</p>
                )}
                
                </div>
                <div>
                    <label className="form-label">Leave a Comment</label>
                    <textarea
                        className="form-control mb-2"
                        rows="3"
                        placeholder="Write a comment..."
                        value={newCommentContent}
                        onChange={(event) => setNewCommentContent(event.target.value)}
                    />
                    <button
                    className="btn btn-success btn-sm"
                    onClick={onSubmitComment}
                    disabled={isCreatingComment}>
                        {isCreatingComment ? "Creating..." : "Add Comment"}
                    </button>
                </div>
            </div>
        ) : (
            <p className="text-muted mb-0">Select a task to view details.</p>
        )}
      </div>
    </div>
  );
}

export default TaskDetailPanel;
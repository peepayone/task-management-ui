import { useMemo, useState, useEffect } from "react";
import { API_BASE_URL } from "./services/api";
import ProjectPanel from "./components/ProjectPanel";
import TaskTablePanel from "./components/TaskTablePanel";
import TaskDetailPanel from "./components/TaskDetailPanel";
import NewTaskOverlay from "./components/NewTaskOverlay";
import EditTaskOverlay from "./components/EditTaskOverlay";
import NewProjectOverlay from "./components/NewProjectOverlay";
import EditProjectOverlay from "./components/EditProjectOverlay";

/**
 * 主畫面骨架
 */
function App() {
  // 模擬目前登入者
  const [currentUserId, setCurrentUserId] = useState(1);

  // 預設選第一個 project 與第一個 task
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Task filter / sort
  const [taskStatusFilter, setTaskStatusFilter] = useState("");
  const [assignedUserFilter, setAssignedUserFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // New Task Overlay
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    task_title: "",
    task_description: "",
    task_status: "todo",
    assigned_to_user_id: "",
    due_date: "",
  });

  // Edit Task Overlay
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editTaskForm, setEditTaskForm] = useState({
    task_title: "",
    task_description: "",
    task_status: "todo",
    assigned_to_user_id: "",
    due_date: "",
  });

  // New Project Overlay
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    project_name: "",
    project_description: "",
  });

  // Edit Project Overlay
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editProjectForm, setEditProjectForm] = useState({
    project_name: "",
    project_description: "",
  });

  // loading state
  const [actionLoading, setActionLoading] = useState("");

  // users
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
    .then(((res) => res.json()))
    .then((data) => {
      setUsers(data);

      // 預設選第一個 user
      if(data.length > 0) setCurrentUserId(data[0].user_id);
    })
    .catch((err) => console.log("Failed to fetch users:", err));
  }, []);

  // projects
  const [projects, setProjects] = useState([]);
  const fetchProjects = async (preferredProjectId = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data = await response.json();
      const projectList = Array.isArray(data) ? data : [];

      setProjects(projectList);

      if (preferredProjectId) {
        const matchedProject = projectList.find(
          (project) => project.project_id === preferredProjectId
        );

        if (matchedProject) {
          setSelectedProjectId(preferredProjectId);
          return;
        }
      }

      if (projectList.length > 0) {
        setSelectedProjectId(projectList[0].project_id);
      } else {
        setSelectedProjectId(null);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
      setSelectedProjectId(null);
    }
  };
  useEffect(() => {  
    fetchProjects();
  }, []);

  // tasks 理論上已篩選自projectId
  const [tasks, setTasks] = useState([]);
  /**
   * 依目前條件抓取 task 清單
   * @param {number} projectId 目前選到的 project id
   * @param {number | null} preferredTaskId 若有指定，抓完後優先選這筆 task
   */
  const fetchTasks = async (projectId, preferredTaskId = null) => {
    // 沒選 project 就不查
    if (!projectId) {
      setTasks([]);
      setSelectedTaskId(null);
      setComments([]);
      return;
    }

    const params = new URLSearchParams();
    params.append("projectId", projectId);

    if (taskStatusFilter) {
      params.append("taskStatus", taskStatusFilter);
    }

    if (assignedUserFilter) {
      params.append("assignedToUserId", assignedUserFilter);
    }

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    if (sortOrder) {
      params.append("sortOrder", sortOrder);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const data = await response.json();
      const taskList = Array.isArray(data) ? data : [];

      setTasks(taskList);

      // 如果有指定想選中的 task，就優先選它
      if (preferredTaskId) {
        const matchedTask = taskList.find(
          (task) => task.task_id === preferredTaskId
        );

        if (matchedTask) {
          setSelectedTaskId(preferredTaskId);
          return;
        }
      }

      // 沒指定或找不到指定 task，就選第一筆
      if (taskList.length > 0) {
        setSelectedTaskId(taskList[0].task_id);
      } else {
        setSelectedTaskId(null);
        setComments([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
      setSelectedTaskId(null);
      setComments([]);
    }
  };
  useEffect(() => {
    // 切換查詢條件前先清空目前 detail / comments
    setSelectedTaskId(null);
    setTasks([]);
    setComments([]);
    setNewCommentContent("");

    fetchTasks(selectedProjectId);
  }, [
    selectedProjectId,
    taskStatusFilter,
    assignedUserFilter,
    sortBy,
    sortOrder,
  ]);
  
  // comments (依task變化)
  const [comments, setComments] = useState([]);
  // new comment
  const [newCommentContent, setNewCommentContent] = useState("");
  const fetchComments = async (taskId) => {
    if (!taskId) {
      setComments([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Failed to fetch comments: ", error);
      setComments([]);
    }
  }
  useEffect(() => {
    setNewCommentContent("");
    fetchComments(selectedTaskId);
  }, [selectedTaskId]);

  // 取得目前選到的 task
  const selectedTask = useMemo(() => {
    return tasks.find((task) => task.task_id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // 取得目前 task 底下的留言
  const selectedTaskComments = Array.isArray(comments)? comments : [];

  // 狀態 badge 顏色
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "todo":
        return "bg-secondary";
      case "doing":
        return "bg-primary";
      case "done":
        return "bg-success";
      default:
        return "bg-dark";
    }
  };

  // 清空所有task舊資料
  const setAllTaskDefault = () =>{
    setSelectedTaskId(null);
    setTasks([]);
    setComments([]);
    setTaskStatusFilter("");
    setAssignedUserFilter("");
    setSortBy("");
    setSortOrder("asc");
    setNewCommentContent("");
  };

  // 建立新project -POST -refresh projectlist -choose new project
  const handleCreateProject = async () => {
    if (!newProjectForm.project_name.trim()) {
      alert("Project name is required.");
      return;
    }

    const payload = {
      project_name: newProjectForm.project_name.trim(),
      project_description: newProjectForm.project_description.trim(),
      created_by_user_id: currentUserId,
    };

    try {
      // diable button
      setActionLoading("createProject");

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const createdProject = await response.json();

      // 關閉 new project overlay
      closeNewProjectOverlay();

      // refresh projects，並自動切到新 project
      await fetchProjects(createdProject.project_id);

      // 切新 project 時，順手把 task/detail/comment 狀態清掉
      setSelectedTaskId(null);
      setTasks([]);
      setComments([]);
    } catch (error) {
      console.error("Create project failed:", error);
      alert("Failed to create project.");
    } finally {
      setActionLoading("");
    }
  };

  // update project -PUT
  const handleEditProject = async () => {
    if (!selectedProjectId) {
      alert("Please select a project first.");
      return;
    }

    if(!editProjectForm.project_name.trim()) {
      alert("Project name is required");
      return;
    }

    const payload = {
      project_name: editProjectForm.project_name.trim(),
      project_description: editProjectForm.project_description.trim()
    }

    try {
      // diable button
      setActionLoading("editProject");

      const response = await fetch(`${API_BASE_URL}/projects/${selectedProjectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      //關閉 overlay
      closeEditProjectOverlay();

      // 更新後重抓 projects，並維持選中同一個 project
      await fetchProjects(selectedProjectId);
    } catch (error) {
      console.error("Update project failed:", error);
      alert("Failed to update project.");
    } finally {
      setActionLoading("");
    }
  };

  // 刪除 project -refresh project list
  const handleDeleteProject = async () => {
    if (!selectedProjectId) {
      alert("Please select a project first.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      // diable button
      setActionLoading("deleteProject");

      const response = await fetch(
        `${API_BASE_URL}/projects/${selectedProjectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      // 重新抓 project list
      await fetchProjects();

      // 重設所有資料
      setAllTaskDefault
    } catch (error) {
      console.error("Delete task failed:", error);
      alert("Failed to delete task.");
    } finally {
      setActionLoading("");
    }
  };
  
  // 建立新 task -POST -成功後關閉 overlay -refresh task list -choose new task
  const handleCreateTask = async () => {
    // 簡單前端驗證
    if (!selectedProjectId) {
      alert("Please select a project first.");
      return;
    }

    if (!newTaskForm.task_title.trim()) {
      alert("Task title is required.");
      return;
    }

    // 依你的後端 DTO / API 格式組 payload
    const payload = {
      project_id: selectedProjectId,
      task_title: newTaskForm.task_title.trim(),
      task_description: newTaskForm.task_description.trim(),
      task_status: newTaskForm.task_status,
      assigned_to_user_id: newTaskForm.assigned_to_user_id
        ? Number(newTaskForm.assigned_to_user_id)
        : null,
      created_by_user_id: currentUserId,
      due_date: newTaskForm.due_date || null,
    };

    try {
      // diable button
      setActionLoading("createTask");

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status}`);
      }

      // 假設後端會回傳新建 task
      const createdTask = await response.json();

      // 關閉 overlay
      closeNewTaskOverlay();

      // 重新抓 task 清單，並優先選中新建 task
      await fetchTasks(selectedProjectId, createdTask.task_id);
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task.");
    } finally {
      setActionLoading("");
    }
  };

  // 刪除 task -refresh task list
  const handleDeleteTask = async () => {
    if (!selectedTaskId) {
      alert("Please select a task first.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      // disable button
      setActionLoading("deleteTask");

      const response = await fetch(
        `${API_BASE_URL}/tasks/${selectedTaskId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      // 重新抓 task list
      await fetchTasks(selectedProjectId);
    } catch (error) {
      console.error("Delete task failed:", error);
      alert("Failed to delete task.");
    } finally {
      setActionLoading("");
    }
  };

  // update task -PUT -refresh task list - choose this task
  const handleEditTask = async () => {
    if (!selectedTaskId) {
      alert("Please select a task first.");
      return;
    }

    if (!editTaskForm.task_title.trim()) {
      alert("Task title is required.");
      return;
    }

    const payload = {
      task_title: editTaskForm.task_title.trim(),
      task_description: editTaskForm.task_description.trim(),
      task_status: editTaskForm.task_status,
      assigned_to_user_id: editTaskForm.assigned_to_user_id
        ? Number(editTaskForm.assigned_to_user_id)
        : null,
      due_date: editTaskForm.due_date || null,
    };

    try {
      // diable button
      setActionLoading("editTask");

      const response = await fetch(`${API_BASE_URL}/tasks/${selectedTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      // 關閉overlay
      closeEditTaskOverlay();

      // 更新後重抓，並維持選中這筆 task
      await fetchTasks(selectedProjectId, selectedTaskId);
    } catch (error) {
      console.error("Update task failed:", error);
      alert("Failed to update task.");
    } finally {
      setActionLoading("");
    }
  };

  // 建立新 task comment -refresh task comments
  const handleCreateComment = async () =>{
    if (!selectedTaskId){
      alert("This should never happened.");
      return;
    }

    if (!newCommentContent.trim()) {
      alert("Comment is required.");
      return;
    }

    const payload = {
      user_id: currentUserId,
      task_comment_content: newCommentContent.trim()
    };

    try {
      // diable button
      setActionLoading("createComment");

      const response = await fetch(`${API_BASE_URL}/tasks/${selectedTaskId}/comments`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to create comment: ${response.status}`);
      }

      // clear comment after submit successfully
      setNewCommentContent("");
      // refresh comments section 
      await fetchComments(selectedTaskId);
    }catch(error) {
      console.error("Failed to create comment:", error);
      alert("Failed to create comment.");
    } finally {
      setActionLoading("");
    }
  };

  // 刪除 task comment -refresh task comments
  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;

    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    try {
      // diable button
      setActionLoading("deleteComment");

      const response = await fetch(
        `${API_BASE_URL}/task-comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      // 重新抓 comments
      await fetchComments(selectedTaskId);
    } catch (error) {
      console.error("Delete comment failed:", error);
      alert("Failed to delete comment.");
    } finally {
      setActionLoading("");
    }
  };

 // 切換 Project- 清空 task 舊資料 - 重設 filter / sort - 切換目前選到的 project
  const handleProjectChange = (projectId) => {
    if (projectId === selectedProjectId) return;
    setAllTaskDefault();
    setSelectedProjectId(projectId);
  };
  
  // 開啟 New Project Overlay
  const openNewProjectOverlay = () => {
    setNewProjectForm({
      project_name: "",
      project_description: "",
    });

    setIsNewProjectOpen(true);
  };
  // 開啟 Edit Project Overlay
  const openEditProjectOverlay = () => {
    const selectedProject = projects.find(
      (project) => project.project_id === selectedProjectId
    );

    if(!selectedProject) return;

    setEditProjectForm({
      project_name: selectedProject.project_name || "",
      project_description: selectedProject.project_description || "",
    });

    setIsEditProjectOpen(true);
  };
  // 開啟 New Task Overlay
  const openNewTaskOverlay = () => {
    setNewTaskForm({
      task_title: "",
      task_description: "",
      task_status: "todo",
      assigned_to_user_id: currentUserId || "",
      due_date: "",
    });

    setIsNewTaskOpen(true);
  };
  // 開啟 Edit Task Overlay
  const openEditTaskOverlay = () => {
    if (!selectedTask) {
      return;
    }

    setEditTaskForm({
      task_title: selectedTask.task_title || "",
      task_description: selectedTask.task_description || "",
      task_status: selectedTask.task_status || "todo",
      assigned_to_user_id: selectedTask.assigned_to_user_id ?? "",
      due_date: selectedTask.due_date
        ? selectedTask.due_date.slice(0, 10)
        : "",
    });

    setIsEditTaskOpen(true);
  };

  // 關閉 New Project Overlay
  const closeNewProjectOverlay = () => {
    setIsNewProjectOpen(false);
  }
  // 關閉 Edit Project Overlay
  const closeEditProjectOverlay = () => {
    setIsEditProjectOpen(false);
  }
  // 關閉 New Task Overlay
  const closeNewTaskOverlay = () => {
    setIsNewTaskOpen(false);
  }
  // 關閉 Edit Task Overlay
  const closeEditTaskOverlay = () => {
    setIsEditTaskOpen(false);
  }

  // New Project Form Change
  const handleNewProjectFormChange = (event) => {
    const { name, value } = event.target;

    setNewProjectForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  // Edit Project Form Change
  const handleEditProjectFormChange = (event) => {
    const { name, value } = event.target;

    setEditProjectForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  // New Task Form Change
  const handleNewTaskFormChange = (event) => {
    const { name, value } = event.target;

    setNewTaskForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  // Edit Task Form Change
  const handleEditTaskFormChange = (event) => {
    const { name, value } = event.target;

    setEditTaskForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h1 className="h3 mb-1">Task Management System</h1>
                <p className="text-muted mb-0">
                  React + ASP.NET Core Web API demo
                </p>
              </div>
              <div style={{ minWidth: "220px" }}>
                <label className="form-label mb-1">Current User</label>
                <select
                  className="form-select"
                  value={currentUserId}
                  onChange={(event) =>
                    setCurrentUserId(Number(event.target.value))
                  }
                >
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.user_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主畫面三區塊 */}
      <div className="row g-3">
        {/* 左側：Project Panel */}
        <div className="col-12 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <ProjectPanel
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectChange={handleProjectChange}
              onOpenNewProject={openNewProjectOverlay}
              onOpenEditProject={openEditProjectOverlay}
              onDeleteProject={handleDeleteProject}
              isDeleting={actionLoading === "deleteProject"}
              />
          </div>     
        </div>

        {/* 中間：Task Area */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 h-100">

              <TaskTablePanel
                  users={users}
                  selectedProjectId={selectedProjectId}
                  taskStatusFilter={taskStatusFilter}
                  assignedUserFilter={assignedUserFilter}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  setTaskStatusFilter={setTaskStatusFilter}
                  setAssignedUserFilter={setAssignedUserFilter}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                  onOpenNewTask={openNewTaskOverlay}
                  tasks={tasks}
                  selectedTaskId={selectedTaskId}
                  setSelectedTaskId={setSelectedTaskId}
                  getStatusBadgeClass={getStatusBadgeClass}/>

          </div>
        </div>

        {/* 右側：Task Detail + Comments */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <TaskDetailPanel
              selectedTask={selectedTask}
              comments={selectedTaskComments}
              getStatusBadgeClass={getStatusBadgeClass}
              newCommentContent={newCommentContent}
              setNewCommentContent={setNewCommentContent}
              onSubmitComment={handleCreateComment}
              onDeleteTask={handleDeleteTask}
              onOpenEditTask={openEditTaskOverlay}
              onDeleteComment={handleDeleteComment}
              currentUserId={currentUserId}
              isCreatingComment={actionLoading === "createComment"}
              isDeletingComment={actionLoading === "deleteComment"}
              isDeletingTask={actionLoading === "deleteTask"}
            />
          </div>
        </div>
      </div>
      <NewTaskOverlay
        isOpen={isNewTaskOpen}
        onClose={closeNewTaskOverlay}
        newTaskForm={newTaskForm}
        onFormChange={handleNewTaskFormChange}
        onSubmit={handleCreateTask}
        projects={projects}
        selectedProjectId={selectedProjectId}
        users={users}
        isCreating={actionLoading === "createTask"}
      />
      <EditTaskOverlay
        isOpen={isEditTaskOpen}
        onClose={closeEditTaskOverlay}
        editTaskForm={editTaskForm}
        onFormChange={handleEditTaskFormChange}
        onSubmit={handleEditTask}
        projects={projects}
        selectedProjectId={selectedProjectId}
        users={users}
        isEditing={actionLoading === "editTask"}
      />
      <NewProjectOverlay
        isOpen={isNewProjectOpen}
        onClose={closeNewProjectOverlay}
        onSubmit={handleCreateProject}
        newProjectForm={newProjectForm}
        onFormChange={handleNewProjectFormChange}
        isCreating={actionLoading === "createProject"}
      />
      <EditProjectOverlay
        isOpen={isEditProjectOpen}
        onClose={closeEditProjectOverlay}
        onSubmit={handleEditProject}
        editProjectForm={editProjectForm}
        onFormChange={handleEditProjectFormChange}
        isEditing={actionLoading === "editProject"}
      />
    </div>
  );
}

export default App;
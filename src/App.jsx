import { useMemo, useState, useEffect } from "react";
import { API_BASE_URL } from "./services/api";
import ProjectPanel from "./components/ProjectPanel";
import TaskTablePanel from "./components/TaskTablePanel";
import TaskDetailPanel from "./components/TaskDetailPanel";

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
  useEffect(() => {  
    fetch(`${API_BASE_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);

        // 預設選第一個 project
        if (data.length > 0) {
          setSelectedProjectId(data[0].project_id);
        }
      })
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  // tasks 理論上已篩選自projectId
  const [tasks, setTasks] = useState([]);
  useEffect(() => {

    // 如果沒有選到 project，就直接結束
    if (!selectedProjectId) {
      return;
    }

    // 用 URLSearchParams 組 query string
    const params = new URLSearchParams();

     // projectId是目前最基本的篩選條件
    params.append("projectId", selectedProjectId);
    // 有選 status 才帶
    if (taskStatusFilter) {
      params.append("taskStatus", taskStatusFilter);
    }

    // 有選 assigned user 才帶
    if (assignedUserFilter) {
      params.append("assignedToUserId", assignedUserFilter);
    }

    // 有選 sortBy 才帶
    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    // 有選 sortOrder 才帶
    if (sortOrder) {
      params.append("sortOrder", sortOrder);
    }

    fetch(`${API_BASE_URL}/tasks?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const taskList = Array.isArray(data) ? data : [];

        setTasks(taskList);
 
        // 如果有 task，就預設選第一筆
        setSelectedTaskId(taskList.length > 0 ? taskList[0].task_id : null);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setAllTaskDefault();
      });
  }, [selectedProjectId,
      taskStatusFilter,
      assignedUserFilter,
      sortBy,
      sortOrder,]);

  // comments (依task變化)
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (!selectedTaskId) {
      setComments([]);
      return;
    }

    fetch(`${API_BASE_URL}/tasks/${selectedTaskId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch comments:", err);
        setComments([]);
    });
  }, [selectedTaskId]);

  /**
   * 取得目前選到的 task
   */
  const selectedTask = useMemo(() => {
    return tasks.find((task) => task.task_id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  /**
   * 取得目前 task 底下的留言
   */
  const selectedTaskComments = Array.isArray(comments)? comments : [];

  /**
   * 狀態 badge 顏色
   */
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

  /**
   * 清空所有task舊資料
   */
  const setAllTaskDefault = () =>{
    setSelectedTaskId(null);
    setTasks([]);
    setComments([]);
    setTaskStatusFilter("");
    setAssignedUserFilter("");
    setSortBy("");
    setSortOrder("asc");
  }

  /**
 * 開啟 New Task Overlay
 */
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

/**
 * 關閉 New Task Overlay
 */
  const closeNewTaskOverlay = () => {
    setIsNewTaskOpen(false);
  };

/**
 * 處理 New Task 表單欄位變化
 */
  const handleNewTaskFormChange = (event) => {
    const { name, value } = event.target;

    setNewTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

/**
 * 切換 Project
 * - 清空 task 舊資料
 * - 重設 filter / sort
 * - 切換目前選到的 project
 */
  const handleProjectChange = (projectId) => {
    setAllTaskDefault();
    setSelectedProjectId(projectId);
  };

  const handleOpenNewProject = () => {
    console.log("Open New Project Overlay");
  };

  const handleOpenNewTask = () => {
    console.log("Open New Task Overlay");
  };

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
              onOpenNewProject={handleOpenNewProject}/>
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
                  onOpenNewTask={handleOpenNewTask}
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
            />
          </div>
        </div>
      </div>
      {isNewTaskOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 1050,
            padding: "16px",
          }}
          onClick={closeNewTaskOverlay}
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
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center border-bottom p-3">
              <div>
                <h2 className="h5 mb-1">New Task</h2>
                <p className="text-muted mb-0">
                  Create a new task for the selected project.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={closeNewTaskOverlay}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-3">
              <div className="mb-3">
                <label className="form-label">Project</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    projects.find(
                      (project) => project.project_id === selectedProjectId
                    )?.project_name ?? ""
                  }
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="task_title"
                  value={newTaskForm.task_title}
                  onChange={handleNewTaskFormChange}
                  placeholder="Enter task title"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="task_description"
                  value={newTaskForm.task_description}
                  onChange={handleNewTaskFormChange}
                  placeholder="Enter task description"
                />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="task_status"
                    value={newTaskForm.task_status}
                    onChange={handleNewTaskFormChange}
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
                    value={newTaskForm.assigned_to_user_id}
                    onChange={handleNewTaskFormChange}
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
                    value={newTaskForm.due_date}
                    onChange={handleNewTaskFormChange}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-top p-3 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeNewTaskOverlay}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  console.log("New Task Form:", newTaskForm);
                }}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>    
  );
}

export default App;
// components/SEOManager.js
import { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

var oldData = [];
const Task = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [duration, setduration] = useState(Number);
  const [isApiHitComplete, setIsApiHitComplete] = useState(false);
  const [isDataFound, setIsDataFound] = useState(false);
  const [task, setTask] = useState([]);
  const [taskid, setTaskId] = useState("");
  const [searchInput,setSearchInput] = useState('')

  useEffect(() => {
    getTaskList();
  }, []);

  const getTaskList = () => {
    fetch(`http://localhost:8000/api/task`, {}).then(async (res) => {
      // console.log(res)
      let response = await res.json();
      console.log(response.data);
      if (response.data) {
        if (response.data.length > 0) {
          setTask(response.data);
        }
        oldData = response.data;
      } else {
        Swal.fire({
          title: "error",
          html: `${response.error}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
      setIsApiHitComplete(true);
      setIsDataFound(true);
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTaskId("");
    setname("");
    setdescription("");
    setduration("");
  };
  const handleModalShow = () => setShowModal(true);

  const handleTaskSave = (e) => {
    console.log("hello");
    console.log(name, description, duration);
    e.preventDefault();
    const fd = new FormData();
    fd.append("taskName", name);
    fd.append("taskDescription", description);
    fd.append("taskDuration", duration);
    fetch(`http://localhost:8000/api/task`, {
      method: "POST",
      body: fd,
    }).then(async (response) => {
      var res = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: `${res.message}`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          setIsDataFound(false);
          setShowModal(false);
          setname("");
          setdescription("");
          getTaskList();
        });
      } else {
        Swal.fire({
          title: "error",
          text: `${res.error}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  };
  const handleEditTask = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("taskName", name);
    fd.append("taskDescription", description);
    fd.append("taskDuration", duration);
    fetch(`http://localhost:8000/api/task/` + taskid, {
      method: "PUT",
      body: fd,
    }).then(async (response) => {
      var res = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: `${res.message}`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          setShowModal(false);
          setname("");
          setdescription("");
          getTaskList();
        });
      } else {
        Swal.fire({
          title: "error",
          text: `${res.error}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  };
  const handleEdit = (e, id) => {
    setTaskId(id);
    fetch(`http://localhost:8000/api/task/` + id, {}).then(async (response) => {
      var res = await response.json();
      console.log(res.data);
      setShowModal(true);
      setname(res.data.task_name);
      setdescription(res.data.task_description);
      setduration(res.data.task_duration_hr);
    });
  };
  const handleDelete = (e, id) => {
    Swal.fire({
      title: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8000/api/task/` + id, {
          method: "Delete",
        })
          .then(async (response) => {
            // console.log(response)
            if (response.ok) {
              var res = await response.json();
              Swal.fire({
                title: "Success",
                text: `${res.message}`,
                icon: "success",
                confirmButtonText: "Ok",
              }).then((e) => {
                getTaskList();
              });
            } else {
              Swal.fire({
                title: "error",
                text: `${res.error}`,
                icon: "error",
                confirmButtonText: "Ok",
              });
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  };


  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    const searchTerm = e.target.value
      .trim()
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const searchKeyword = new RegExp(`\\b${searchTerm}\\w*\\b`, "i");

    if (e.target.value === "") {
        setTask(oldData);
      setIsDataFound(oldData.length > 0);
    } else {
      const filteredData = oldData.filter(
        (data) =>
          searchKeyword.test(
               data.task_name.toLowerCase()
          )
      );

      setTask(filteredData);
      setIsDataFound(filteredData.length > 0);
    }
  };

  return (
    <>
      <div className="custom-table-nav">
        <div className="left-div"> </div>
        <div className="right-div">
          <div className="d-flex justify-content-between align-items-center">
            <input
              type="text"
              className="form-control m-2"
                value={searchInput}
              placeholder="Search..."
                onChange={handleSearchChange}
            />
            <Button variant="primary" onClick={handleModalShow}>
              +
            </Button>
          </div>
        </div>
      </div>

      {isApiHitComplete ? (
        isDataFound ? (
          <table className={`table table-hover custom-table`}>
            <thead style={{ top: `8vh` }}>
              <tr>
                <th style={{ background: "var(--primary)" }}>Name</th>
                <th style={{ background: "var(--primary)" }}>Description</th>
                <th style={{ background: "var(--primary)" }}>Duration</th>
                <th style={{ background: "var(--primary)" }}>Remove</th>
                <th style={{ background: "var(--primary)" }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {task &&
                task.map((s, i) => {
                  // console.log(clg)
                  return (
                    <tr key={i}>
                      <td
                        style={{ wordWrap: "break-word", whiteSpace: "unset" }}
                      >
                        {s.task_name}
                      </td>
                      <td
                        style={{ wordWrap: "break-word", whiteSpace: "unset" }}
                      >
                        {s.task_description}
                      </td>
                      <td
                        style={{ wordWrap: "break-word", whiteSpace: "unset" }}
                      >
                        {s.task_duration_hr}
                      </td>
                      <td
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "unset",
                          cursor: "pointer",
                        }}
                        onClick={(e) => handleDelete(e, s._id)}
                      >
                        Delete
                      </td>
                      <td
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "unset",
                          cursor: "pointer",
                        }}
                        onClick={(e) => handleEdit(e, s._id)}
                      >
                        Edit
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "80vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "500" }}>
              <span style={{ color: "#0d6efd", cursor: "pointer" }}>
                {" "}
                No Records{" "}
              </span>
            </div>
          </div>
        )
      ) : (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "80vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner animation="border" role="status" variant="info">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Task modal */}

      <Modal
        show={showModal}
        onHide={handleModalClose}
        size="md"
        centered
        backdrop="static"
        keyboard={false}
        animation="true"
      >
        <Modal.Header closeButton>
          <Modal.Title>{taskid ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12} className="mb-2">
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-2">
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-2">
                <Form.Group controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={duration}
                    onChange={(e) => setduration(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {taskid == "" ? (
            <Button variant="info" onClick={handleTaskSave}>
              Save
            </Button>
          ) : (
            <Button variant="info" onClick={handleEditTask}>
              Edit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Task;

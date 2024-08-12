import { useEffect, useState } from "react";
import axios from "axios";
import profile_default from "../images/profile-default.png";
import { useNavigate, Link } from "react-router-dom";
import khu_image from "../images/100.png";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import UserReq from "../components/UserReq";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ProfessorReq from "../components/ProfessorReq";
import ManagerReq from "../components/ManagerReq";
import Ex_arbitrator from "../components/Ex_arbitrator";

const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [id, setId] = useState(localStorage.getItem("user_id"));
  const [valid, setValid] = useState(localStorage.getItem("is_validate"));
  const [page, setPage] = useState(0);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState();
  const navigate = useNavigate();
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  useEffect(() => {
    if (valid === "F" || valid === "W" || valid === null) {
      navigate("/");
    }
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/user/user/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "مشکلی در دریافت اطلاعات پیش آمده",
        });
        setLoading(false);
      });
  }, [role]);

  const logoutClick = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      {!loading ? (
        <div className="dashboard">
          <div className="right-dashboard">
            <div className="profile-image">
              <img src={profile_default}></img>
            </div>
            <div className="navigation-link">
              <ul>
                <li>
                  <Link
                    style={page === 0 ? { backgroundColor: "#e3fef736" } : {}}
                    onClick={() => setPage(0)}
                  >
                    خانه
                  </Link>
                </li>
                <li>
                  <Link
                    style={page === 1 ? { backgroundColor: "#e3fef736" } : {}}
                    onClick={() => setPage(1)}
                  >
                    درخواست ها
                  </Link>
                </li>
                <li>
                  {user.role != 'DK' && <Link
                    style={page === 2 ? { backgroundColor: "#e3fef736" } : {}}
                    onClick={() => setPage(2)}
                  >
                    پروفایل
                  </Link>}
                </li>
                <li onClick={(e) => logoutClick(e)}>
                  <Link>خروج</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="left-dashboard">
            {page === 0 && <HomePage setPage={setPage} />}
            {page === 1 && (
              <RequestPage user={user} token={token} Toast={Toast} />
            )}
            {page === 2 && (
              <ProfilePage user={user} role={role} token={token} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "3rem",
            }}
          >
            <CircularProgress />
          </Box>
        </div>
      )}
    </>
  );
};
const HomePage = ({ setPage }) => {
  return (
    <div className="homepage-dashboard">
      <div className="content">
        <img src={khu_image} width="20%"></img>
        <h2>به سامانه دفاع دانشجویی دانشگاه خوارزمی خوش آمدید </h2>
        <p>
          برای ایجاد یا مشاهده گردش کار درخواست دفاع وارد قسمت درخواست ها شوید
        </p>
        <Button
          type="submit"
          className="btn-light"
          onClick={() => setPage(1)}
          style={{
            backgroundColor: "#003C43",
            color: "#E3FEF7",
            width: "9rem",
            marginTop: "1.5rem",
            display: "block",
            fontWeight: "700",
            marginRight: "35%",
          }}
        >
          درخواست ها
        </Button>
      </div>
    </div>
  );
};
const ProfilePage = ({ user, token }) => {
  const [avatar, setAvatar] = useState();
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `http://127.0.0.1:8000/api/user/user/${user.id}/`,
            {
              avatar: profile_default,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            // setLoading(false);
          })
          .catch((error) => {
            // Toast.fire({
            //   icon: "error",
            //   title: "مشکلی در دریافت اطلاعات پیش آمده",
            // });
          });

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };
  return (
    <>
    {user.role != 'DK' && <div className="profilePage">
      <img src={profile_default}></img>
      <hr />
      <div className="content">
        <div className="right-content">
          <p className="code">
            نام کاربری : <span>{user.username}</span>
          </p>
          <p className="code">
            تلفن همراه : <span>{user.phone}</span>
          </p>
          <p className="code">
            ایمیل : <span>{user.email}</span>
          </p>
          <p className="code">
            گروه :{" "}
            <span>
              {user.group == 1 && "برق و کامپیوتر"}
              {user.group == 2 && "صنایع"}
              {user.group == 3 && "عمران"}
              {user.group == 4 && "مکانیک"}
            </span>
          </p>
        </div>
        <div className="left-content">
          <p className="code">
            نام : <span>{user.first_name === "" ? "-" : user.first_name}</span>
          </p>
          <p className="code">
            نام خانوادگی :{" "}
            <span>{user.last_name === "" ? "-" : user.last_name}</span>
          </p>
          {user.role === 'D' && <p className="code">
            گروه :{" "}
            <span>
              {user.grade == 1 && "کارشناسی"}
              {user.grade == 2 && "دکتری"}
              {user.grade == 3 && "ارشد"}
            </span>
          </p>}
        </div>
      </div>
    </div> }
    </>
  );
};

const RequestPage = ({ user, token, Toast }) => {
  const [req, setReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [professor, setProfessor] = useState();
  const [advisor, setAdvisor] = useState()
  const [supervisor, setSupervisor] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleMultiple = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSupervisor(selectedValues);
  };
  const handleSend = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://127.0.0.1:8000/api/request/user-requests/`,
        {
          user: user.id,
          title: title,
          date: date,
          // file:file,
          active: "T",
          supervisor: supervisor,
          supervising_professor: professor,
          advisor:advisor,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((response) => {
        setReq(...response.data);
        // setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/request/user-requests/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setReq(response.data);
        console.log(response.data)
        setLoading(false);
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "مشکلی در دریافت اطلاعات پیش آمده",
        });
        setLoading(false);
      });
    axios
      .get(`http://127.0.0.1:8000/api/user/users/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "مشکلی در دریافت اطلاعات پیش آمده",
        });
        setLoading(false);
      });
  }, []);

  // console.log(supervisor);
  return (
    <div className="requestPage">
      {user.role === "D" && (
        <diV className="request-D">
          <h2>درخواست های من</h2>
          <hr />
          <div className="content-D">
            <div className="add-request">
              <Button
                className="btn-light"
                style={{
                  backgroundColor: "#003C43",
                  color: "#E3FEF7",
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  marginTop: "2rem",
                  marginRight: "0.5rem",
                  display: "inline",
                  fontWeight: "500",
                  padding: "0.5rem",
                }}
                onClick={handleShow}
              >
                <i
                  class="bi bi-file-earmark-plus-fill"
                  style={{ fontSize: "1.7rem" }}
                ></i>
              </Button>
              <p>افزودن درخواست</p>
            </div>
            {req.map((item) => (
              <UserReq item={item} id={user.id} Toast={Toast} token={token} />
            ))}
          </div>
        </diV>
      )}
      {user.role === "H" && (
        <ProfessorReq
          req={req}
          setReq={setReq}
          user={user}
          users={users}
          token={token}
        />
      )}
      {user.role === "M" && (
        <ManagerReq
          req={req}
          setReq={setReq}
          user={user}
          users={users}
          token={token}
        />
      )}
      {user.role === "DK" && (
        <Ex_arbitrator
          req={req}
          setReq={setReq}
          user={user}
          users={users}
          token={token}
        />
      )}


      <Modal show={show} onHide={handleClose} animation={true} dir="rtl">
        <Modal.Header>
          <Modal.Title>افزودن درخواست</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="عنوان پروپوزال"
              required
            />
            <Form.Group
              style={{ marginTop: "1rem", width: "30%", fontWeight: "700" }}
            >
              <Form.Label>تاریخ ثبت پروپوزال : </Form.Label>
              <Form.Control
                onChange={(e) => setDate(e.target.value)}
                type="date"
                required
              />
            </Form.Group>
            <Form.Group
              style={{ marginTop: "1rem", width: "60%", fontWeight: "700" }}
            >
              <Form.Label>فایل پروپوزال : </Form.Label>
              <Form.Control
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                required
              />
            </Form.Group>
            <Form.Select
              style={{ marginTop: "1rem" }}
              aria-label="Default select example"
              onChange={(e) => setProfessor(e.target.value)}
              required
            >
              <option>انتخاب استاد راهنما</option>
              {users.map(
                (item) =>
                  item.role === "H" && item.group === user.group && (
                    <>
                      <option value={item.id}>
                        {item.first_name} {item.last_name}
                      </option>
                    </>
                  )
              )}
            </Form.Select>
            <Form.Select
              style={{ marginTop: "1rem" }}
              aria-label="Default select example"
              onChange={(e) => setAdvisor(e.target.value)}
              required
            >
              <option>انتخاب استاد مشاور</option>
              {users.map(
                (item) =>
                  item.role === "H" && item.group === user.group && (
                    <>
                      <option value={item.id}>
                        {item.first_name} {item.last_name}
                      </option>
                    </>
                  )
              )}
            </Form.Select>
            <Form.Select
              style={{ marginTop: "1rem" }}
              aria-label="Default select example"
              multiple
              onChange={(e) => handleMultiple(e)}
              required
            >
              <option>انتخاب اساتید ناظر</option>
              {users.map(
                (item) =>
                  item.role === "H" && item.group === user.group && (
                    <>
                      <option value={item.id}>
                        {item.first_name} {item.last_name}
                      </option>
                    </>
                  )
              )}
            </Form.Select>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={(e) => handleSend(e)}
              type="submit"
            >
              ارسال
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;

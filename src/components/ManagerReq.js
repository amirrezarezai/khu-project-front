import { useState } from "react";
import Button from "react-bootstrap/Button";
import AgentReq from "./AgentReq";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Form from "react-bootstrap/Form";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ManagerReq = ({ req, user, users, token, setReq }) => {
  const [state, setState] = useState(0);

  return (
    <div className="manager-req">
      <h2>درخواست ها</h2>
      <hr />
      <div className="manager-link">
        <Button
          className="btn-light"
          style={state === 0 ? { borderBottom: "3px solid #135D66" } : {}}
          onClick={() => setState(0)}
        >
          جدید
        </Button>
        <Button
          className="btn-light"
          style={state === 1 ? { borderBottom: "3px solid #135D66" } : {}}
          onClick={() => setState(1)}
        >
          تایید شده
        </Button>
        <Button
          className="btn-light"
          style={state === 2 ? { borderBottom: "3px solid #135D66" } : {}}
          onClick={() => setState(2)}
        >
          تایید نشده
        </Button>
      </div>
      <div className="content">
        {state === 0 && (
          <div className="new-manager-req">
            {req.map(
              (item) =>
                item.active_manager === "W" &&
                item.active_supervisor === "T" && (
                  <NewManagerReq
                    item={item}
                    users={users}
                    token={token}
                    user={user}
                  />
                )
            )}
          </div>
        )}
        {state === 1 && (
          <div className="agent-content">
            {req.map(
              (item) =>
                item.active_manager === "T" &&
                item.active_supervisor === "T" && (
                  <AgentReq item={item} users={users} step={3} />
                )
            )}
          </div>
        )}
        {state === 2 && (
          <div className="agent-content">
            {req.map(
              (item) =>
                item.active_manager === "F" &&
                item.active_supervisor === "T" && (
                  <AgentReq item={item} users={users} user={user} step={3} />
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const NewManagerReq = ({ users, item, token, user }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [agent,setAgent] = useState()
  const [arbitrator,setArbitrator] = useState([])
  const [ex_arbitrator,setEXArbitrator] = useState([])

  const handleReject = (e) => {
    axios
      .patch(
        `http://127.0.0.1:8000/api/request/user-request/${item.id}/`,
        {
          active_manager: "F",
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
        console.log(error);
      });
    setOpen(false);
  };
  const handleMultiple = (e) =>{
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setArbitrator(selectedValues);
  }
  const handleMultiple2 = (e) =>{
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setEXArbitrator(selectedValues);
  }
  const handleSend = (e) =>{
    axios
    .patch(
      `http://127.0.0.1:8000/api/request/user-request/${item.id}/`,
      {
        active_manager: "T",
        add_arbitrator:arbitrator,
        external_arbitrator:ex_arbitrator,
        postgraduatere_presentative:agent,  
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data)
      // setLoading(false);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  return (
    <div className="guide-req-item">
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            تاریخ ثبت پروپوزال : {item.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            استاد راهنما :{" "}
            {users.map(
              (user) =>
                user.id === item.supervising_professor &&
                `${user.first_name} ${user.last_name}`
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            className="btn-light"
            style={{
              color: "#135D66",
              fontWeight: "550",
              borderBottom: "2px solid #135D66",
              borderRadius: "none",
              fontSize: "1rem",
            }}
            size="small"
            onClick={handleOpen}
          >
            مشاهده وضعیت
          </Button>
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        dir="rtl"
      >
        <Box sx={style}>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            عنوان : {item.title}
          </Typography>
          <hr />
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            تاریخ انتشار پروپوزال : {item.date}
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            استاد راهنما :{" "}
            {users.map(
              (user) =>
                user.id === item.supervising_professor &&
                `${user.first_name} ${user.last_name}`
            )}
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            استاد مشاور :{" "}
            {users.map(
              (user) =>
                user.id === item.advisor &&
                `${user.first_name} ${user.last_name}`
            )}
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            اساتید ناظر :{" "}
            {users.map((user) =>
              item.supervisor.map(
                (i) =>
                  user.id === i && ` ${user.first_name} ${user.last_name} /`
              )
            )}
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            {item.file && (
                  <i
                    class="bi bi-filetype-pdf"
                    style={{ color: "red", fontSize: "2rem" }}
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        marginRight: "1rem",
                        cursor: "pointer",
                        color: "#135d66",
                        fontWeight: "800",
                      }}
                    >
                      <a style={{color:'black',textDecoration:'none'}} href={`http://127.0.0.1:8000/${item.file}`}>دریافت فایل</a>
                    </span>
                  </i>
                )}
          </Typography>
          <hr />
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            <Form>
            <Form.Select
                style={{ marginTop: "1rem" }}
                aria-label="Default select example"
                required
                multiple
                onChange={(e)=>handleMultiple(e)}
              >
                <option>افزودن داور </option>
                {users.map(
                  (item) =>
                    item.role === "H" && (
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
                required
                multiple
                onChange={(e)=>handleMultiple2(e)}
              >
                <option>افزودن داور خارجی </option>
                {users.map(
                  (item) =>
                    item.role === "DK" && (
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
                required
                onChange={(e)=>setAgent(e.target.value)}
              >
                <option>انتخاب نماینده تحصیلات تکمیلی</option>
                {users.map(
                  (item) =>
                    item.role === "H" && (
                      <>
                        <option value={item.id}>
                          {item.first_name} {item.last_name}
                        </option>
                      </>
                    )
                )}
              </Form.Select>
              <Button
                style={{ marginLeft: "0.5rem", fontWeight: "700",marginTop:'1rem' }}
                onClick={(e) => handleSend(e)}
                variant="primary"
                type="submit"
              >
                تایید و ارسال
              </Button>
              <Button
                style={{ fontWeight: "700",marginTop:'1rem' }}
                onClick={(e) => handleReject(e)}
                variant="danger"
              >
                عدم تایید
              </Button>
            </Form>
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          ></Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default ManagerReq;

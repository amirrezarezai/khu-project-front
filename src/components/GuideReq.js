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
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "60%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const GuideReq = ({ req, users, user,token }) => {
  const [state, setState] = useState(0);
  

  return (
    <div className="guide-req">
      <hr />
      <div className="guide-btn">
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
      {state === 0 && (
        <div className="guide-new-req">
          {req.map(
            (item) =>
              item.supervising_professor === user.id &&
              item.active_supervisor === "W" && (
                <NewSupervisorReq item={item} users={users} token={token} />
              )
          )}
        </div>
      )}
      {state === 1 && (
        <div className="agent-content">
          {req.map(
            (item) =>
              item.supervising_professor === user.id &&
              item.active_supervisor === "T" && (
                <AgentReq item={item} users={users} step={2} />
              )
          )}
        </div>
      )}
      {state === 2 && (
        <div className="agent-content">
          {req.map(
            (item) =>
              item.supervising_professor === user.id &&
              item.active_supervisor === "F" && (
                <AgentReq item={item} users={users} step={2} />
              )
          )}
        </div>
      )}
    </div>
  );
};

const NewSupervisorReq = ({ item, users,token }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [text,setText] = useState('')
  const [textarea,setTextarea] = useState('')

  const handleSend = (e) => {
    axios
    .patch(
      `http://127.0.0.1:8000/api/request/user-request/${item.id}/`,
      {
        arbitrator : text,
        addTimeSupervisor:textarea,
        active_supervisor:'T',
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
    setOpen(false)
  }
  const handleReject = (e) => {
    axios
    .patch(
      `http://127.0.0.1:8000/api/request/user-request/${item.id}/`,
      {
        active_supervisor:'F',
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
    setOpen(false)
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
            <Form.Label>
          داور پیشنهادی (در صورت خارجی بودن نام دانشگاه ذکر شود){" "}:
            </Form.Label>
            <Form.Control onChange={(e)=>setText(e.target.value)} type="text" required />
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            <Form.Label>
           زمان پیشنهادی دفاع(حداقل پنج زمان به همراه روز و ساعت اضافه شود){" "}:
            </Form.Label>
            <Form.Control onChange={(e)=>setTextarea(e.target.value)} as="textarea" required />
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            <Button style={{marginLeft:'0.5rem',fontWeight: "700"}} onClick={(e)=>handleSend(e)} variant="primary" type="submit">
              تایید و ارسال
            </Button>
            <Button style={{fontWeight: "700"}} onClick={(e)=>handleReject(e)} variant="danger" type="submit">
              عدم تایید
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default GuideReq;

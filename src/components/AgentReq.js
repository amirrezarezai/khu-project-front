import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";

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

const Agent = ({ item, users, user, step }) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [timeArbitrator, setTimeArbitrator] = useState("");
  const [timePresentative, setTimePresentative] = useState("");

  const handleTimeArbitrator = (e) => {
    window.location.reload();
    axios
    .patch(
      `http://127.0.0.1:8000/api/request/user-request/${item.id}/`,
      {
        confirmTimeArbitrator:timeArbitrator 
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
      setOpen(false)
    })
    .catch((error) => {
      console.log(error);
      setOpen(false)
    });
  }

  const handleTimePresentative = () => {
    window.location.reload();
    axios
    .patch(
      `http://127.0.0.1:8000/api/request/user-request/${item.id}/`,
      {
        confirmTimePresentative:timePresentative
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
      setOpen(false)
    })
    .catch((error) => {
      console.log(error);
      setOpen(false)
    });
  }
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            تاریخ انتشار : {item.date}
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
        style={{ overflowY: "scroll", }}
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
            تاریخ ثبت پروپوزال : {item.date}
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
            استاد مشاور:{" "}
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
            داوران پیشنهادی اسناد راهنما : {item.arbitrator}
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            زمان های انتخابی استاد راهنما: {item.addTimeSupervisor}
          </Typography>
          <Typography
            style={{ fontWeight: "700" }}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            تایید اولیه استاد راهنما :
            {item.active_supervisor === "T" && <span>`&#x2705;`</span>}
            {item.active_supervisor === "W" && " در انتظار تایید استاد "}
            {item.active_supervisor === "F" && <span>`&#10060;`</span>}
          </Typography>
          <hr />
          {item.active_supervisor === "T" && (
            <>
              <Typography
                style={{ fontWeight: "700" }}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                داوران دفاع :
                {users.map((user) =>
                  item.add_arbitrator.map(
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
                نماینده تحصیلات تکمیلی :
                {users.map(
                  (user) =>
                    user.id === item.postgraduatere_presentative &&
                    ` ${user.first_name} ${user.last_name}`
                )}
              </Typography>
              <Typography
                style={{ fontWeight: "700" }}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                تایید مدیر گروه :
                {item.active_manager === "T" && <span>`&#x2705;`</span>}
                {item.active_manager === "W" && " در انتظار تایید مدیرگروه "}
                {item.active_manager === "F" && <span>`&#10060;`</span>}
              </Typography>
              <hr />
            </>
          )}
          {item.active_manager === "T" && (
            <>
              {item.confirmTimeArbitrator && (
                <Typography
                  style={{ fontWeight: "700" }}
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                >
                  زمان های تایید شده توسط داور :
                  {item.confirmTimeArbitrator}
                </Typography>
              )}
              {item.confirmTimePresentative && (
                <Typography
                  style={{ fontWeight: "700" }}
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                >
                  زمان های تایید شده توسط نماینده تحصیلات تکمیلی :
                  {item.confirmTimePresentative}
                </Typography>
              )}
              {!item.confirmTimeArbitrator &&
                step === 1 &&
                item.add_arbitrator.map((i) => i === user.id) && (
                  <>
                    <Typography
                      style={{ fontWeight: "700" }}
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                    >
                      <Form.Label>
                        زمان مورد تایید (حداقل دو زمان اضافه کنید) :
                      </Form.Label>
                      <Form.Control
                        onChange={(e) => setTimeArbitrator(e.target.value)}
                        type="text"
                        required
                      />
                    </Typography>
                    <Typography
                      style={{ fontWeight: "700" }}
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                    >
                      <Button
                        style={{ marginLeft: "0.5rem", fontWeight: "700" }}
                        onClick={(e) => handleTimeArbitrator(e)}
                        variant="primary"
                        type="submit"
                      >
                        تایید و ارسال
                      </Button>
                    </Typography>
                  </>
                )}
              {!item.confirmTimePresentative &&
                step === 0 &&
                item.postgraduatere_presentative === user.id && (
                  <>
                  <Typography
                    style={{ fontWeight: "700" }}
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                  >
                    <Form.Label>
                      زمان مورد تایید (حداقل دو زمان اضافه کنید) :
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setTimePresentative(e.target.value)}
                      type="text"
                      required
                    />
                  </Typography>
                  <Typography
                      style={{ fontWeight: "700" }}
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                    >
                      <Button
                        style={{ marginLeft: "0.5rem", fontWeight: "700" }}
                        onClick={(e) => handleTimePresentative(e)}
                        variant="primary"
                        type="submit"
                      >
                        تایید و ارسال
                      </Button>
                    </Typography>
                  </>
                )}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};
export default Agent;

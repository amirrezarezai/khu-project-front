import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";

const UserReq = ({ item, id, Toast, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [req, setReq] = useState(item);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    border: "5px solid #135D66",
    boxShadow: 24,
    p: 4,
    color: "#135D66",
    backgroundColor: "#fff",
  };
  useEffect(() => {
    setLoading(true);
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

  const handleDelete = (e, id) => {
    Swal.fire({
      title: "آیا از حذف درخواست اطمینان دارید ؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بلی",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/request/user-request/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((response) => {
            setReq(response.data);
            setLoading(false);
          })
          .catch((error) => {
            Toast.fire({
              icon: "error",
              title: "مشکلی در دریافت اطلاعات پیش آمده",
            });
            setLoading(false);
          });

        Swal.fire({
          title: "درخواست شما با موفقیت حذف شد",
          icon: "success",
        });
      }
    });
  };
  return (
    <div className="user-requests">
      {req.user === id && (
        <div className="request">
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {req.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                تاریخ انتشار : {req.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                استاد راهنما :{" "}
                {users.map(
                  (user) =>
                    user.id === req.supervising_professor &&
                    `${user.first_name} ${user.last_name}`
                )}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                style={{
                  color: "#135D66",
                  fontWeight: "550",
                  borderBottom: "2px solid #135D66",
                  borderRadius: "none",
                }}
                size="small"
                onClick={handleOpen}
              >
                مشاهده وضعیت
              </Button>
              <Button
                style={{
                  color: "red",
                  fontWeight: "550",
                  borderBottom: "2px solid red",
                  marginRight: "0.2rem",
                }}
                size="small"
                onClick={(e) => handleDelete(e, req.id)}
              >
                حذف
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
                style={{ fontWeight: "700",marginTop:'4rem' }}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              >
                عنوان : {req.title}
              </Typography>
              <hr />
              <Typography
                style={{ fontWeight: "700" }}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                تاریخ ثبت پروپوزال : {req.date}
              </Typography>
              <Typography
                style={{ fontWeight: "700" }}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                استاد راهنما :{" "}
                {users.map(
                  (user) =>
                    user.id === req.supervising_professor &&
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
                    user.id === req.advisor &&
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
                  req.supervisor.map(
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
                {req.file && (
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
                      <a
                        style={{ color: "#135d66", textDecoration: "none" }}
                        href={`http://127.0.0.1:8000/${req.file}`}
                      >
                        دریافت فایل
                      </a>
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
                داوران پیشنهادی استاد راهنما : {req.arbitrator}
              </Typography>
              <Typography
                style={{ fontWeight: "700" }}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                زمان های پیشنهادی استاد راهنما : {req.addTimeSupervisor}
              </Typography>
              <Typography
                style={{ fontWeight: "700" }}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                تایید استاد:
                {req.active_supervisor === "T" && <span>`&#x2705;`</span>}
                {req.active_supervisor === "W" && " در انتظار تایید استاد "}
                {req.active_supervisor === "F" && <span>`&#10060;`</span>}
              </Typography>
              <hr />
              {req.active_supervisor === "T" && (
                <>
                  <Typography
                    style={{ fontWeight: "700" }}
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                  >
                    داوران دفاع :
                    {users.map((user) =>
                      req.add_arbitrator.map(
                        (i) =>
                          user.id === i &&
                          ` ${user.first_name} ${user.last_name} /`
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
                        user.id === req.postgraduatere_presentative &&
                        ` ${user.first_name} ${user.last_name}`
                    )}
                  </Typography>
                  <Typography
                    style={{ fontWeight: "700" }}
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                  >
                    تایید مدیر گروه :
                    {req.active_manager === "T" && <span>`&#x2705;`</span>}
                    {req.active_manager === "W" && " در انتظار تایید مدیرگروه "}
                    {req.active_manager === "F" && <span>`&#10060;`</span>}
                  </Typography>
                  <hr />
                </>
              )}
              {req.active_manager === "T" && (
                <>
                  {req.confirmTimeArbitrator && (
                    <Typography
                      style={{ fontWeight: "700" }}
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                    >
                      زمان های تایید شده توسط داور :{req.confirmTimeArbitrator}
                    </Typography>
                  )}
                  {req.confirmTimePresentative && (
                    <Typography
                      style={{ fontWeight: "700" }}
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                    >
                      زمان های تایید شده توسط نماینده تحصیلات تکمیلی :
                      {req.confirmTimePresentative}
                    </Typography>
                  )}
                  {req.confirmTimeArbitrator &&
                    req.confirmTimePresentative && (
                      <>
                        <hr />
                        <Typography
                          style={{ fontWeight: "700" }}
                          id="modal-modal-description"
                          sx={{ mt: 2 }}
                        >
                          زمان نهایی دفاع : {""}
                          {req.final_time
                            ? req.final_time
                            : "در انتظار تایید استاد راهنما"}
                        </Typography>
                      </>
                    )}
                </>
              )}
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};
export default UserReq;

import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import khu_image from "../images/100.png";
import axios from "axios";
import Swal from "sweetalert2";
import Dashboard from "../pages/Dashboard";
import InputGroup from "react-bootstrap/InputGroup";

const Home = () => {
  const [step, setStep] = useState(0);

  const changeStep = (step) => {
    if (step === 0) {
      setStep(1);
    } else {
      setStep(0);
    }
  };
  return (
    <div className="home">
      <div></div>
      {step === 0 ? (
        <Login step={step} changeStep={changeStep} />
      ) : (
        <Register step={step} setStep={setStep} changeStep={changeStep} />
      )}
      <div></div>
    </div>
  );
};
const Login = ({ step, changeStep }) => {
  const [check, setCheck] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
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
  const handleLogin = (e) => {
    e.preventDefault();
    if (username !== null && password !== null) {
      axios
        .post("http://127.0.0.1:8000/api/user/api-token-auth/", {
          username: username,
          password: password,
        })
        .then(function (response) {
          setData(response.data);
          if (response.data.is_validate === "T") {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user_id", response.data.user_id);
            localStorage.setItem("is_validate", response.data.is_validate);
            navigate("/dashboard");
          } else if (response.data.is_validate === "W") {
            Toast.fire({
              icon: "error",
              title: "حساب شما در انتظار تایید می باشد ",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "حساب شما تایید نشده است",
            });
          }
        })
        .catch(function (error) {
          setErr(error.message);
          if (error.response.status === 400) {
            Toast.fire({
              icon: "error",
              title: "این حساب کاربری موجود نمی باشد",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: error.message,
            });
          }
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "!لطفا فیلد ها را به درستی کامل کنید ",
      });
    }
  };
  const handleChecked = (e) => {
    setCheck(e.target.checked);
  };
  return (
    <>
      {/* {login === 0 && ( */}
      <div className="login">
        <div className="change-box">
          <img src={khu_image} alt="khu-image" />
          <h5>
            اگر دانشجو هستید و هنوز حساب کاربری ندارید ابتدا ثبت نام کنید{" "}
          </h5>
          <Button
            type="submit"
            className="btn-light"
            onClick={() => changeStep(step)}
            style={{
              backgroundColor: "rgb(227, 254, 247)",
              color: "rgb(0, 60, 67)",
              width: "8rem",
              marginTop: "1.5rem",
              display: "block",
              margin: "10% 22%",
            }}
          >
            ثبت نام
          </Button>
        </div>
        <div className="login-box">
          <h1>سامانه دفاع دانشجویی</h1>
          <Form>
            <Form.Group className="mb-3 mt-4">
              <Form.Label>نام کاربری</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Label>رمز ورود</Form.Label>
            <Form.Control
              type={check ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Check
              type="checkbox"
              label="نمایش رمز ورود"
              style={{ marginTop: "1rem" }}
              onClick={(e) => handleChecked(e)}
            />
            <Button
              type="submit"
              className="btn-light"
              onClick={(e) => handleLogin(e)}
              style={{
                backgroundColor: "#003C43",
                color: "#E3FEF7",
                width: "8rem",
                marginTop: "1.5rem",
                display: "block",
              }}
            >
              ورود
            </Button>
            <p style={{ marginTop: "1.5rem" }}>
              رمز عبور خود را فراموش کرده اید ؟
              <Link to="/" style={{ color: "#135D66" }}>
                کلیک کنید
              </Link>
            </p>
          </Form>
        </div>
      </div>
      {/* ) */}
      {/* {login === 1 && <Dashboard data={data} />} */}
    </>
  );
};
const Register = ({ step, changeStep }) => {
  const [check, setCheck] = useState(false);
  const [data, setData] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [first_name, setFirst_name] = useState(null);
  const [last_name, setLast_name] = useState(null);
  const [grade, setGrade] = useState(null);
  const [group, setGroup] = useState(null);
  const [password, setPassword] = useState(null);
  const [password2, setPassword2] = useState(null);
  const [phone, setPhone] = useState(null);
  const [err, setErr] = useState(null);
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
  const handleChecked = (e) => {
    setCheck(e.target.checked);
  };
  const handleRegister = (e) => {
    e.preventDefault();
    if (
      username !== null &&
      password !== null &&
      email !== null &&
      password2 !== null &&
      phone !== null
    ) {
      axios
        .post("http://127.0.0.1:8000/api/user/register/", {
          username: username,
          email: email,
          phone: phone,
          grade: grade,
          group: group,
          first_name: first_name,
          last_name: last_name,
          password: password,
          password2: password2,
        })
        .then(function (response) {
          if (response.data.response === "Registration Successfully") {
            Toast.fire({
              icon: "success",
              title: "حساب شما با موفقیت ساخته شد",
            });
          } else {
            Toast.fire({
              icon: "error",
              title:
                response.data.username ||
                response.data.email ||
                response.data.password ||
                response.data.password2,
            });
          }
        })
        .catch(function (error) {
          setErr(error.message);
          Toast.fire({
            icon: "error",
            title: error.message,
          });
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "!لطفا فیلد همه ها را به درستی کامل کنید ",
      });
    }
  };
  return (
    <div className="register">
      <div className="register-box">
        <Form>
          <InputGroup className="mt-3">
            <Form.Label>شماره دانشجویی : </Form.Label>
            <Form.Control
              type="text"
              required
              size="sm"
              style={{ marginRight: "0.5rem" }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mt-3">
            <Form.Label>ایمیل :</Form.Label>
            <Form.Control
              type="email"
              required
              size="sm"
              style={{ marginRight: "0.5rem" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mt-3">
            <Form.Label>نام:</Form.Label>
            <Form.Control
              type="text"
              required
              size="sm"
              style={{ marginRight: "0.5rem" }}
              onChange={(e) => setFirst_name(e.target.value)}
            />
            <Form.Label style={{ marginRight: "0.5rem" }}>
              {" "}
              نام خانوادگی:
            </Form.Label>
            <Form.Control
              type="text"
              required
              size="sm"
              style={{ marginRight: "0.5rem" }}
              onChange={(e) => setLast_name(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mt-3">
            <Form.Label>شماره همراه :</Form.Label>
            <Form.Control
              type="text"
              required
              size="sm"
              style={{ marginRight: "0.5rem" }}
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mt-3">
            <Form.Select aria-label="Default select example" style={{fontWeight:'700'}} required onChange={(e) => setGroup(e.target.value)}>
              <option>گروه</option>
              <option value="1"> 1- برق و کامپیوتر</option>
              <option value="2">2- صنایع</option>
              <option value="3">3- عمران</option>
              <option value="4">4- مکانیک</option>
            </Form.Select>
            <Form.Select aria-label="Default select example" style={{ marginRight: "0.5rem",fontWeight:'700' }} onChange={(e) => setGrade(e.target.value)}>
              <option>مقطع </option>
              <option value="1">1- کارشناسی</option>
              <option value="2">2- دکتری</option>
              <option value="3">3- ارشد</option>
            </Form.Select>
          </InputGroup>
          <InputGroup className="mt-3">
            <Form.Label>رمز ورود :</Form.Label>
            <Form.Control
              type={check ? "text" : "password"}
              required
              size="sm"
              style={{ marginRight: "0.5rem" }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mt-3">
            <Form.Label>تکرار رمز ورود :</Form.Label>
            <Form.Control
              type={check ? "text" : "password"}
              required
              size="sm"
              style={{ marginRight: "0.5rem" }}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </InputGroup>
          <Form.Check
            type="checkbox"
            label="نمایش رمز ورود"
            style={{ marginTop: "1rem" }}
            onClick={(e) => handleChecked(e)}
          />
          <Button
            type="submit"
            className="btn-light"
            style={{
              backgroundColor: "#003C43",
              color: "#E3FEF7",
              width: "8rem",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
            onClick={(e) => handleRegister(e)}
          >
            ثبت نام
          </Button>
        </Form>
      </div>
      <div className="change-box">
        <h2>سامانه دفاع دانشجویی</h2>
        <img src={khu_image} alt="khu-image" />
        <h5> اگر حساب کاربری دارید از اینجا وارد شوید</h5>
        <Button
          type="submit"
          className="btn-light"
          onClick={() => changeStep(step)}
          style={{
            backgroundColor: "rgb(227, 254, 247)",
            color: "rgb(0, 60, 67)",
            width: "8rem",
            marginTop: "1.5rem",
            display: "block",
            margin: "10% 22%",
          }}
        >
          ورود
        </Button>
      </div>
    </div>
  );
};
export default Home;

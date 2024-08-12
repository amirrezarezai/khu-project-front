import { useState } from "react";
import Button from "react-bootstrap/Button";
import AgentReq from "./AgentReq";
import GuideReq from "./GuideReq";

const ProfessorReq = ({ user, req, users,token }) => {
  const [state, setState] = useState(0);
  return (
    <>
      <div className="sup-req">
        <h2>درخواست ها </h2>
        <hr />
        <div className="sup-req-link">
          <Button
            className="btn-light"
            style={state === 0 ? { borderBottom: "3px solid #135D66" } : {}}
            onClick={() => setState(0)}
          >
            استاد راهنما
          </Button>
          <Button
            className="btn-light"
            style={state === 2 ? { borderBottom: "3px solid #135D66" } : {}}
            onClick={() => setState(2)}
          >
            نماینده تحصیلات تکمیلی
          </Button>
          <Button
            className="btn-light"
            style={state === 3 ? { borderBottom: "3px solid #135D66" } : {}}
            onClick={() => setState(3)}
          >
            داور 
          </Button>
        </div>
        <div className="content">
          {state === 0 && <Guide user={user} req={req} users={users}  />}
          {state === 2 && <Agent user={user} req={req} users={users} />}
          {state === 3 && <Arbitrator user={user} req={req} users={users}  />}
        </div>
      </div>
    </>
  );
};
const Guide = ({req,user,users,token}) => {

  return (
    <><GuideReq req={req} user={user} users={users} token={token} /></>
  );
};
const Agent = ({ user, req, users }) => {
  return (
    <div className="agent-content">
      {req.map(
        (item) =>
          item.postgraduatere_presentative === user.id && (
            <AgentReq item={item} users={users} user={user} step={0}/>
          )
      )}
    </div>
  );
};
const Arbitrator = ({ user, req, users }) => {
  return (
    <div className="agent-content">
      {req.map((item) =>
        item.add_arbitrator.map((i) => user.id === i && <AgentReq item={item} users={users} user={user} step={1} />)
      )}
    </div>
  );
};
export default ProfessorReq;

import AgentReq from "./AgentReq";

const Ex_arbitrator = ({ user, req, users }) => {
  return (
    <div className="ex-arbitrator">
        <h2>درخواست ها</h2>
      <div className="agent-content">
        {req.map((item) =>
          item.external_arbitrator.map(
            (i) =>
              user.id === i && (
                <AgentReq item={item} users={users} user={user} step={1} />
              )
          )
        )}
      </div>
    </div>
  );
};
export default Ex_arbitrator;

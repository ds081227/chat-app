import ChatList from "./chatList/ChatList";
import "./list.css";
import UserInfo from "./userInfo/UserInfo";

export default function List() {
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
}

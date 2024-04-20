import { Avatar, List } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message,Menu,Modal } from 'antd';
import { Route, useNavigate,Link } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode';
import Adminl from './adminl';
import Studentl from './studentl';
import Teacherl from './teacherl';
import Coursel from './coursel'
import './adminl.css';



function Admin() {
  const [current,setCurrent]=useState('admin')
  const [username, setUsername] = useState('');
  
  const token = localStorage.getItem('token');


  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
    }
}, []);
  
  const add=()=>{
    navigate('/add')
  }

  const addcourse=()=>{
    navigate('/Addcourse')
  }

  const Logout=()=>{
    localStorage.removeItem('token');
    navigate('/');

  }

  return (
    <div className="adminall">
      <h1>Hello,{username}</h1>
      <Button className="admin-button add-user" onClick={()=>{add()}}>Add New User</Button>
      <Button className="admin-button add-course" onClick={()=>{addcourse()}}>Add New Course</Button>
      <Button className="admin-button logout" onClick={()=>{Logout()}}>LogOut </Button>
      <Menu onClick={(e) => setCurrent(e.key)} selectedKeys={[current]} mode="horizontal" >
      <Menu.Item key="admin">Admin</Menu.Item>
      <Menu.Item key="teacher">Teacher</Menu.Item>
      <Menu.Item key="student">Student</Menu.Item>
      <Menu.Item key="course">course</Menu.Item>
                
        </Menu>

        <div className="content">
                {current === 'admin' && <Adminl />}
                {current === 'student' && <Studentl />}
                {current === 'teacher' && <Teacherl />}
                {current === 'course' && <Coursel />}
             
                {/* 根据需要添加更多条件渲染的组件 */}
            </div>
    </div>
  );
}

export default Admin;
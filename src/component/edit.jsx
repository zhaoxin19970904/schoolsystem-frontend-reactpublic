import { Avatar, List } from 'antd';
import {useState, useEffect,useCallback} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space, InputNumber, Table} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode'
import './adminl.css';

function Edit() {
    const [payi,setPay]=useState(false);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [rvalue, setRValue] = useState(1);
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    let {id}= useParams();
    const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
    const [columns,setColums] = useState([
      
      {
        title: 'Full Name',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
      },
      {
        title: 'Des',
        width: 100,
        dataIndex: 'des',
        key: 'des',
        fixed: 'left',
      },
      {
          title: 'Start',
          width: 100,
          dataIndex: 'start',
          key: 'start',
          fixed: 'left',
        },
        {
          title: 'End',
          width: 100,
          dataIndex: 'end',
          key: 'end',
          fixed: 'left',
        },
        {
          title: 'Credit',
          width: 100,
          dataIndex: 'credit',
          key: 'credit',
          fixed: 'left',
        },
        {
          title: 'Remove',
          key: 'operation',

          width: 100,
          render: (text, record) => <Button style={{color:'white',background:'red'}} onClick={() => remove(record.id)}>Remove</Button>
        },
      ])
      const pay = async (cid) => {
        try {
          const response = await fetch(`http://localhost:3001/courses/personpay/${id}/${cid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
      
          if (!response.ok) {
            const errorData = await response.text(); 
            console.error('Server Error:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const responseData = await response.json();
          console.log('Success:', responseData);
      
        } catch (error) {
          console.error('Failed:', error);
        }
      };
    const genderChange = (e) => {
        console.log('radio checked', e.target.value);
        setRValue(e.target.value);
      };
      const remove=useCallback(async(cid)=>{
        console.log(cid)
        console.log(id)
      try {
        const response = await fetch(`http://localhost:3001/courses/personremove/${id}/${cid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updateCourses = courses.filter(course => course.id !== cid);
      setCourses(updateCourses);
        const responseData = await response.json();
        console.log('Success:', responseData);
      } catch (error) {
        console.error('Failed:', error);
      }
    },[])
  const onFinish = async (values) => {
    try {
        const response = await fetch(`http://localhost:3001/users/update/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const responseData = await response.json();
        console.log('Success:', responseData);
        if(userRole==='admin'){navigate(`/admin`)}
        else {navigate(`/edit/${id}`)}
      } catch (error) {
        console.error('Failed:', error);
      }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const back=()=>{
    navigate(-1)
  }
  const show=(id)=>{
    navigate(`/course/students/${id}`)
  }

  const addcourse=()=>{
    navigate(`/personcourse/${id}`)
  }

  useEffect(() => {
    fetch(`http://localhost:3001/users/students/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
      setStudentData({ ...data, birth: data.birth ? moment(data.birth) : null });
      if (data.type==='student') {
        setColums(columns.concat([
          {title: 'id',
          width: 100,
          dataIndex: 'id',
          key: 'id',},
          {
            title: 'Paid',
            width: 100,
            dataIndex: 'pay',
            key: 'pay',

          },
          {
            title: 'Pay',
            key: 'operation',
            width: 100,
            render: (text, record) => <Button style={{color:'white',background:'green'}} onClick={() => pay(record.id)}>Pay</Button>
          }
        ]))
        
      }
      if(data.type==='teacher'){
        setColums(columns.concat([
          {
            title: 'Show Student',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => <Button style={{color:'black',background:'yellow'}} onClick={() => show(record.id)}>Show</Button>
          }
        ]))
      }

    })
    .catch(error => {
      console.error('Error:', error);
      setError(error);
    });
  }, [id, token]);

  useEffect(() => {
    fetch(`http://localhost:3001/courses/personcourse/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        const transformedData = data.map(item => {
          let payStatus = "false"; // 默认支付状态为 false
          if (item.role === "student") {
            // 假设学生的支付状态在 item.paid 字段
            payStatus = item.paid ? "true" : "false";
          }
          // 不需要特别处理教师，因为教师没有支付状态
          return {
            id: item.id, // 假设所有课程对象都有 id 字段
            name: item.name,
            des: item.des,
            start: new Date(item.start).toLocaleDateString(),
            end: new Date(item.end).toLocaleDateString(),
            pay: payStatus,
            credit: item.credit
          };
        });
        setCourses(transformedData);
      } else {
        console.log('no data');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error);
    });
  }, [id, token, remove]);

 


  
  return (
    <div className="admin-container">
      <div className="leftBackground"></div>
      <div className="rightBackground"></div>
      {!studentData || error ? <div>Loading...</div>:
      <div>{studentData.type==='admin'?<h1>Edit {studentData.username} </h1>:<h1>Hello {studentData.username},Accoumt Type:{studentData.type} </h1>}
      <div className="search-area">
      <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={studentData}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Personal Info"
      name="title"
      style={{fontSize:20}}
    >
    </Form.Item>
    <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Gender"
      name="gender"
      rules={[
        {
          required: true,
          message: 'Please input your gender!',
        },
      ]}
    >
      <Radio.Group onChange={genderChange}  >
      <Radio value='male'>Male</Radio>
    <Radio value='female'>Female</Radio>
    <Radio value='other'>Other</Radio>
    </Radio.Group>
    </Form.Item>

    <Form.Item
      label="Birth"
      name="birth"
      rules={[
        {
          required: true,
          message: 'Please input your birth!',
        },
      ]}
    >
    <DatePicker format="YYYY-MM-DD" />

    </Form.Item>


    <Form.Item
      label='age'
      name="age"
      rules={[
        {
          required: true,
          message: 'Please input your age!',
        },
        {
          type: 'number',
          message: 'Age must be a number!',
          transform: value => Number(value),
        },
        {
          validator: (_, value) =>
            Number.isInteger(value)
              ? Promise.resolve()
              : Promise.reject(new Error('Age must be an integer')),
        },
      ]}

    >
    <InputNumber />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Update
      </Button>
    </Form.Item>
  </Form>
  </div>
  <Button onClick={()=>{back()}}>
        Back
      </Button>
      {studentData.type==='admin'?null:<div>
      {<div><h3>Course list  </h3></div>}
      <Table className="admin-table"
    columns={columns}
    dataSource={courses}
    scroll={{
      x: 1400,
      y: 1600,
    }}/>
  
     <Button style={{color:'white',background:'green'}} onClick={()=>{addcourse()}}>
        Add Course
      </Button>
      </div>}
      </div>}
    </div>
    

  );
}

export default Edit;
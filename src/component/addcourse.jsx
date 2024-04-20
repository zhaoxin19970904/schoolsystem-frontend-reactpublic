import { Avatar, InputNumber, List } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space} from 'antd';
import { useNavigate } from 'react-router-dom'
const { RangePicker } = DatePicker;


function Addcourse() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

  const [error, setError] = useState(null);
  const onFinish = async (values) => {
    try {
        const courseData = {
            name: values.name,
            des: values.des,
            credit: values.credit,
            start: values.range[0].format('YYYY-MM-DD'),
            end: values.range[1].format('YYYY-MM-DD')
          };
      
          
          if (values.range) {
            courseData.start = values.range[0].format('YYYY-MM-DD'); 
            courseData.end = values.range[1].format('YYYY-MM-DD'); 
          }
      
        const response = await fetch('http://localhost:3001/courses/course', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(courseData),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const responseData = await response.json();
        console.log('Success:', responseData);
        navigate(`/admin`)
      } catch (error) {
        console.error('Failed:', error);
      }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const back=()=>{
    navigate('/admin')
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="admin">
      <h1>Add new Course</h1>
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
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[
        {
          required: true,
          message: 'Please input your name!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Description"
      name="des"
      rules={[
        {
          required: true,
          message: 'Please input your description!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Time Range"
      name="range"
      rules={[
        {
          required: true,
          message: 'Please input your start!',
        },
      ]}
      
    >
      <RangePicker />
    </Form.Item>

    <Form.Item
      label='Credit'
      name="credit"
      rules={[
        {
          required: true,
          message: 'Please input your credit!',
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
        Add
      </Button>
    </Form.Item>
  </Form>
  <Button onClick={()=>{back()}}>
        Back
      </Button>
    </div>
  );
}

export default Addcourse;
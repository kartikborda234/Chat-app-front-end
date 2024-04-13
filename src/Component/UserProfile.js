import React, { useEffect, useState }  from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const UserProfile=({userProfileShow,handleUserProfileClose,user,socket}) => {
    const [currentUser,setCurrentUser]=useState({name: '', username: '', email: ''});

    const handleGroup=()=>{
        // setShowInput(true);
    }

    useEffect(()=>{
        socket.emit("getUserById",user?._id);

        socket.on('sendUser', (data) => {
            if (data) {
                setCurrentUser(data)
            }
        });
    },[])

    const handleChange=(e)=>{
       const {name,value} = e.target;
       setCurrentUser({...currentUser,[name]:value}); 
    }

    const handleEditGroup= async ()=>{
        socket.emit("editUser",{currentUser});
        socket.on("userUpdated",(data)=>{
            if (data?.success) {
                handleUserProfileClose();
            }
        })
        toast.success('Profile updated Successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
    }

    return(
        <>
         <Modal show={userProfileShow} onHide={handleUserProfileClose}>
              <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}} controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                // placeholder="Enter your Name"
                                name="name"
                                value={currentUser?.name}
                                onChange={handleChange}
                                autoFocus
                            /> 
                        </Form.Group>
                        <Form.Group style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>UserName</Form.Label>
                            <Form.Control
                                type="text"
                                // placeholder="Enter your Name"
                                name="username"
                                value={currentUser?.username}
                                onChange={handleChange}
                                autoFocus
                            /> 
                        </Form.Group >
                        <Form.Group style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                // placeholder="Enter your Name"
                                name="email"
                                value={currentUser?.email}
                                onChange={handleChange}
                                autoFocus
                            /> 
                        </Form.Group >
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUserProfileClose}>
                        Close
                    </Button>
                    <Button variant="info" onClick={handleEditGroup}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default UserProfile;
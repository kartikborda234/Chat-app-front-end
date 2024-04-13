import React  from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
const UserInfo=({showUserInfo,handleUserInfoClose,selectedItem})=>{

    return(
        <>
         <Modal show={showUserInfo} onHide={handleUserInfoClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Name: {selectedItem.name}</Form.Label>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Email:</Form.Label>
                            {selectedItem.email}
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label></Form.Label>
                            <div>
                                {/* <ul>
                                    {
                                        members?.length > 0 && members.filter(ele=>ele?._id !== user?._id).map((item, index) => (
                                            <li key={index}>
                                                <span>{item.name}</span>
                                                <span style={{marginLeft:"10px"}}><input type="checkBox" value={item.name} onChange={handleMembers}/></span>
                                            </li>
                                        ))
                                    }
                                </ul> */}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUserInfoClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default UserInfo;
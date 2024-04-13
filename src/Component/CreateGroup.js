import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useState} from "react";
import "./Chat.css"
import {fetchApi} from "../utils/api";
import {config} from "../APIHelper/apiUrl";

const CreateGroup = ({user, Show, handleClose,socket,members,getAllGroups}) => {
    const [group, setGroup] = useState({createdBy: user?.name, name: "", members: []})

    const handleChange = (e) => {
        let {name, value} = e.target;
        setGroup({...group, [name]: value});
    }
    const handleMembers = (e) => {
        if (e.target.checked) {
            group.members.push(e.target.value);
            setGroup({...group});
        } else {
            let i = group.members.indexOf(e.target.value);
            group.members.splice(i, 1);
            setGroup({...group});
        }
    }

    const handleSubmit =  async() => {
        await fetchApi(`${config.ApiUrl}/createGroup`, {
            method: "POST",
            body:JSON.stringify(group)
        })
        // socket.emit("createGroup",{group})
        handleClose();
        getAllGroups();
        setGroup({name:'',members:[]});
    }
    return (
        <React.Fragment>
            <Modal show={Show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Group Create</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            {/*<Form.Label>Group Name</Form.Label>*/}
                            <Form.Control
                                type="text"
                                placeholder="Enter Group Name"
                                name="name"
                                value={group.name}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Add to Group Members</Form.Label>
                            <div>
                                <ul>
                                    {
                                        members?.length > 0 && members.filter(ele=>ele?._id !== user?._id).map((item, index) => (
                                            <li key={index}>
                                                <span>{item.name}</span>
                                                <span style={{marginLeft:"10px"}}><input type="checkBox" value={item.name} onChange={handleMembers}/></span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="info" onClick={handleSubmit}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}
export default CreateGroup;

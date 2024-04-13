import React, { useEffect, useState }  from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { fetchApi } from "../utils/api";
import { config } from "../APIHelper/apiUrl";

const AboutInfo=({showGroupInfo,handleGroupInfoClose,selectedItem,user,getAllGroups,selecetdItemData}) => {

    const [groupName,setGroupName]=useState({roomName:selectedItem.roomName})
    const [showInput, setShowInput] = useState(false);

    const handleGroup=()=>{
        setShowInput(true);
    }

    const handleChange=(e)=>{
       const {name,value} = e.target;
       setGroupName({[name]:value}); 
    }

    const handleEditGroup= async ()=>{
      const data = await fetchApi(`${config.ApiUrl}/groupUpdateById/${selectedItem._id}`, {
            method: "POST",
            body:JSON.stringify(groupName)
        })
        if(data.success){
            setShowInput(false);
            getAllGroups();
            selecetdItemData(data?.result);
            setGroupName({roomName:data.result.roomName});
        }
        setGroupName({})
    }

    const deleteGroup=async()=>{
        const data = await fetchApi(`${config.ApiUrl}/groupDeleteById/${selectedItem._id}`, {
            method: "POST",
        })
        if (data.success) {
            getAllGroups();
            handleGroupInfoClose();
        }
    }

    return(
        <>
         <Modal show={showGroupInfo} onHide={handleGroupInfoClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Group Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="" style={{display:"flex",justifyContent:"space-between"}} controlId="exampleForm.ControlInput1">
                            {showInput ? 
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}}>
                            <Form.Control
                                type="text"
                                placeholder="Enter Group Name"
                                name="roomName"
                                value={groupName.roomName}
                                onChange={handleChange}
                                autoFocus
                            /> 
                            <CloseOutlinedIcon onClick={()=>setShowInput(false)} />
                            </div> :<> <Form.Label>Group Name: {selectedItem.roomName}</Form.Label>
                            {selectedItem?.createdBy === user?.name &&<BorderColorOutlinedIcon style={{cursor:"pointer"}} onClick={handleGroup} />} </>}
                        </Form.Group>
                        <Form.Group
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Admin: {selectedItem.createdBy}</Form.Label>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Members: {selectedItem.members.join(',')}</Form.Label>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleGroupInfoClose}>
                        Close
                    </Button>
                    {selectedItem?.createdBy === user?.name && 
                    <Button  onClick={deleteGroup} variant="secondary" className="bg-danger">
                    Delete
                </Button>}
                    {showInput ? 
                    <Button variant="info" onClick={handleEditGroup}>
                        Update
                    </Button> : ''}
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default AboutInfo;
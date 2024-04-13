import React from "react";
import "./message.css"
import {useEffect, useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Modal } from 'antd';

const Message = ({user, message, type,selectedItem, classs,index,id,socket}) => {

    const [icon,setIcon]=useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleted, setDelete] = useState('');
    const [modal, setModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [edit, setEdit] = useState(null);
    const [update,setUpdate] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete=  async (index)=>{
        setDelete("this message is deleted!");
        setAnchorEl(null)
    }
    const handleEdit=(id,m)=>{
        setEdit(m)
        setModal(true);
        setAnchorEl(null)
    }
    const handleOk =  async () => {
        socket.emit("editData", {id,data:edit})
        setConfirmLoading(true);
       await socket.on("msgUpdate",({userMessage})=>{
            setUpdate(userMessage.messageContent)
        })
        setTimeout(() => {
            setModal(false);
            setConfirmLoading(false);
        }, 2000);
        // setEdit(null);
    };

    const handleCancel = () => {
        setModal(false);
    };

    const open = Boolean(anchorEl);
    const Id = open ? 'simple-popover' : undefined;
        return (
            <>
                {user ?
                <div className={`messageBox ${classs}`} onMouseLeave={()=>setIcon(null)} onMouseEnter={()=>setIcon(index)} >
                    {deleted ? handleDelete ? deleted : '' : update ? update : message}
                    {icon === index && <div style={{float:'right',cursor:"pointer"}}><MoreVertIcon onClick={handleClick}/>
                        <Popover
                            style={{marginRight:'20%'}}
                            id={Id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            // anchorOrigin={{
                            //     vertical: 'bottom',
                            //     horizontal: 'right',
                            // }}
                        >
                            <Typography sx={{ p: 1 }}>
                                <Button color="secondary" onClick={()=>handleEdit(id,message)}>Edit</Button>
                            </Typography>
                            <Typography sx={{ p: 1 }}>
                                <Button color="secondary" onClick={()=>handleDelete(index)}>Delete</Button>
                            </Typography>
                        </Popover>
                    </div>}
                </div>
                    :
                    <div className={`messageBox ${classs}`}>
                    {`${message}`}
                    </div>}
                <Modal
                    title="Edit message"
                    open={modal}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <input type="text" value={edit}  placeholder="Message..." onChange={(e)=>setEdit(e.target.value)}/>
                </Modal>
            </>
        )

}
export default Message;
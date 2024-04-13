import React, {useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import "./home.css";
import "./Chat.css"
import Message from "./Message";
import ScrollToBottom from 'react-scroll-to-bottom';
import { useNavigate} from "react-router-dom";
import {useRef} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {fetchApi} from "../utils/api";
import {config} from "../APIHelper/apiUrl";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CreateGroup from "./CreateGroup";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import TelegramIcon from '@mui/icons-material/Telegram';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import Popper from '@mui/material/Popper';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GroupInfo from "./GroupInfo";
import UserProfile from "./UserProfile"
import UserInfo from "./UserInfo";
const drawerWidth = 300;
const settings = ['Edit Profile', 'Create Group', 'Logout'];

const socket = io('http://localhost:7000');

const Homepage = (props) => {
const loginUser = JSON.parse(localStorage.getItem("loginUser")) || null;

    const [msgType, setMsgType] = useState('');
    const navigate = useNavigate();
    const {window} = props;
    const [users, setUsers] = useState([]);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [text, setText] = useState("");
    const inputRef = useRef(null);
    const [groups, setGroups] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [show, setShow] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [selectedChatShow, setSelectedChatShow] = useState(false);
    const [userProfileShow, setUserProfileShow] = useState(false);

    const emojiRef = useRef(null);

    const handleEmojiPicker=()=>{
        setShowEmoji(!showEmoji)
    }
    const handleEmojiSelect = (emoji) => {
        const sym = emoji.unified.split('_');
        const codeArray=[];
        sym.forEach((ele)=>codeArray.push('0x' + ele));
        const emj = String.fromCodePoint(...codeArray);
        setText(text+emj);
        inputRef.current.focus();
    };

    useEffect(() => {
        socket.on('connect', () => {
          console.log('Connected to server');
        });
        // return () => {
        //   socket.disconnect();
        // };
      },[]);    

      useEffect(()=>{
        socket.on('message',(data) => {
                setMessages([...messages, data]);
        });
      })

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                // Handle the click outside the modal/dropdown here
                setShowEmoji(false);
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (loginUser ==null) {
            navigate("/login")
        } 
    }, [])

    useEffect(()=>{
        fetchApi(`${config.ApiUrl}/allGroups`,'','',loginUser?.token).then((ele)=>setGroups(ele))

        const getAllUsers = fetchApi(`${config.ApiUrl}/allUsers`,'','',loginUser?.token);
        getAllUsers.then((ele) => {
            if (ele?.isExpired) {
                localStorage.removeItem("loginUser");
            }
            setUsers(JSON.parse(JSON.stringify(ele)));
        })
    },[])

    useEffect(() => {
        getMessages();
    }, [selectedItem])

    const getMessages = () => {
        
        if (msgType) {
            fetchApi(`${config.ApiUrl}/message/${msgType}`, {
                method: 'POST',
                body: JSON.stringify({id: selectedItem._id, user: loginUser})
            }).then((arr) => {
                setMessages(arr)
            })
        }
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = () => {
        localStorage.removeItem("loginUser");
        navigate("/login");
    }
    const handleClose = () => setShow(false);

    const handleGroupInfoClose = () => setShowGroupInfo(false);

    const handleUserInfoClose = () => setShowUserInfo(false);

    const handleSetting = (e) => {
        if (e === "Edit Profile") {
            setUserProfileShow(true);
        } else if (e === "Create Group") {
            setShow(true)
        } else if (e === "Logout") {
            handleLogout();
        }
        setAnchorElUser(null);
    }

    const send = async() => {
        if (text !== "") {
            const ans = text;
                socket.emit("chat", {
                    ans,
                    userId: loginUser._id,
                    msgTo: selectedItem._id,
                    serverId: selectedItem.socketId,
                    type: msgType,
                });
        }
        inputRef.current.value = '';
        setText('')
    }

    const handleOnChange = (item, type) => {
        setMsgType(type);
        setSelectedItem(item)
        setSelectedChatShow(true);        
    }

    const handleGroupInfo=()=>{
        setShowGroupInfo(!showGroupInfo);
    }
    const handleUserInfo=()=>{
        setShowUserInfo(!showUserInfo);
    }

    const getAllGroups=()=>{
        fetchApi(`${config.ApiUrl}/allGroups`).then((ele)=>setGroups(ele));
    }

    const selecetdItemData=(obj) => {
        setSelectedItem(obj);
    }

    const handleUserProfileClose=()=>{
        setUserProfileShow(false)
    }

    const drawer = (
        <div>
            <ToastContainer />
            <Box sx={{flexGrow: 0, marginTop: 5}}>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                        <Avatar alt="Remy Sharp">{loginUser?.name?.charAt(0).toUpperCase()}</Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{mt: '45px'}}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => (
                        <MenuItem key={setting} onClick={() => handleSetting(setting)}>
                            <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            {/*<Toolbar/>*/}
            <hr/>
            <p><GroupIcon /><h6>Groups</h6></p>
            <ul style={{textDecoration: "none"}}>
                {groups?.length > 0 && groups.map((ele, index) => (
                    <li className={selectedItem.roomName===ele.roomName? 'listsItems' : ''}
                     onClick={() => handleOnChange(ele, "Group")} key={index}>
                        <span><b>{ele.roomName}</b></span>
                    </li>
                ))}
            </ul>
            <p><PersonIcon /><h6>Users</h6></p>
            <ul style={{textDecoration: "none"}}>
                {users.length > 0 && users.filter((ele) => {
                    return ele._id !== loginUser?._id;
                }).map((item, index) => (
                    <li className={selectedItem.name===item.name? 'listsItems' : ''}
                    onClick={() => handleOnChange(item, "Personal")} key={index}>
                        <span><b>{item.name}</b></span>
                        {/*<p><LoginIcon /><span style={{marginLeft:"10px"}}>{item.user}</span></p>*/}
                    </li>
                ))}
            </ul>
        </div>
    );
    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <div>
            {/* <ToastContainer /> */}
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                {selectedChatShow && 
                <AppBar
                    position="fixed"
                    sx={{
                        width: {sm: `calc(100% - ${drawerWidth}px)`},
                        ml: {sm: `${drawerWidth}px`},
                        backgroundColor: {sm: `#F9F9F9`},
                    }}
                >
                    <div className="head">
                        <Toolbar style={{display: 'flex', justifyContent: 'space-between', color: 'black'}}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{mr: 2, display: {sm: 'none'}}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                 {selectedItem.name || selectedItem.roomName}
                            </Typography>
                            <InfoOutlinedIcon onClick={msgType==='Group' ? handleGroupInfo : handleUserInfo} style={{cursor:'pointer'}}/>
                        </Toolbar>
                    </div>
                </AppBar>}
                <Box
                    component="nav"
                    sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: {xs: 'block', sm: 'none'},
                            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: {xs: 'none', sm: 'block'},
                            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                {selectedChatShow ?
                <div className="chatPage">
                    <div className="chatContainer">
                        <ScrollToBottom className="chatBox">
                            {messages && messages.map((item,index) => <Message
                                socket={socket}
                                id={item._id}
                                user={item.msgBy === loginUser._id ? 'you' : ''}
                                message={item.messageContent && item.messageContent}
                                index={index}
                                classs={item.msgBy === loginUser._id ? 'right' : 'left'}/>)}
                        </ScrollToBottom>
                        <Popper  open={showEmoji} ref={emojiRef}>
                            <Box sx={{mt:26,ml:40}}>
                            {showEmoji &&
                        <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                        }
                            </Box>
                        </Popper>
                        <div className="inputBox">
                            <AddReactionOutlinedIcon ref={emojiRef} style={{cursor:'pointer'}} onClick={handleEmojiPicker}/>
                            <input ref={inputRef} type="text"  className="form-control shadow-none"
                                   value={text}
                                //    onKeyPress={(e) => e.key === "Enter" ? send() : null}
                                   placeholder={`send a message ${Object.keys(selectedItem).length  === 0 ? '' : selectedItem.name || selectedItem.roomName} ...`}
                                   onChange={(e) => setText(e.target.value)}/>
                            <div className="sendbtn"><TelegramIcon onClick={send} className="chatbtn"/></div>
                        </div>
                    </div>
                </div> : <div className="defaultBgImange"></div>}
            </Box>
            <CreateGroup getAllGroups={getAllGroups} user={loginUser} Show={show} members={users} handleClose={handleClose}/>
            {msgType === 'Group' ? 
            <GroupInfo selecetdItemData={selecetdItemData} getAllGroups={getAllGroups} user={loginUser} showGroupInfo={showGroupInfo} handleGroupInfoClose={handleGroupInfoClose} selectedItem={selectedItem} />
            : <UserInfo showUserInfo={showUserInfo} handleUserInfoClose={handleUserInfoClose} selectedItem={selectedItem}/>}
            {userProfileShow && <UserProfile userProfileShow={userProfileShow} handleUserProfileClose={handleUserProfileClose} user={loginUser} socket={socket} />}
        </div>
    )
}
export default Homepage;

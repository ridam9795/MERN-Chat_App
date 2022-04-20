import React from 'react'

import { Box, Text } from "@chakra-ui/layout";
import { Input, Spinner, Tooltip, useDisclosure } from '@chakra-ui/react'
import { useState } from "react";
import { Button } from "@chakra-ui/button";
 import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
 import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useToast } from "@chakra-ui/react";
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';


import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  const {
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
    setChats,
    userData,
        setUserData
    
    
  } = ChatState();
  const handleSearch = async () => {
      console.log("search: ",search)
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`api/user?search=${search}`, config);
      data.map((d) => {
        console.log(d)
      })
      if (!chats.find((c) => c._id === data._id)) {
        
        console.log("Side Drawer Data: ",data," Chats",chats)
        setChats([data, ...chats])
      };

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const inputSearch = async (e) => {
    setSearch(e.target.value);
     
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId) => {
    //console.log("access chat: ",userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`api/chat`, { userId }, config);
      console.log("data: ", data);
               console.log("sideDrawer access chat ",chats," data: ",data)
     
      if (!chats.find((c) =>  c._id === data._id)) {
        setChats([data, ...chats])
      };
      setUserData([data,...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (<div>
      <Box
      d="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px">
      <Tooltip label="Search Users to chat" aria-label='A tooltip' hasArrow placement="bottom-end">
      <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button></Tooltip>
          <Text fontSize="2xl" fontFamily="Work sans">
          Sprint-Chat
        </Text>
        <div>
          <Menu>
          <MenuButton p={1}>
          <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
          <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
           <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
            {/* To display user Icon */}
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
          <MenuList>
            <ProfileModal user={user} >
                <MenuItem>My Profile</MenuItem>

            </ProfileModal>
                <MenuDivider />
                
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
       <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
             <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={inputSearch}
            />
           <Button onClick={handleSearch}>Go</Button>

          </Box>
           {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
          )}
  {loadingChat && <Spinner ml="auto" d="flex" />}

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    

    </div>)
  
}

export default SideDrawer

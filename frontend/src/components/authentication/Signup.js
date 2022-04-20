import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import {React,useState} from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import { ChatState } from '../../Context/ChatProvider';
const Signup = () => {
    const [show,setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [password, setPassword] = useState()
    const [pic, setPic] = useState()
    const [loading,setLoading]=useState(false)
    const toast = useToast()
  const history = useHistory();
  const {  setUser } = ChatState();
    const handleClick=()=>{
        setShow(!show)
    }
    const postDetails = (pics) => {
      setLoading(true);
      if (pics === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      console.log(pics);
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dcnypp0h4");
        fetch("https://api.cloudinary.com/v1_1/dcnypp0h4/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
    };
  
    const submitHandler=async ()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if(password !== confirmpassword){
      toast({
        title: "Password Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try{
      const config = {
        headers: {
          "Content-type":"application/json"
        }
      }
      const {data} = await axios.post("api/user",{name,email,password,pic},config)
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo', JSON.stringify(data))
      setUser(data);
     setLoading(false)
     history.push('/chats')
    }catch(error){
      toast({
        title: "Error Occured!",
        description:error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
    }

    } 
  return (
    <div>
      <VStack spacing='5px'>
       <FormControl id='first-name' >
           <FormLabel>
              Name
           </FormLabel>
           <Input 
               placeholder='Enter Your Name'
               onChange={(e)=>setName(e.target.value)}
               />
       </FormControl>
       <FormControl id='email' isRequired>
           <FormLabel>
              Email
           </FormLabel>
           <Input 
               placeholder='Enter Your Email'
               onChange={(e)=>setEmail(e.target.value)}
               />
       </FormControl>
       <FormControl id='password' isRequired>
           <FormLabel>
              Password
           </FormLabel>
           <InputGroup>
           <Input 
               type={show?'text':'password'}
               placeholder='Enter Your Password'
               onChange={(e)=>setPassword(e.target.value)}
               />
               <InputRightElement >
               <Button h="1.75rem" size="sm" onClick={handleClick}>
                 {show ? "Hide" :"Show"}
               </Button>
               </InputRightElement>
           </InputGroup>
          
       </FormControl>
       <FormControl id='password' isRequired>
           <FormLabel>
             Confirm  Password
           </FormLabel>
           <InputGroup>
           <Input 
               type={show?'text':'password'}
               placeholder='Confirm Password'
               onChange={(e)=>setConfirmpassword(e.target.value)}
               />
               <InputRightElement >
               <Button h="1.75rem" size="sm" onClick={handleClick}>
                 {show ? "Hide" :"Show"}
               </Button>
               </InputRightElement>
           </InputGroup>
          
       </FormControl>
       <FormControl id='pic' isRequired>
           <FormLabel>
              Upload your Picture
           </FormLabel>
           <Input 
                type="file"
                p={.5}
                accept="image/*"
               onChange={(e)=>postDetails(e.target.files[0])}
               />
       </FormControl>
       <Button 
        colorScheme="blue"
        width="100%"
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
       >Sign Up</Button>
        
      </VStack>
    </div>
  )
}

export default Signup
